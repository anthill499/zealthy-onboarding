import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router";
import App from "./App.js";
import SignIn from "./SignIn.js";
import AboutMe from "./AboutMe.js";
import Address from "./Address.js";
import Admin from "./Admin.js";
import OnboardingForm from "./OnboardingForm.js";
import DataTable from "./DataTable.js";
import MongoDBLogger from "./MongoDBLogger.js";
import { RequireAuth } from "./RequireAuth.js";
import RequireNoAuth from "./RequireNoAuth.js";

function RouterFunctionalComponent(): ReactElement {
	return (
		<Routes>
			<Route path='/' element={<App />} />
			<Route element={<RequireNoAuth />}>
				<Route path='/signin' element={<SignIn />} />
				<Route path='/signup' element={<OnboardingForm />} />
			</Route>
			{/* Protected routes */}
			<Route element={<RequireAuth />}>
				<Route path='/about' element={<AboutMe />} />
				<Route path='/address' element={<Address />} />
			</Route>
			<Route path='/dblog' element={<MongoDBLogger />} />
			<Route path='/admin' element={<Admin />} />
			<Route path='/table' element={<DataTable />} />
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default RouterFunctionalComponent;
