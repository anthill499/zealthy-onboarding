import { useMemo} from "react";
import { useAuthConfig } from "../context/AuthConfigContext";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { steps, StepType } from "../Metadata";
import { useLocation, useNavigate } from "react-router";

function useFormStepper() {
	const { user } = useAuthConfig();
	const location = useLocation();
	let navigate = useNavigate();
	const defaultStartStep = user != null ? Number(user.onboardingStep) - 1 : 1;
	const { pathname } = location;

	const findStepIdxByPathname = (path: string): number => {
		return steps.findIndex((step: StepType) => step.url === path);
	};
	const currentStep = useMemo(() => findStepIdxByPathname(pathname), [location]);

	const StepperComponent = useMemo(
		() => (
			<Stepper activeStep={currentStep} alternativeLabel>
				{steps.map((step, i) => (
					<Step key={i}>
						<StepLabel>{step.title}</StepLabel>
					</Step>
				))}
			</Stepper>
		),
		[location],
	);

	const navigateToDefaultStep = () => {
		const defaultStepURL = steps[defaultStartStep].url;
		navigate(defaultStepURL);
	};

	return {
		StepperComponent,
		currentStep,
		navigateToDefaultStep,
		findStepIdxByPathname,
	};
}

export default useFormStepper;
