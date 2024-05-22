let router = require("express").Router();
const CartController = require("../controllers/cart.controller");
const auth = require("../middleware/auth.middleware");

//private
router.post("/create", auth, CartController.create);
router.put("/update", auth, CartController.update);
router.delete("/delete/:productId", auth, CartController.delete);
router.get("/my-self", auth, CartController.mySelf);

module.exports = router;
