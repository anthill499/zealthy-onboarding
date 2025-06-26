import { useEffect, useState } from "react";
import Card from "./components/Card";
import Container from "./Container";
import "./index.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { User } from "./context/AuthConfigContext";
import { TablePagination } from "@mui/material";
interface UserData {
	_id?: string;
	firstName: string;
	lastName: string;
	onboardingStep: string;
	email: string;
	password: string;
	birthDate: null | string;
	aboutMe: null | string;
	addressLineOne: null | string;
	addressLineTwo: null | string;
	state: null | string;
	city: null | string;
	zip: null | string;
	isAdmin: boolean;
	__v: number;
}

function DataTable() {
	const [data, setData] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const rowsPerPage = 5;

	useEffect(() => {
		const fetchUsers = async () => {
			const URL = "http://localhost:3000/users/all";
			const response = await fetch(URL, {
				method: "GET",
			});

			if (!response.ok) {
				setData([]);
				return;
			}
			const responseData = await response.json();
			setData(
				responseData.users.map((user: UserData) => {
					const userData = {
						...user,
						id: user._id,
					};
					delete userData["_id"];
					return userData;
				}),
			);
		};
		fetchUsers();
		setLoading(false);
	}, []);

	const handleChangePage = (
		_: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setPage(newPage);
	};

	if (loading) {
		return null;
	}
	return (
		<Container>
			<Card title='Admin Data Table' showHomeButton={true}>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell align='left'>ID</TableCell>
								<TableCell align='left'>Is Admin</TableCell>
								<TableCell align='left'>First Name</TableCell>
								<TableCell align='left'>Last Name</TableCell>
								<TableCell align='left'>Onboarding Step</TableCell>
								<TableCell align='left'>Email</TableCell>
								<TableCell align='left'>Password</TableCell>
								<TableCell align='left'>Birthdate</TableCell>
								<TableCell align='left'>About Me </TableCell>
								<TableCell align='left'>Address</TableCell>
								<TableCell align='left'>State</TableCell>
								<TableCell align='left'>City</TableCell>
								<TableCell align='left'>Zip Code</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row, i) => (
								<TableRow key={i}>
									<TableCell align='left' >{String(row.id)}</TableCell>
									<TableCell align='left'>{String(row.isAdmin)}</TableCell>
									<TableCell align='left' >{row.firstName}</TableCell>
									<TableCell align='left'>{row.lastName}</TableCell>
									<TableCell align='left'>{row.onboardingStep}</TableCell>
									<TableCell align='left'>{row.email}</TableCell>
									<TableCell align='left'>N/A</TableCell>
									<TableCell align='left'>{row.birthDate}</TableCell>
									<TableCell align='left' width={300}>{row.aboutMe}</TableCell>
									<TableCell align='left'>
										{row.addressLineOne}, {row.addressLineTwo}
									</TableCell>
									<TableCell align='left'>{row.state}</TableCell>
									<TableCell align='left'>{row.city}</TableCell>
									<TableCell align='left'>{row.zip}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10]}
					component='div'
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
				/>
			</Card>
		</Container>
	);
}

export default DataTable;
