import jsonWebToken from "jsonwebtoken";
import resHandler from "../handlers/res.handler.js";
import patientModel from "../models/patient.model.js";
import hospitalModel from "../models/hospital.model.js";

const tokenDecode = (req) => {
	try {
		const bearerHeader = req.headers["authorization"];

		if (bearerHeader) {
			const token = bearerHeader.split(" ")[1];

			return jsonWebToken.verify(token, process.env.TOKEN_SECRET);
		}
		return false;
	} catch {
		return false;
	}
};

const auth = async (req, res, next) => {
	const tokenDecoded = tokenDecode(req);

	if (!tokenDecoded) {
		return resHandler.unauthorized(res);
	}

	const user = await patientModel.findById(tokenDecoded.user) || await hospitalModel.findById(tokenDecoded.user)
	
	if (!user) {
		return resHandler.unauthorized(res);
	}

	req.user = user;
	req.userType = user instanceof patientModel ? "patient" : "hospital"

	next();
};

export default {
	auth,
	tokenDecode,
};
