require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { publishEvent } = require("./rabbitmq");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mongoose Model ───────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt:{ type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    // 🔔 Publish USER_REGISTERED event
    await publishEvent("USER_REGISTERED", {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error("[register]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("[login]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /me — verify token
app.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", service: "user-service" }));

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("[User Service] MongoDB connected");
  app.listen(process.env.PORT, () => {
    console.log(`[User Service] Running on port ${process.env.PORT}`);
  });
});
