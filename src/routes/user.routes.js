let router = require("express").Router();
let UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const roleAdmin = require("../middleware/admin.middleware");

router.post("/register", UserController.register);
router.get("/user/me", auth, UserController.find);
router.get("/user", auth, roleAdmin, UserController.getAll);

module.exports = router;
