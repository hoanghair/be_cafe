// cấu hình biến môi trường
require("dotenv").config();

// Module Imports
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();
const route = require("./routes/index");
const bodyParser = require("body-parser");
const handleError = require("./common/error");
const connect = require("./config/mongoose");

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/", route);

// xử lý lỗi Middleware
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

// Database Connection
connect();

// chạy Server
app.listen(port, () => {
  console.log("Server listening on " + port);
});
