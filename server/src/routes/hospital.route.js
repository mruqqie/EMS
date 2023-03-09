import express from "express";
import hospitalController from "../controllers/hospital.controller";
import hospitalModel from "../models/hospital.model";
import reqHandler from "../handlers/req.handler";
import { body } from "express-validator";
import tokenMiddleware from "../middleware/token.middleware";

const router= express.Router()

router.post()