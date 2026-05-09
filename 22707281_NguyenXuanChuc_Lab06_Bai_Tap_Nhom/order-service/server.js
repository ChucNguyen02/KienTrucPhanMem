require("dotenv").config();
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./src/routes/order.routes");

const app = express();
const PORT = process.env.PORT || 8083;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "order-service", status: "UP", port: PORT }));
app.use("/api", orderRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on http://0.0.0.0:${PORT}`);
});
