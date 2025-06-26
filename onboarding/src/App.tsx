import { useNavigate } from "react-router";
import Container from "./Container";
import Card from "./components/Card";
import { useAuthConfig } from "./context/AuthConfigContext";
import useFormStepper from "./hooks/useFormStepper";

("use strict");

function App() {
	let navigate = useNavigate();
	const { user } = useAuthConfig();
  const { navigateToDefaultStep} = useFormStepper()
	return (
		<Container>
			<Card title='Welcome to User Onboarding!'>
				<div className='button-group'>
					{!user ? (
						<>
							<button onClick={() => navigate("/signup")}>Sign Up</button>
							<button onClick={() => navigate("/signin")}>Sign In</button>
						</>
					) : (
						<button onClick={navigateToDefaultStep}>Continue</button>
					)}
				</div>
			</Card>
		</Container>
	);
}

export default App;
