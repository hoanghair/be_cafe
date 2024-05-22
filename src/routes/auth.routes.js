let router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");
//public
router.post("/login", AuthController.login);

//private
router.post("/logout", auth, AuthController.logout);
router.post("/logout-all", auth, AuthController.logoutAll);

module.exports = router;
