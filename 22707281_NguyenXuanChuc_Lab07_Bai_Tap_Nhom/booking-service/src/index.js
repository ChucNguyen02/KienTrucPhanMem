require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const { publishEvent, startConsumer } = require("./rabbitmq");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Model ────────────────────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  username:  { type: String },
  movieId:   { type: String, required: true },
  movieTitle:{ type: String },
  seats:     { type: Number, required: true, min: 1 },
  totalPrice:{ type: Number },
  status:    { type: String, enum: ["PENDING", "CONFIRMED", "FAILED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /bookings — all bookings (or filter by userId)
app.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { userId: req.user.userId };
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /bookings/:id
app.get("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /bookings — create booking
app.post("/bookings", authMiddleware, async (req, res) => {
  try {
    const { movieId, seats } = req.body;
    if (!movieId || !seats) return res.status(400).json({ error: "movieId and seats required" });

    // Fetch movie info from Movie Service
    let movie;
    try {
      const resp = await axios.get(`${process.env.MOVIE_SERVICE_URL}/movies/${movieId}`);
      movie = resp.data;
    } catch {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (movie.availableSeats < seats)
      return res.status(400).json({ error: "Not enough available seats" });

    const totalPrice = movie.price * seats;

    // Create booking (status: PENDING)
    const booking = await Booking.create({
      userId: req.user.userId,
      username: req.user.username,
      movieId,
      movieTitle: movie.title,
      seats,
      totalPrice,
    });

    // Reserve seats in Movie Service
    await axios.patch(`${process.env.MOVIE_SERVICE_URL}/movies/${movieId}/seats`, {
      seats: -seats,
    });

    // 🔔 Publish BOOKING_CREATED event — Payment service will consume this
    await publishEvent("BOOKING_CREATED", {
      bookingId: booking._id.toString(),
      userId: req.user.userId,
      username: req.user.username,
      movieId,
      movieTitle: movie.title,
      seats,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("[create booking]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health
app.get("/health", (_, res) => res.json({ status: "ok", service: "booking-service" }));

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("[Booking Service] MongoDB connected");
  await startConsumer(Booking);
  app.listen(process.env.PORT, () => {
    console.log(`[Booking Service] Running on port ${process.env.PORT}`);
  });
});
