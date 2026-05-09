require("dotenv").config();
const express = require("express");
const cors = require("cors");
const foodRoutes = require("./src/routes/food.routes");

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "food-service", status: "UP", port: PORT }));
app.use("/api", foodRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Food Service running on http://0.0.0.0:${PORT}`);
});
