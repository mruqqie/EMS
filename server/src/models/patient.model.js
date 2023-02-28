import mongoose from "mongoose";
import modelOps from "./model.options.js";
import crypto from "crypto";

const patientSchema = mongoose.Schema({
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
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true  
    },
    medCondition: {
        type: String,
        required: true
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
        select: false
    },
    salt: {
        type: String,
        required: true,
        select: false
    }
}, modelOps)
