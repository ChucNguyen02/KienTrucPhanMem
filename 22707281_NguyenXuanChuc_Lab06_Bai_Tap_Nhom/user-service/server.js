require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/user.routes");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "user-service", status: "UP", port: PORT }));
app.use("/api", userRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ User Service running on http://0.0.0.0:${PORT}`);
});
