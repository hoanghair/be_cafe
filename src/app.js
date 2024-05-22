require("dotenv").config();
const express = require("express");
var cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();
const route = require("./routes/index");
const bodyParser = require("body-parser");
const handleError = require("./common/error");
const connect = require("./config/mongoose");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/", route);

app.use((err, req, res, next) => {
  handleError(err, req, res);
});

connect();

app.listen(port, () => {
  console.log("Server listening on " + port);
});
