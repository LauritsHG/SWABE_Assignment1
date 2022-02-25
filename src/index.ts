import { reservationRouter } from "./router/reservation-router";
import { roomRouter } from "./router/room-router";
import { userRouter } from "./router/user-router";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import https from "https";
import { verifyToken } from "./util/middleware-util";

export const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);

const options = {
  key: fs.readFileSync(path.join(__dirname, "../src/selfsigned.key")),
  cert: fs.readFileSync(path.join(__dirname, "../src/selfsigned.crt")),
};

const express = require("express");
const bodyparser = require("body-parser");

const app = express();
app.use(helmet());

const port = 3000;
app.use(bodyparser.json());

app.use("", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, next);
});
app.use("/reservations", reservationRouter);
app.use("/rooms", roomRouter);

https.createServer(options, app).listen(port, () => {
  console.log(`Sever Running on port: ${port}`);
});
