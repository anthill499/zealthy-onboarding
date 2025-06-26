import { useLocation, useNavigate } from "react-router";
import { useAuthConfig } from "./context/AuthConfigContext";
import useFormStepper from "./hooks/useFormStepper";
import "./index.css";

function NavBar() {
    const { user, logout } = useAuthConfig()
    const { navigateToDefaultStep, currentStep } = useFormStepper()
	let navigate = useNavigate();
    let {pathname} = useLocation()
	return (
		<nav>
			<div>Zealthy Takehome</div>
            {user != null && <div className="card-header">
                <div>Welcome {user.firstName}</div>
                <button onClick={logout}>Log Out</button>
                {currentStep < 0 && <button onClick={navigateToDefaultStep}>Continue Onboarding</button>}
                {user.isAdmin && <button onClick={() => navigate("/table")}>Table</button>}
                {user.isAdmin && pathname !== '/admin' && <button onClick={() => navigate("/admin")}>Onboard Configuration</button>}
            </div>}
		</nav>
	);
}

export default NavBar;
