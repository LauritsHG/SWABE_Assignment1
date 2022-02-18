const express = require("express");
const bodyparser = require("body-parser");

const app = express();

const port = 3000;
app.use(bodyparser.json());
app.use('/orders',require('./controllers/orders'));
//app.use(express.json());

app.listen(port,()=>{console.debug(`Server running Express on port ${port}`)
});