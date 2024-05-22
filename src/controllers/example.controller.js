const log = require("../common/log");
const ExpresssLogProxy = require("../common/log.proxy");

function ExampleController() {
  this.log = async (req, res) => {
    try {
      log.debug("Log Example Function !");
      var user = {
        message: "Log Example Function !",
      };

      res.send({ user: user.toAuthJSON() });
    } catch (error) {
      log.error(error);
      res.status(400).send({ message: "Log Example Fail !" });
    }
  };

  this.logDefault = async (req, res, next) => {
    throw Error("Hello Logs :D");
  };
}

module.exports = ExpresssLogProxy(new ExampleController()); //add log proxy to handle log
