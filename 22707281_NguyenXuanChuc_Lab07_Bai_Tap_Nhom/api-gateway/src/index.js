require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());
app.use(morgan("dev"));

// ─── Proxy Routes ─────────────────────────────────────────────────────────────

// /api/users → User Service
app.use("/api/users", createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/users": "" },
  on: {
    error: (err, req, res) => {
      console.error("[Gateway] User service error:", err.message);
      res.status(502).json({ error: "User service unavailable" });
    },
  },
}));

// /api/movies → Movie Service
app.use("/api/movies", createProxyMiddleware({
  target: process.env.MOVIE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/movies": "/movies" },
  on: {
    error: (err, req, res) => {
      console.error("[Gateway] Movie service error:", err.message);
      res.status(502).json({ error: "Movie service unavailable" });
    },
  },
}));

// /api/bookings → Booking Service
app.use("/api/bookings", createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/bookings": "/bookings" },
  on: {
    error: (err, req, res) => {
      console.error("[Gateway] Booking service error:", err.message);
      res.status(502).json({ error: "Booking service unavailable" });
    },
  },
}));

// /api/notifications → Payment+Notification Service
app.use("/api/notifications", createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/notifications": "/notifications" },
}));

// /api/payments → Payment+Notification Service
app.use("/api/payments", createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/payments": "/payments" },
}));

// /api/events → Event Log
app.use("/api/events", createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { "^/api/events": "/events" },
}));

// Health
app.get("/health", (_, res) =>
  res.json({
    status: "ok",
    service: "api-gateway",
    routes: ["/api/users", "/api/movies", "/api/bookings", "/api/notifications", "/api/payments", "/api/events"],
  })
);

app.listen(process.env.PORT, () => {
  console.log(`[API Gateway] Running on port ${process.env.PORT}`);
  console.log(`  → /api/users    → ${process.env.USER_SERVICE_URL}`);
  console.log(`  → /api/movies   → ${process.env.MOVIE_SERVICE_URL}`);
  console.log(`  → /api/bookings → ${process.env.BOOKING_SERVICE_URL}`);
  console.log(`  → /api/payments → ${process.env.PAYMENT_SERVICE_URL}`);
});
