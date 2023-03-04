import patientModel from "../models/patient.model.js";
import jsonWebToken from "jsonwebtoken";
import resHandler from "../handlers/res.handler.js";

const signup = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			dob,
			phoneNo,
			email,
			gender,
			medCondition,
			nextOfKinName,
			nextOfKinPhoneNo,
			password,
		} = req.body;

		const checkPatient = await patientModel.findOne({ email });
		if (checkPatient) {
			return resHandler.badReq(res, "Email already in use.");
		}

		const patient = new patientModel();

		patient.firstName = firstName;
		patient.lastName = lastName;
		patient.dob = dob;
		patient.phoneNo = phoneNo;
		patient.email = email;
		patient.gender = gender;
		patient.medCondition = medCondition;
		patient.nextOfKinName = nextOfKinName;
		patient.nextOfKinPhoneNo = nextOfKinPhoneNo;
		patient.setPassword(password);

		await patient.save();

		const payload = { user: patient.id, userType: "patient" };
		const options = { expiresIn: "24h" };
		const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, options);

		resHandler.created(res, {
			token,
			...patient._doc,
			id: patient.id,
		});
	} catch (err) {
		resHandler.error(res);
	}
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		const patient = await patientModel
			.findOne({ email })
			.select(
				"firstName lastName dob phoneNo email gender medCondition nextOfKinName nextOfKinPhoneNo password salt id"
			);

		if (!patient) {
			return resHandler.badReq(res, "User not found.");
		}

		if (!patient.validPassword(password)) {
			return resHandler.badReq(res, "Wrong password");
		}

		const payload = { user: patient.id, userType: "patient" };
		const options = { expiresIn: "24h" };
		const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, options);

		patient.password = undefined;
		patient.salt = undefined;

		resHandler.created(res, {
			token,
			...patient._doc,
			id: patient.id,
		});
	} catch {
		resHandler.error(res);
	}
};

const updatePassword = async (req, res) => {
	try {
		const { password, newPassword } = req.body;

		const patient = await patientModel
			.findById(req.patient.id)
			.select("password id salt");

		if (!patient) {
			return resHandler.unauthorized(res);
		}

		if (!patient.validPassword(password)) {
			return resHandler.badReq(res, "Wrong password.");
		}

		user.setPassword(newPassword);
		await patient.save();

		resHandler.ok(res);
	} catch {
		resHandler.error(res);
	}
};

const getInfo = async (req, res) => {
	try {
		const patient = await patientModel.findById(req.patient.id);

		if (!patient) {
			resHandler.notFound();
		}

		resHandler.ok(res, patient);
	} catch {
		resHandler.error(res);
	}
};

export default {
	signup,
	signIn,
	updatePassword,
	getInfo,
};
