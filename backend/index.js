const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var { ncrypt } = require("ncrypt-js");
const { capitalize } = require("./utils");

require("dotenv").config(); // optional if using .env for secrets

const app = express();
const port = process.env.DEVELOPMENT_PORT;
const secretKey = process.env.ENCRYPT_DECRYPT_KEY;
const uri = process.env.MONGODB_URI;
const mongoAdminConfigID = process.env.ADMIN_CONFIG_ID;
const devURL = process.env.DEV_URL
const environment = process.env.NODE_ENV

// Middleware
app.use(cors());
app.use(express.json());

// ******* Mongoose Schema + Model *******
const TestUser = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	onboardingStep: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	birthDate: String,
	aboutMe: String,
	addressLineOne: String,
	addressLineTwo: String,
	state: String,
	city: String,
	zip: String,
	isAdmin: { type: Boolean, required: true },
});

// ******* Mongoose Schema Singleton + Model *******
const FormComponentModel = new mongoose.Schema({
	aboutMe: { type: Boolean, required: true },
	birthDate: { type: Boolean, required: true },
	addressLineOne: { type: Boolean, required: true },
	addressLineTwo: { type: Boolean, required: true },
	state: { type: Boolean, required: true },
	city: { type: Boolean, required: true },
	zip: { type: Boolean, required: true },
});

// ***************************************
const FormComponent = mongoose.model("FormComponent", FormComponentModel);
const User = mongoose.model("User", TestUser);

// Ping
app.get("/ping", (_, res) => {
	res.send("Pinged backend!");
});

// Get all users
app.get("/users/all", async (_, res) => {
	const users = await User.find();
	res.json({ users });
});

// Route: Handle form submissions
app.post("/user/create", async (req, res) => {
	try {
		const { password, email, firstName, lastName } = req.body;
		const userExists = await User.findOne({
			email,
		}).exec();
		if (userExists) {
			throw new Error("Email is taken. Please select another one");
		}
		const { encrypt } = new ncrypt(secretKey);
		const encryptedPassword = encrypt(password);
		const newUser = new User({
			...req.body,
			password: encryptedPassword,
			firstName: capitalize(firstName),
			lastName: capitalize(lastName),
		});
		await newUser.save();
		res.status(201).json({ message: "New account created!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ emailErrors: error.message });
	}
});

// Route: Handle form submissions
app.post("/user/signin", async (req, res) => {
	try {
		const { decrypt } = new ncrypt(secretKey);
		const { password, email } = req.body;
		const userExists = await User.findOne({
			email,
		}).exec();
		if (!userExists) {
			throw new Error("User with those credentials does not exist");
		}
		const decryptedPassword = decrypt(userExists.password);
		// Check password
		if (decryptedPassword === password && email === userExists.email) {
			const {
				_id: id,
				firstName,
				lastName,
				onboardingStep,
				email,
				password,
				birthDate,
				aboutMe,
				addressLineOne,
				addressLineTwo,
				state,
				city,
				zip,
				isAdmin,
			} = userExists;
			const userData = {
				id,
				firstName,
				lastName,
				onboardingStep,
				email,
				password,
				birthDate,
				aboutMe,
				addressLineOne,
				addressLineTwo,
				state,
				city,
				zip,
				isAdmin,
			};
			res.status(201).json(userData);
		} else {
			throw new Error("User with those credentials does not exist");
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ emailErrors: [error.message], passwordErrors: [error.message] });
	}
});

// Route: Handle config submissions
app.post("/form/create", async (_, res) => {
	try {
		const configExists = await FormComponent.findOne().exec();
		if (configExists) {
			res.status(200).json({
				message: "Config found. Skipping creation!",
				adminConfig: configExists,
			});
			return;
		}
		const NewFormConfig = new FormComponent({
			aboutMe: true,
			birthDate: true,
			addressLineOne: true,
			addressLineTwo: true,
			state: true,
			city: true,
			zip: true,
		});
		await NewFormConfig.save();
		res.status(201).json({ message: "New Admin Form Config created!" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route: Handle form submissions
app.put("/user/update", async (req, res) => {
	try {
		const {
			id,
			aboutMe,
			birthDate,
			addressLineOne,
			addressLineTwo,
			state,
			city,
			zip,
			onboardingStep,
		} = req.body;
		const user = await User.findByIdAndUpdate(
			{ _id: id },
			{
				aboutMe,
				birthDate,
				addressLineOne,
				addressLineTwo,
				state,
				city,
				zip,
				onboardingStep,
			},
		).exec();
		if (!user) {
			throw new Error(
				"User with ID " + id + " was not found or could not be updated",
			);
		}

		const userData = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			onboardingStep: user.onboardingStep,
			email: user.email,
			password: user.password,
			birthDate: user.birthDate,
			aboutMe: user.aboutMe,
			addressLineOne: user.addressLineOne,
			addressLineTwo: user.addressLineTwo,
			state: user.state,
			city: user.city,
			zip: user.zip,
			isAdmin: user.isAdmin,
		};
		res.status(200).json({
			message: "User profile updated",
			user: userData,
		});
		return;
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// Route: Handle form submissions
app.put("/form/update", async (_, res) => {
	try {
		const {
			aboutMe,
			birthDate,
			addressLineOne,
			addressLineTwo,
			state,
			city,
			zip,
		} = req.body;
		const updatedConfig = await FormComponent.findOneAndUpdate(
			{
				_id: mongoAdminConfigID,
			},
			{
				aboutMe,
				birthDate,
				addressLineOne,
				addressLineTwo,
				state,
				city,
				zip,
			},
		).exec();
		if (updatedConfig) {
			res.status(200).json({
				message: "Config Updated",
				adminConfig: updatedConfig,
			});
			return;
		} else {
			throw new Error("Could not update admin config");
		}
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// Connect to MongoDB and start server
mongoose
	.connect(uri)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(port, () => {
			console.log(`Server running on ${devURL}${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
