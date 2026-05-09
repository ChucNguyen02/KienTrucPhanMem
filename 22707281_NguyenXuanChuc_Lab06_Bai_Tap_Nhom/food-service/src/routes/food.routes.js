const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/food.controller");

router.post("/foods/batch", ctrl.getFoodsByIds); // internal — MUST be before /:id
router.get("/foods", ctrl.getAllFoods);
router.get("/foods/:id", ctrl.getFoodById);
router.post("/foods", ctrl.createFood);
router.put("/foods/:id", ctrl.updateFood);
router.delete("/foods/:id", ctrl.deleteFood);

module.exports = router;
