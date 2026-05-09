const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/payment.controller");

router.post("/payments", ctrl.createPayment);
router.get("/payments", ctrl.getAllPayments);

module.exports = router;
