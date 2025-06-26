import { ReactElement, useEffect, useState } from "react";

import Container from "./Container";
import Card from "./components/Card";
import { useAuthConfig } from "./context/AuthConfigContext";
import { useNavigate } from "react-router";
interface ErrorState {
	emailErrors: string[];
	passwordErrors: string[];
}
const defaultErrors: ErrorState = {
	emailErrors: [],
	passwordErrors: []
}

function SignIn(): ReactElement {
	let navigate = useNavigate()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ErrorState>(defaultErrors)
	const ctx = useAuthConfig()

	const verifyFields = () => {
		const newErrors: ErrorState = defaultErrors;
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || email.length < 4) {
			newErrors['emailErrors'].push("Invalid Email")
		}
		
		if (password.length === 0) {
			newErrors['passwordErrors'].push("Please enter a password")
		}

		if (password.length === 0) {
			newErrors['passwordErrors'].push("Please enter a password")
		}
		setErrors(newErrors)

		// If number of errs is 0, we can submit
		const numErrors = newErrors['emailErrors'].length + newErrors['passwordErrors'].length
		return numErrors === 0
	}

	const onSubmit = async () => {
		if (!verifyFields()) {
			return;
		}

		ctx.login(email, password, (errors: ErrorState) => setErrors(errors))
	}

	return (
		<Container>
			<Card direction='column' showHomeButton={true} title="Sign In">
				<form>
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
				</form>
				<div className='button-group'>
					<button onClick={onSubmit}>Submit</button>
					<button onClick={() => navigate("/signup")}>Sign up</button>
				</div>					
			</Card>
		</Container>
	);
}

export default SignIn;
