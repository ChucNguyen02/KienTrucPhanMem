require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Model ────────────────────────────────────────────────────────────────────
const movieSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  genre:       { type: String, default: "Action" },
  duration:    { type: Number, default: 120 }, // minutes
  price:       { type: Number, default: 80000 }, // VND
  totalSeats:  { type: Number, default: 100 },
  availableSeats: { type: Number, default: 100 },
  showtime:    { type: Date },
  poster:      { type: String, default: "" },
  createdAt:   { type: Date, default: Date.now },
});

const Movie = mongoose.model("Movie", movieSchema);

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movies/:id
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /movies
app.post("/movies", async (req, res) => {
  try {
    const { title, description, genre, duration, price, totalSeats, showtime, poster } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const movie = await Movie.create({
      title, description, genre, duration, price,
      totalSeats: totalSeats || 100,
      availableSeats: totalSeats || 100,
      showtime: showtime ? new Date(showtime) : new Date(Date.now() + 86400000),
      poster,
    });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /movies/:id
app.put("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /movies/:id/seats — internal use by booking service via gateway
app.patch("/movies/:id/seats", async (req, res) => {
  try {
    const { seats } = req.body; // negative to decrease
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    movie.availableSeats += seats;
    await movie.save();
    res.json({ availableSeats: movie.availableSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health
app.get("/health", (_, res) => res.json({ status: "ok", service: "movie-service" }));

// ─── Seed data ────────────────────────────────────────────────────────────────
async function seed() {
  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany([
      {
        title: "Avengers: Endgame",
        description: "The Avengers assemble once more to reverse the damage caused by Thanos.",
        genre: "Action",
        duration: 181,
        price: 120000,
        totalSeats: 100,
        availableSeats: 100,
        showtime: new Date(Date.now() + 86400000),
      },
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology.",
        genre: "Sci-Fi",
        duration: 148,
        price: 100000,
        totalSeats: 80,
        availableSeats: 80,
        showtime: new Date(Date.now() + 172800000),
      },
      {
        title: "The Dark Knight",
        description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.",
        genre: "Action",
        duration: 152,
        price: 90000,
        totalSeats: 120,
        availableSeats: 120,
        showtime: new Date(Date.now() + 259200000),
      },
    ]);
    console.log("[Movie Service] Seeded 3 movies");
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("[Movie Service] MongoDB connected");
  await seed();
  app.listen(process.env.PORT, () => {
    console.log(`[Movie Service] Running on port ${process.env.PORT}`);
  });
});
