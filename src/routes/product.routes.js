let router = require("express").Router();
const ProductController = require("../controllers/product.controller");
const auth = require("../middleware/auth.middleware");
const roleAdmin = require("../middleware/admin.middleware");

//private
router.get("/", ProductController.getAll);
router.post("/", auth, roleAdmin, ProductController.create);
router.get("/:id", ProductController.getById);
router.put("/:id", auth, roleAdmin, ProductController.update);
router.delete("/:id", auth, roleAdmin, ProductController.delete);
router.get(
  "/remaining-quantity/:id",
  auth,
  ProductController.getRemainingQuantity
);
router.get(
  "/inventory/all",
  auth,
  roleAdmin,
  ProductController.getInventoryProducts
);

module.exports = router;
