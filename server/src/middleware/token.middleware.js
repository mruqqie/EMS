import jsonwebtoken from "jsonwebtoken";
import resHandler from "../handlers/res.handler.js";
import patientModel from "../models/patient.model.js";
import hospitalModel from "../models/hospital.model.js";

const tokenDecode = (req) => {
	try {
		const bearerHeader = req.headers["authorization"];

		if (bearerHeader) {
			const token = bearerHeader.split(" ")[1];

			return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
		}
		return false;
	} catch {
		return false;
	}
};

const auth = async (res, req, next) => {
	const tokenDecoded = tokenDecode(req);

	if (!tokenDecoded) {
		return resHandler.unauthorized(res);
	}

	const patient = await patientModel.findById(tokenDecoded.data);

	const hospital = await hospitalModel.findById(tokenDecoded.data);

	if (!patient) {
		return resHandler.unauthorized(res);
	}

	if (!hospital) {
		return resHandler.unauthorized(res);
	}

	req.patient = patient;

	req.hospital = hospital;

	next();
};

export default {
	auth,
	tokenDecode,
};
