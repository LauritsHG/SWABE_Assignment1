const express = require("express");
const bodyparser = require("body-parser");

const app = express();

const port = 3000;
app.use(bodyparser.json());
//app.use('/orders',require('./controllers/orders'));
app.use("/reservation", require("./controllers/reservation"));
//app.use(express.json());
app.use("/room", require("./controllers/rooms"));
app.use("/user", require("./controllers/users"));

app.listen(port, () => {
  console.debug(`Server running Express on port ${port}`);
});
