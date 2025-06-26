import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { AuthConfigProvider } from "./context/AuthConfigContext.js";
import RouterFunctionalComponent from "./Routes.js";
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthConfigProvider>
				<RouterFunctionalComponent />
			</AuthConfigProvider>
		</BrowserRouter>
	</StrictMode>,
);
