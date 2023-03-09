import express from "express";
import { body } from "express-validator";
import patientController from "../controllers/patient.controller.js";
import patientModel from "../models/patient.model.js";
import tokenMiddleware from "../middleware/token.middleware.js";
import reqHandler from "../handlers/req.handler.js";

const router = express.Router();

router.post(
	"/signup",
	body("firstName")
		.exists()
		.withMessage("First name is Required.")
		.isLength({ min: 2 })
		.withMessage("First name minimum: 2 Characters."),
	body("lastName")
		.exists()
		.withMessage("Last name is Required.")
		.isLength({ min: 2 })
		.withMessage("Last name minimum: 2 Characters."),
	body("dob").exists().withMessage("Date of birth is Required."),
	body("phoneNo")
		.exists()
		.withMessage("Phone number is Required.")
		.isLength({ min: 6 })
		.withMessage("Phone number minimum: 6 Characters.")
		.custom(async (value) => {
			const patientNo = await patientModel.findOne({ phoneNo: value });
			if (patientNo) {
				return Promise.reject("Phone number already in use.");
			}
		}),
	body("email")
		.exists()
		.withMessage("Email is Required.")
		.isLength({ min: 8 })
		.withMessage("First name minimum: 8 Characters.")
		.custom((value, { req }) => {
			if (!/^\S+@\S+\.\S+$/.test(value)) {
				throw new Error("Invalid email format.");
			}
			return true;
		})
		.custom(async (value) => {
			const patientMail = await patientModel.findOne({ email: value });
			if (patientMail) {
				return Promise.reject("Email already in use.");
			}
		}),
	body("gender").exists().withMessage("Gender is Required."),
	body("medCondition")
		.exists()
		.withMessage("If no medical condition, type N/A."),
	body("nextOfKinName")
		.exists()
		.withMessage("Next of kin's full name is Required.")
		.isLength({ min: 4 })
		.withMessage("Name minimum: 4 Characters."),
	body("nextOfKinPhoneNo")
		.exists()
		.withMessage("Next of kin's phone number is Required.")
		.isLength({ min: 6 })
		.withMessage("Phone number minimum: 6 Characters."),
	body("password")
		.exists()
		.withMessage("Password is Required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters."),
	body("confirmPassword")
		.exists()
		.withMessage("Password confirmation is Required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters.")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Password not a match.");
			}
			return true;
		}),
	reqHandler.validate,
	patientController.signup
);

router.post(
	"/signin",
	body("email")
		.exists()
		.withMessage("Please enter your email.")
		.isLength({ min: 8 })
		.withMessage("Email minimum: 8 Characters.")
		.custom((value, { req }) => {
			if (!/^\S+@\S+\.\S+$/.test(value)) {
				throw new Error("Invalid email format.");
			}
			return true;
		}),
	body("password")
		.exists()
		.withMessage("Password is Required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters."),
	reqHandler.validate,
	patientController.signIn
);

router.put(
	"/update-password",
	tokenMiddleware.auth,
	body("password")
		.exists()
		.withMessage("Current Password is required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters."),
	body("newPassword")
		.exists()
		.withMessage("New password is required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters."),
	body("confirmNewPassword")
		.exists()
		.withMessage("New password is required.")
		.isLength({ min: 6 })
		.withMessage("Password minimum: 6 Characters.")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Password not a match.");
			}
			return true;
		}),
	reqHandler.validate,
	patientController.updatePassword
);

router.get("/info", tokenMiddleware.auth, patientController.getInfo);

export default router;
