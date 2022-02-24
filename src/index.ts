import { reservationRouter } from "./router/reservationRouter";
import { roomRouter } from "./router/roomRouter";
import { userRouter } from "./router/userRouter";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import https from "https";

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

app.use("/reservations", reservationRouter);
app.use("/rooms", roomRouter);
app.use("", userRouter);

// app.listen(port, () => {
//   console.debug(`Server running Express on port ${port}`);
// });

https.createServer(options, app).listen(port, () => {
  console.log(`Running 'secure-http' on ${port}`);
});
