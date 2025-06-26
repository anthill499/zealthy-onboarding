import { PropsWithChildren, ReactElement, useState } from "react";
import "../index.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router";
interface CardProps {
	alignItems?: "center" | "start" | "end";
	justifyContent?: "center" | "start" | "end";
	direction?: "column" | "row";
	title?: string;
	showHomeButton?: boolean;
	showMoveBackButton?: boolean;
	moveBackHandler?: () => void;
}

function Card(
	props: PropsWithChildren<CardProps>,
): ReactElement<PropsWithChildren<CardProps>> {
	const {
		children,
		alignItems,
		justifyContent,
		direction,
		title,
		showHomeButton,
		showMoveBackButton,
		moveBackHandler,
	} = props;
	let navigate = useNavigate();
	const [hoverHomeIcon, setHoverIcon] = useState<boolean>(false);
	const [hoverMoveBackIcon, setHoverMoveBackIcon] = useState<boolean>(false);
	const location = useLocation();
	const { pathname } = location;
	
	return (
		<div className='card-container'>
			<div
				className='card'
				style={{
					justifyContent,
					alignItems,
					flexDirection: direction,
				}}
			>
				{title && (
					<div className='card-header'>
						{showMoveBackButton && (
							<span
								className='card-header-button'
								onPointerEnter={() => setHoverMoveBackIcon(true)}
								onPointerLeave={() => setHoverMoveBackIcon(false)}
							>
								<ArrowBackIcon
									onClick={pathname !== "/about" ? moveBackHandler: () => {}}
									style={{
										opacity: hoverMoveBackIcon ? 0.75 : 1,
									}}
									color={pathname === "/about" ? "disabled" : "primary"}
								/>
							</span>
						)}
						<h1>{title}</h1>
						{showHomeButton && (
							<span
								className='card-header-button'
								onPointerEnter={() => setHoverIcon(true)}
								onPointerLeave={() => setHoverIcon(false)}
							>
								<HomeIcon
									onClick={() => navigate("/")}
									style={{
										opacity: hoverHomeIcon ? 0.75 : 1,
									}}
								/>
							</span>
						)}
					</div>
				)}
				{children}
			</div>
		</div>
	);
}

export default Card;
