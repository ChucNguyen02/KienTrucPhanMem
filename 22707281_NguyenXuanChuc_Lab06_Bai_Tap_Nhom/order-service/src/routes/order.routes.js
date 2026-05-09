const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/order.controller");

router.post("/orders", ctrl.createOrder);
router.get("/orders", ctrl.getAllOrders);
router.get("/orders/:id", ctrl.getOrderById);
router.patch("/orders/:id/status", ctrl.updateOrderStatus); // internal

module.exports = router;
