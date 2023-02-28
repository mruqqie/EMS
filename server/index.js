import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		console.log("connected");
		server;
	})
	.catch((err) => {
		console.log({ err });
		process.exit(1);
	});
