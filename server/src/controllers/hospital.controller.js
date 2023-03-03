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
	} catch (err) {
		resHandler.error(res);
	}
};