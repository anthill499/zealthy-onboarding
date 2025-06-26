import { ReactElement, useEffect, useMemo, useState } from "react";
import Container from "./Container";
import Card from "./components/Card";
import { useNavigate } from "react-router";
import useFormStepper from "./hooks/useFormStepper";
import { useAuthConfig } from "./context/AuthConfigContext";

function AboutMe(): ReactElement {
	let navigate = useNavigate();
	const { user, autoSaveOnUnmount, adminConfig } = useAuthConfig();
	const [aboutMe, setAboutMe] = useState<string>(user?.aboutMe || "");
	const [birthDate, setBirthDate] = useState<string>(user?.birthDate || "");
	const { StepperComponent, currentStep } = useFormStepper();

	if (!user) {
		throw new Error("User accessed this page without logging in");
	}

	const autoSaveAboutMeFields = () =>
		autoSaveOnUnmount({
			...user,
			aboutMe,
			birthDate,
			onboardingStep: String(currentStep + 1),
		});

	useEffect(() => {
		// Trigger autosave on unload (tab close, browser close)
		window.addEventListener("beforeunload", autoSaveAboutMeFields);

		return () => {
			// Trigger autosave on component unmount
			autoSaveAboutMeFields();

			// Remove event listener
			window.removeEventListener("beforeunload", autoSaveAboutMeFields);
		};
	}, [aboutMe, birthDate]);

	const AboutMeComponents = useMemo(() => {
		return {
			birthDate: (
				<div className='text-group'>
					<h3>Birth Date</h3>
					<input
						type='date'
						value={birthDate}
						onChange={(e) => setBirthDate(e.target.value)}
					/>
				</div>
			),
			aboutMe: (
				<div className='text-group'>
					<h3>About Me</h3>
					<span className='description-span'>
						Tell us about yourself! (max: 300 characters. {aboutMe.length}
						/300)
					</span>
					<textarea
						value={aboutMe}
						onChange={(e) => setAboutMe(e.target.value)}
						rows={5}
						maxLength={300}
					/>
				</div>
			),
		};
	}, [aboutMe, birthDate]);

	const renderComponents = () => {
		return ["birthDate", "aboutMe"].map((key: string, i: number) => {
			// @ts-ignore
			if (adminConfig[key]) {
				// @ts-ignore
				return <section key={i}>{AboutMeComponents[key]}</section>;
			}
			return null;
		});
	};
	
	return (
		<Container>
			<Card
				direction='column'
				title='About Me'
				showHomeButton={true}
				showMoveBackButton={true}
				moveBackHandler={() => navigate("/form")}
			>
				{StepperComponent}
				<form>
					{/* @ts-ignore */}
					{renderComponents()}
				</form>
				<button onClick={() => navigate("/address")}>Next</button>
			</Card>
		</Container>
	);
}

export default AboutMe;
