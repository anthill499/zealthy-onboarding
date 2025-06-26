import { ReactElement, useEffect, useMemo, useState } from "react";
import Container from "./Container";
import Card from "./components/Card";
import { stateCityMap } from "./Metadata";
import { useNavigate } from "react-router";
import useFormStepper from "./hooks/useFormStepper";
import { useAuthConfig } from "./context/AuthConfigContext";

function Address(): ReactElement {
	const { user, autoSaveOnUnmount } = useAuthConfig();
	const { currentStep } = useFormStepper();
	let navigate = useNavigate();
	const { adminConfig } = useAuthConfig();
	// 2nd layer protection for auth
	if (!user) {
		throw new Error("User accessed this page without logging in");
	}
	const [addressOne, setAddressOne] = useState<string>(
		user.addressLineOne || "",
	);
	const [addressTwo, setAddressTwo] = useState<string>(
		user.addressLineTwo || "",
	);
	const [selectedState, setSelectedState] = useState<string>(
		user.state || "Alabama",
	);
	const [selectedCity, setSelectedCity] = useState<string>(
		user.city || stateCityMap[selectedState][0],
	);
	const [zipCode, setZipCode] = useState<string>(user.zip || "");

	const { StepperComponent } = useFormStepper();

	const autoSaveAddressFields = () =>
		autoSaveOnUnmount({
			...user,
			addressLineOne: addressOne,
			addressLineTwo: addressTwo,
			state: selectedState,
			city: selectedCity,
			zip: zipCode,
			onboardingStep: String(currentStep + 1),
		});
	// Unmount Trigger
	useEffect(() => {
		return () => autoSaveAddressFields();
	}, [addressOne, addressTwo, selectedState, selectedCity, zipCode]);

	useEffect(() => {
		// Trigger autosave on unload
		const handleBeforeUnload = () => autoSaveAddressFields();
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [addressOne, addressTwo, selectedState, selectedCity, zipCode]);

	const stateData: string[] = useMemo(
		() => Object.keys(stateCityMap),
		[stateCityMap],
	);

	const setZipcodeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newZipcode = e.target.value;
		if (newZipcode.length > 5 || !/^\d*$/.test(newZipcode)) {
			return;
		}
		setZipCode(newZipcode);
	};

	const onSubmit = () => {
		// Trigger autosave on unmount
		const newData = {
			...user,
			addressLineOne: addressOne,
			addressLineTwo: addressTwo,
			state: selectedState,
			city: selectedCity,
			zip: zipCode,
		};
		autoSaveOnUnmount(newData);
	};

	return (
		<Container>
			<Card
				direction='column'
				title='My Address'
				showHomeButton={true}
				showMoveBackButton={true}
				moveBackHandler={() => navigate("/about")}
			>
				{StepperComponent}
				<form>
					<div className='text-group'>
						{adminConfig.addressLineOne && (
							<>
								<h3>Address</h3>
								<span>Address Line 1</span>
								<input
									type='text'
									value={addressOne}
									onChange={(e) => setAddressOne(e.target.value)}
								/>
							</>
						)}
						{adminConfig.addressLineTwo && (
							<>
								<span>Address Line 2</span>
								<input
									type='text'
									placeholder='e.g Apartment 1, Floor 1, Penthouse'
									value={addressTwo}
									onChange={(e) => setAddressTwo(e.target.value)}
								/>
							</>
						)}
						<div className='state-city-zipcode'>
							{adminConfig.state && (
								<div className='state-city-zipcode-column'>
									<span>State</span>
									<select
										name='state'
										value={selectedState}
										onChange={(e) => setSelectedState(e.target.value)}
									>
										{stateData.map((stateOption: string, idx: number) => (
											<option value={stateOption} key={idx}>
												{stateOption}
											</option>
										))}
									</select>
								</div>
							)}
							{adminConfig.city && (
								<div className='state-city-zipcode-column'>
									<span>City</span>
									<select
										name='city'
										value={selectedCity}
										onChange={(e) => setSelectedCity(e.target.value)}
									>
										{stateCityMap[selectedState].map(
											(city: string, idx: number) => (
												<option value={city} key={idx}>
													{city}
												</option>
											),
										)}
									</select>
								</div>
							)}
							{adminConfig.zip && (
								<div className='state-city-zipcode-column'>
									<span>Zip Code</span>
									<input
										type='text'
										value={zipCode}
										onChange={setZipcodeHandler}
									/>
								</div>
							)}
						</div>
					</div>
				</form>
				<button
					onClick={() => {
						onSubmit();
						navigate("/table");
					}}
				>
					Submit
				</button>
			</Card>
		</Container>
	);
}

export default Address;
