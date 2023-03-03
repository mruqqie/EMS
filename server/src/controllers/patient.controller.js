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



