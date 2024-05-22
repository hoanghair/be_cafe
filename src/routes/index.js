const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const exampleRoute = require("./example.routes");
const categoryRoute = require("./category.routes");
const productRoute = require("./product.routes");
const orderRoute = require("./order.routes");
const revenueRoute = require("./revenue.routes");
const cartRoute = require("./cart.routes");

const router = express.Router();

router.use("/", userRoute);
router.use("/", authRoute);
router.use("/example/", exampleRoute);
router.use("/category/", categoryRoute);
router.use("/product/", productRoute);
router.use("/order/", orderRoute);
router.use("/revenue/", revenueRoute);
router.use("/cart/", cartRoute);

module.exports = router;
