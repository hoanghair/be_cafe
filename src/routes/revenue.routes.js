let router = require("express").Router();
const RevenueController = require("../controllers/revenue.controller");
const auth = require("../middleware/auth.middleware");
const roleAdmin = require("../middleware/admin.middleware");

//private
router.get("/profit", auth, roleAdmin, RevenueController.calculateTotalProfit);
router.get("/income", auth, roleAdmin, RevenueController.calculateTotalIncome);

module.exports = router;
