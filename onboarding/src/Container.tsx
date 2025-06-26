import { PropsWithChildren, ReactElement } from "react";
import "./index.css";
import NavBar from "./NavBar";

function Container(props: PropsWithChildren): ReactElement {
	const { children } = props;
	return (
		<div className='container'>
			<NavBar />
			{children}
		</div>
	);
}

export default Container;
