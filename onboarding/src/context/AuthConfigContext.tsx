import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { useNavigate } from "react-router";
import { steps } from "../Metadata";

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	onboardingStep: string;
	email: string;
	password: string;
	birthDate: string;
	aboutMe: string;
	addressLineOne: string;
	addressLineTwo: string;
	state: string;
	city: string;
	zip: string;
	isAdmin: boolean;
};

export type FormAdminConfig = {
	firstName: boolean;
	lastName: boolean;
	birthDate: boolean;
	aboutMe: boolean;
	addressLineOne: boolean;
	addressLineTwo: boolean;
	state: boolean;
	city: boolean;
	zip: boolean;
};

type AuthConfigContextType = {
	// Auth
	user: User | null;
	login: (
		email: string,
		password: string,
		errorHandler: (data: {
			emailErrors: string[];
			passwordErrors: string[];
		}) => void,
	) => Promise<void>;
	logout: () => void;
	// Admin Config
	adminConfig: FormAdminConfig;
	updateConfig: (newConfig: Partial<FormAdminConfig>) => void;
	saveAdminConfigChangesAsync: () => void;
	autoSaveOnUnmount: (data: User) => void;
};

type ConfigFetchQueryResponseType = {
	message?: string;
	error?: string;
	adminConfig?: FormAdminConfig;
};

const ConfigContext = createContext<AuthConfigContextType | undefined>(
	undefined,
);

const defaultAdminConfigState: FormAdminConfig = {
	firstName: true,
	lastName: true,
	birthDate: true,
	aboutMe: true,
	addressLineOne: true,
	addressLineTwo: true,
	state: true,
	city: true,
	zip: true,
};

// Provider component
export const AuthConfigProvider = ({ children }: { children: ReactNode }) => {
	let navigate = useNavigate();
	// Config settings
	const [adminConfig, setConfig] = useState<FormAdminConfig>(
		defaultAdminConfigState,
	);
	const [user, setUser] = useState<User | null>(null);

	// Fetch Admin Config
	useEffect(() => {
		createOrFetchConfig();
	}, []);

	// Admin Configuration Functions
	const updateConfig = (newConfig: Partial<FormAdminConfig>) => {
		setConfig((prevConfig) => {
			return { ...prevConfig, ...newConfig };
		});
	};

	const createOrFetchConfig = async () => {
		const response = await fetch("http://localhost:3000/form/create", {
			method: "POST",
		});
		const responseJson: ConfigFetchQueryResponseType = await response.json();
		// Update state
		if (responseJson.adminConfig != null) {
			setConfig(responseJson.adminConfig);
		} else {
			throw new Error("Error happened during config fetch");
		}
	};

	// Onboarding AutosAVE
	const autoSaveOnUnmount = async (data: User) => {
		const res = await fetch("http://localhost:3000/user/update", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!res.ok) {
			throw new Error("Error happened during http request");
		}
		const responseJson = await res.json();
		setUser(responseJson.user);
		// Set new user global state in context
	};

		// Onboarding AutosAVE
	const saveAdminConfigChangesAsync = async () => {
		const res = await fetch("http://localhost:3000/form/update", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(adminConfig),
		});
		if (!res.ok) {
			throw new Error("Error happened during http request");
		}
		const responseJson = await res.json();
		setConfig(responseJson.adminConfig);
		// Set new user global state in context
	};

	const login = async (
		email: string,
		password: string,
		errorHandler: (errors: {
			emailErrors: string[];
			passwordErrors: string[];
		}) => void,
	) => {
		const res = await fetch("http://localhost:3000/user/signin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (!res.ok) {
			errorHandler(data!);
		} else {
			setUser(data);
			const { onboardingStep } = data;
			const castedOnboardingStep = Number(onboardingStep);
			navigate(steps[castedOnboardingStep - 1].url);
		}
	};

	// Log out
	const logout = () => {
		setUser(null);
	};

	return (
		<ConfigContext.Provider
			value={{
				user,
				login,
				logout,
				adminConfig,
				updateConfig,
				saveAdminConfigChangesAsync,
				autoSaveOnUnmount,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

// Custom Hook to access information
export const useAuthConfig = () => {
	const ctx = useContext(ConfigContext);
	if (!ctx)
		throw new Error("useAuthConfig must be used inside AuthConfigProvider");
	return ctx;
};
