import mongoose from "mongoose";
import modelOps from "./model.options.js";
import crypto from "crypto";

const patientSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		phoneNo: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		gender: {
			type: String,
			required: true,
		},
		medCondition: {
			type: String,
			required: true,
		},
		nextOfKinName: {
			type: String,
			required: true,
		},
		nextOfKinPhoneNo: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		salt: {
			type: String,
			required: true,
			select: false,
		},
	},
	modelOps
);

patientSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.password = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
		.toString("hex");
};

patientSchema.methods.validPassword = function (password) {
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
		.toString("hex");

	return this.password === hash;
};

const patientModel = mongoose.model("Patient", patientSchema);

export default patientModel;
