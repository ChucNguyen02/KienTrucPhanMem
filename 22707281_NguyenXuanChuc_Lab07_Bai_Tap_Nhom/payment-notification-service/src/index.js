require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const amqplib = require("amqplib");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Models ───────────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  bookingId:  { type: String, required: true },
  userId:     { type: String },
  amount:     { type: Number },
  status:     { type: String, enum: ["SUCCESS", "FAILED"], required: true },
  createdAt:  { type: Date, default: Date.now },
});
const Payment = mongoose.model("Payment", paymentSchema);

const notificationSchema = new mongoose.Schema({
  userId:    { type: String },
  username:  { type: String },
  bookingId: { type: String },
  message:   { type: String },
  type:      { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model("Notification", notificationSchema);

const eventLogSchema = new mongoose.Schema({
  event:     { type: String },
  data:      { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});
const EventLog = mongoose.model("EventLog", eventLogSchema);

// ─── RabbitMQ ─────────────────────────────────────────────────────────────────
let channel;
const SUCCESS_RATE = parseFloat(process.env.PAYMENT_SUCCESS_RATE) || 0.8;

async function connectRabbitMQ() {
  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();

  await channel.assertExchange("movie_events", "topic", { durable: true });

  // Dead Letter Exchange & Queue
  await channel.assertExchange("movie_events_dlx", "topic", { durable: true });
  await channel.assertQueue("payment_dlq", { durable: true });
  await channel.bindQueue("payment_dlq", "movie_events_dlx", "#");

  console.log("[RabbitMQ] Payment+Notification Service connected");
}

async function publishEvent(routingKey, payload) {
  const message = JSON.stringify({
    event: routingKey,
    data: payload,
    timestamp: new Date().toISOString(),
  });
  channel.publish("movie_events", routingKey, Buffer.from(message), { persistent: true });
  console.log(`[EVENT PUBLISHED] ${routingKey}:`, payload);

  // Save to event log
  await EventLog.create({ event: routingKey, data: payload });
}

// ─── Payment Consumer: listens BOOKING_CREATED ─────────────────────────────
async function startPaymentConsumer() {
  const q = await channel.assertQueue("payment_queue", {
    durable: true,
    arguments: { "x-dead-letter-exchange": "movie_events_dlx" },
  });
  await channel.bindQueue(q.queue, "movie_events", "BOOKING_CREATED");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const { event, data } = JSON.parse(msg.content.toString());
      console.log(`\n[PAYMENT] Processing ${event} for booking #${data.bookingId}`);
      await EventLog.create({ event, data });

      // Simulate processing delay (500ms - 1.5s)
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));

      const isSuccess = Math.random() < SUCCESS_RATE;
      console.log(`[PAYMENT] Booking #${data.bookingId} → ${isSuccess ? "SUCCESS" : "FAILED"}`);

      // Save payment record
      await Payment.create({
        bookingId: data.bookingId,
        userId: data.userId,
        amount: data.totalPrice,
        status: isSuccess ? "SUCCESS" : "FAILED",
      });

      if (isSuccess) {
        await publishEvent("PAYMENT_COMPLETED", {
          bookingId: data.bookingId,
          userId: data.userId,
          username: data.username,
          movieTitle: data.movieTitle,
          seats: data.seats,
          totalPrice: data.totalPrice,
        });
      } else {
        await publishEvent("BOOKING_FAILED", {
          bookingId: data.bookingId,
          userId: data.userId,
          username: data.username,
          movieTitle: data.movieTitle,
          reason: "Payment declined",
        });
      }

      channel.ack(msg);
    } catch (err) {
      console.error("[Payment Consumer Error]", err.message);
      channel.nack(msg, false, false); // → DLQ
    }
  });

  console.log("[Payment Service] 👂 Listening for BOOKING_CREATED");
}

// ─── Notification Consumer: listens PAYMENT_COMPLETED & BOOKING_FAILED ─────
async function startNotificationConsumer() {
  const q = await channel.assertQueue("notification_queue", {
    durable: true,
    arguments: { "x-dead-letter-exchange": "movie_events_dlx" },
  });
  await channel.bindQueue(q.queue, "movie_events", "PAYMENT_COMPLETED");
  await channel.bindQueue(q.queue, "movie_events", "BOOKING_FAILED");
  await channel.bindQueue(q.queue, "movie_events", "USER_REGISTERED");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const { event, data } = JSON.parse(msg.content.toString());
      let message = "";
      let type = event;

      switch (event) {
        case "PAYMENT_COMPLETED":
          message = `🎉 Booking #${data.bookingId} thành công! Phim: ${data.movieTitle}, ${data.seats} ghế. Tổng tiền: ${data.totalPrice?.toLocaleString("vi-VN")}đ`;
          console.log(`[NOTIFICATION] ✅ ${data.username} đã đặt đơn #${data.bookingId} thành công`);
          break;
        case "BOOKING_FAILED":
          message = `❌ Booking #${data.bookingId} thất bại. Lý do: ${data.reason}`;
          console.log(`[NOTIFICATION] ❌ Booking #${data.bookingId} thất bại - ${data.reason}`);
          break;
        case "USER_REGISTERED":
          message = `👋 Chào mừng ${data.username} đã đăng ký thành công!`;
          console.log(`[NOTIFICATION] 👤 User ${data.username} (${data.email}) đã đăng ký`);
          break;
      }

      if (message) {
        await Notification.create({
          userId: data.userId,
          username: data.username,
          bookingId: data.bookingId,
          message,
          type,
        });
      }

      channel.ack(msg);
    } catch (err) {
      console.error("[Notification Consumer Error]", err.message);
      channel.nack(msg, false, false);
    }
  });

  console.log("[Notification Service] 👂 Listening for events");
}

// ─── REST API ─────────────────────────────────────────────────────────────────

app.get("/notifications", async (req, res) => {
  const { userId } = req.query;
  const filter = userId ? { userId } : {};
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

app.get("/payments", async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 }).limit(50);
  res.json(payments);
});

app.get("/events", async (req, res) => {
  const events = await EventLog.find().sort({ timestamp: -1 }).limit(100);
  res.json(events);
});

app.get("/health", (_, res) => res.json({ status: "ok", service: "payment-notification-service" }));

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("[Payment+Notification Service] MongoDB connected");
  await connectRabbitMQ();
  await startPaymentConsumer();
  await startNotificationConsumer();
  app.listen(process.env.PORT, () => {
    console.log(`[Payment+Notification Service] Running on port ${process.env.PORT}`);
  });
});
