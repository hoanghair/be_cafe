let mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect DB successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
