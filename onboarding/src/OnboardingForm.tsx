import { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import Container from "./Container";
import Card from "./components/Card";
import useFormStepper from "./hooks/useFormStepper";
import { useAuthConfig } from "./context/AuthConfigContext";

interface ErrorState {
	firstNameErrors: string[];
	lastNameErrors: string[];
	emailErrors: string[];
	passwordErrors: string[];
	confirmPasswordErrors: string[];
}
const defaultErrors: ErrorState = {
	firstNameErrors: [],
	lastNameErrors: [],
	emailErrors: [],
	passwordErrors: [],
	confirmPasswordErrors: [],
};

function OnboardingForm(): ReactElement {
	let navigate = useNavigate();
	const { login } = useAuthConfig();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cpassword, setCPassword] = useState("");
	const [errors, setErrors] = useState<ErrorState>(defaultErrors);
	const {StepperComponent} = useFormStepper();

	const verifyFields = () => {
		const newErrors: ErrorState = {
			firstNameErrors: [],
			lastNameErrors: [],
			emailErrors: [],
			passwordErrors: [],
			confirmPasswordErrors: [],
		};

		if (firstName.length === 0) {
			newErrors["firstNameErrors"].push("Please enter your first name");
		}

		if (lastName.length === 0) {
			newErrors["lastNameErrors"].push("Please enter your last name");
		}

		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || email.length < 4) {
			newErrors["emailErrors"].push("Invalid Email");
		}

		if (password.length === 0) {
			newErrors["passwordErrors"].push("Please enter a password");
		}

		if (cpassword.length === 0) {
			newErrors["passwordErrors"].push("Please enter a matching password");
		}

		if (password != cpassword) {
			newErrors["confirmPasswordErrors"].push(
				"Please enter a matching password",
			);
		}
		setErrors(newErrors);

		// If number of errs is 0, we can submit
		const errLengths = Object.values(newErrors)
			.map((errs) => errs.length)
			.reduce((acc, ele) => acc + ele, 0);
		return errLengths === 0;
	};

	const onSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		if (!verifyFields()) {
			return;
		}

		const isAdmin = email.endsWith("@zealthy.com");
		const URL = "http://localhost:3000/user/create";
		const response = await fetch(URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName,
				lastName,
				onboardingStep: "2",
				email,
				password,
				isAdmin,
				birthDate: "",
				aboutMe: "",
				addressLineOne: "",
				addressLineTwo: "",
				state: "",
				city: "",
				zip: "",
			}),
		});
		const newErrors = {...defaultErrors}
		// Sign the user in if succcessful
		if (response.ok) {
			// Dispatch React Context sign in
			setErrors(newErrors)
			login(email, password, (_) => {})
		} else {
			newErrors['emailErrors'].push("Email already taken! Please select another one")
			setErrors(newErrors);
		}
	};

	return (
		<Container>
			<Card
				direction='column'
				title='Onboarding Form'
				showHomeButton={true}
				showMoveBackButton={true}
				moveBackHandler={() => navigate("/")}
			>
				{StepperComponent}
				<form>
					<div className='state-city-zipcode'>
						<div className='state-city-zipcode-column'>
							<h3>First Name</h3>
							<div className='form-errors'>
								<ul>
									{errors["firstNameErrors"].map((errString: string, idx) => (
										<li key={idx}>{errString}</li>
									))}
								</ul>
							</div>
							<input
								type='text'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div className='state-city-zipcode-column'>
							<h3>Last Name</h3>
							<div className='form-errors'>
								<ul>
									{errors["lastNameErrors"].map((errString: string, idx) => (
										<li key={idx}>{errString}</li>
									))}
								</ul>
							</div>
							<input
								type='text'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					</div>
					<div className='text-group'>
						<h3>Email</h3>
						<div className='form-errors'>
							<ul>
								{errors["emailErrors"].map((errString: string, idx) => (
									<li key={idx}>{errString}</li>
								))}
							</ul>
						</div>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='text-group'>
						<h3>Password</h3>
						<div className='form-errors'>
							<ul>
								{errors["passwordErrors"].map((errString: string, idx) => (
									<li key={idx}>{errString}</li>
								))}
							</ul>
						</div>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className='text-group'>
						<h3>Confirm Password</h3>
						<div className='form-errors'>
							<ul>
								{errors["confirmPasswordErrors"].map(
									(errString: string, idx) => (
										<li key={idx}>{errString}</li>
									),
								)}
							</ul>
						</div>
						<input
							type='password'
							value={cpassword}
							onChange={(e) => setCPassword(e.target.value)}
						/>
					</div>
				</form>
				<button onClick={(e) => onSubmit(e)}>Submit</button>
			</Card>
		</Container>
	);
}

export default OnboardingForm;
