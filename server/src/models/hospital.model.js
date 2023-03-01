import mongoose from "mongoose";
import modelOps from "./model.options.js";
import crypto from "crypto";

const hospitalSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		state: {
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
			unique: true,
		},
		type: {
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

hospitalSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.password = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
		.toString("hex");
};

hospitalSchema.methods.validPassword = function (password) {
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
		.toString("hex");

	return this.password === hash;
};

const hospitalModel = mongoose.model("Patient", hospitalSchema);

export default hospitalModel;
