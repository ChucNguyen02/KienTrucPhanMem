require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./src/routes/payment.routes");

const app = express();
const PORT = process.env.PORT || 8084;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "payment-service", status: "UP", port: PORT }));
app.use("/api", paymentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Payment Service running on http://0.0.0.0:${PORT}`);
});
