import express from "express";
import { body } from "express-validator";
import patientController from "../controllers/patient.controller.js";
import patientModel from "../models/patient.model.js";
import tokenMiddleware from "../middleware/token.middleware.js";
import reqHandler from "../handlers/req.handler.js";

const router = express.Router();

router.post(
    "/signup",
    body("")
)