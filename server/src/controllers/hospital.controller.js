import hospitalModel from "../models/hospital.model.js";
import jsonWebToken from "jsonwebtoken";
import resHandler from "../handlers/res.handler.js";

const signup = async (req, res) => {
	try {
		const { name, address, state, phoneNo, email, type, password } = req.body;

		const checkHospital = hospitalModel.findOne({ email });
		if (checkHospital) {
			return resHandler.badReq(res, "Email already in use");
		}

		const hospital = new hospitalModel();

		hospital.name = name;
		hospital.address = address;
		hospital.state = state;
		hospital.phoneNo = phoneNo;
		hospital.email = email;
		hospital.type = type;
		hospital.setPassword(password);
		await hospital.save();

		const payload = { user: hospital.id, userType: "hospital" };
		const options = { expiresIn: "24h" };
		const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, options);

		resHandler.created(res, {
			token,
			...hospital._doc,
			id: hospital.id,
		});
	} catch {
		resHandler.error(res);
	}
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		const hospital = await hospitalModel
			.findOne({ email })
			.select("name address state phoneNo email type password salt id");

		if (!hospital) {
			return resHandler.badReq(res, "User not found.");
		}

		if (!hospital.validPassword(password)) {
			return resHandler.badReq(res, "Wrong password");
		}

		const payload = { user: hospital.id, userType: "hospital" };
		const options = { expiresIn: "24h" };
		const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, options);

		hospital.password = undefined;
		hospital.salt = undefined;

		resHandler.created(res, {
			token,
			...hospital._doc,
			id: hospital.id,
		});
	} catch {
		resHandler.error(res);
	}
};

const updatePassword = async (req, res) => {
	try {
		const { password, newPassword } = req.body;

		const hospital = await hospitalModel
			.findById(req.hospital.id)
			.select("password id salt");

		if (!hospital) {
			return resHandler.unauthorized(res);
		}

		if (!hospital.validPassword(password)) {
			return resHandler.badReq(res, "Wrong password.");
		}

		user.setPassword(newPassword);
		await hospital.save();

		resHandler.ok(res);
	} catch {
		resHandler.error(res);
	}
};

const getInfo = async (req, res) => {
	try {
		const hospital = await hospitalModel.findById(req.hospital.id);

		if (!hospital) {
			resHandler.notFound();
		}

		resHandler.ok(res, hospital);
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
