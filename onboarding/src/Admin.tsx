import Container from "./Container";
import Card from "./components/Card";
import "./index.css";
import { steps } from "./Metadata";
import { useMemo, useState } from "react";
import { useAuthConfig } from "./context/AuthConfigContext";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useFormStepper from "./hooks/useFormStepper";
("use strict");


function Admin() {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const { adminConfig, updateConfig, saveAdminConfigChangesAsync,  } =
		useAuthConfig();
	const { navigateToDefaultStep } = useFormStepper()
	const [error, setError] = useState<string>('');

	const AdminConfigurableComponents = useMemo(() => {
		const {
			birthDate,
			aboutMe,
			addressLineOne,
			addressLineTwo,
			state,
			city,
			zip,
		} = adminConfig;
		return [
			<div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='lastName'
						name='firstName'
						checked={true}
						disabled={true}
					/>
					<label htmlFor='firstName'>First Name</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='lastName'
						name='lastName'
						checked={true}
						disabled={true}
					/>
					<label htmlFor='lastName'>Last Name</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='email'
						name='email'
						checked={true}
						disabled={true}
					/>
					<label htmlFor='email'>Email</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='password'
						name='password'
						checked={true}
						disabled={true}
					/>
					<label htmlFor='password'>Password</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='confirmPassword'
						name='confirmPassword'
						checked={true}
						disabled={true}
					/>
					<label htmlFor='confirmPassword'>Confirm Password</label>
				</div>
			</div>,
			<div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='aboutMe'
						name='aboutMe'
						checked={aboutMe}
						onChange={() => updateConfig({ aboutMe: !aboutMe })}
					/>
					<label htmlFor='aboutMe'>About Me</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='birthDate'
						name='birthDate'
						checked={birthDate == true}
						onChange={() => updateConfig({ birthDate: !birthDate })}
					/>
					<label htmlFor='birthDate'>Birthdate</label>
				</div>
			</div>,
			<div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='addressLineOne'
						name='addressLineOne'
						checked={addressLineOne}
						onChange={() =>
							updateConfig({
								addressLineOne: !addressLineOne,
							})
						}
					/>
					<label htmlFor='addressLineOne'>Address Line 1</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='addressLineTwo'
						name='addressLineTwo'
						checked={addressLineTwo}
						onChange={() =>
							updateConfig({
								addressLineTwo: !addressLineTwo,
							})
						}
					/>
					<label htmlFor='addressLineTwo'>Address Line 2</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='state'
						name='state'
						checked={state}
						onChange={() => updateConfig({ state: !state })}
					/>
					<label htmlFor='state'>State</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='city'
						name='city'
						checked={city}
						onChange={() => updateConfig({ city: !city })}
					/>
					<label htmlFor='city'>City</label>
				</div>
				<div className='checkbox-input'>
					<input
						type='checkbox'
						id='zip'
						name='zip'
						checked={zip}
						onChange={() => updateConfig({ zip: !zip })}
					/>
					<label htmlFor='zip'>Zip</label>
				</div>
			</div>,
		];
	}, [adminConfig]);

	const verifyCheckboxInputs = (): boolean => {
		const {
			birthDate,
			aboutMe,
			addressLineOne,
			addressLineTwo,
			state,
			city,
			zip,
		} = adminConfig;
		// Check about me step
		if (!aboutMe && !birthDate) {
			setError('The About Me onboarding step needs atleast one component!')
			return false
		} 

		if (!addressLineOne && !addressLineTwo && !state && !city && !zip ) {
			setError('The Address onboarding step needs atleast one component!')
			return false
		} 

		setError('')
		return true
	};

	const previousStepHandler = () => {
		if (currentStep === 0) {
			return;
		}
		setCurrentStep(currentStep - 1);
	};

	const nextStepHandler = () => {
		if (currentStep === 2) {
			saveAdminConfigChanges();
			return;
		}
		setCurrentStep(currentStep + 1);
	};

	const saveAdminConfigChanges = () => {
		if (!verifyCheckboxInputs()) {
			return;
		}
		saveAdminConfigChangesAsync();
		navigateToDefaultStep()
	};

	return (
		<Container>
			<Card title={"Configure " + steps[currentStep].title} showHomeButton={true}>
				<Stepper activeStep={currentStep} alternativeLabel>
					{steps.map((step, i) => (
						<Step key={i}>
							<StepLabel>{step.title}</StepLabel>
						</Step>
					))}
				</Stepper>
				{error.length > 0 && <div className='form-errors'>{error}</div>}
				{AdminConfigurableComponents[currentStep]}
				<div className='button-group'>
					<button onClick={previousStepHandler} disabled={currentStep === 0}>
						Back
					</button>
					<button onClick={nextStepHandler}>
						{currentStep === 2 ? "Save Changes" : "Next"}
					</button>
				</div>
			</Card>
		</Container>
	);
}

export default Admin;
