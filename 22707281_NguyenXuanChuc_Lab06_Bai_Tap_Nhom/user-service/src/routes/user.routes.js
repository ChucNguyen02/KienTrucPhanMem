const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/users", verifyAdmin, ctrl.getUsers);
router.get("/users/:id", verifyToken, ctrl.getUserById);
router.get("/users/:id/validate", ctrl.validateUser); // internal

module.exports = router;
