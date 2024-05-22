let router = require("express").Router();
const OrderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");
const roleAdmin = require("../middleware/admin.middleware");

//private
router.get("/", auth, roleAdmin, OrderController.getAll);
router.post("/", auth, OrderController.create);
router.get("/my-self", auth, OrderController.getAllOrdersForCurrentUser);
router.get("/:id", auth, OrderController.getById);
router.delete("/:id", auth, OrderController.delete);
router.put(
  "/update-status/:id",
  auth,
  roleAdmin,
  OrderController.updateOrderStatus
);

module.exports = router;
