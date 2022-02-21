import { reservationRouter } from "./router/reservationRouter";
import { roomRouter } from "./router/roomRouter";
import { userRouter } from "./router/userRouter";

const express = require("express");
const bodyparser = require("body-parser");

const app = express();

const port = 3000;
app.use(bodyparser.json());

app.use("/reservations", reservationRouter);
app.use("/rooms", roomRouter);
app.use("", userRouter);

app.listen(port, () => {
  console.debug(`Server running Express on port ${port}`);
});
