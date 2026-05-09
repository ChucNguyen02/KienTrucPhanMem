const amqplib = require("amqplib");

let connection = null;
let channel = null;

async function getChannel() {
  if (channel) return channel;
  connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange("movie_events", "topic", { durable: true });
  console.log("[RabbitMQ] Booking Service connected");
  return channel;
}

async function publishEvent(routingKey, payload) {
  const ch = await getChannel();
  const message = JSON.stringify({
    event: routingKey,
    data: payload,
    timestamp: new Date().toISOString(),
  });
  ch.publish("movie_events", routingKey, Buffer.from(message), { persistent: true });
  console.log(`[EVENT PUBLISHED] ${routingKey}:`, payload);
}

// Listen for PAYMENT_COMPLETED and BOOKING_FAILED to update booking status
async function startConsumer(BookingModel) {
  const ch = await getChannel();

  // Dead Letter Queue setup
  await ch.assertExchange("movie_events_dlx", "topic", { durable: true });
  await ch.assertQueue("booking_updates_dlq", { durable: true });
  await ch.bindQueue("booking_updates_dlq", "movie_events_dlx", "#");

  const q = await ch.assertQueue("booking_updates_queue", {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "movie_events_dlx",
    },
  });

  await ch.bindQueue(q.queue, "movie_events", "PAYMENT_COMPLETED");
  await ch.bindQueue(q.queue, "movie_events", "BOOKING_FAILED");

  ch.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const { event, data } = JSON.parse(msg.content.toString());
      console.log(`[EVENT CONSUMED] ${event}:`, data);

      const newStatus = event === "PAYMENT_COMPLETED" ? "CONFIRMED" : "FAILED";
      await BookingModel.findByIdAndUpdate(data.bookingId, { status: newStatus });
      console.log(`[Booking] #${data.bookingId} → ${newStatus}`);

      ch.ack(msg);
    } catch (err) {
      console.error("[Booking Consumer Error]", err.message);
      ch.nack(msg, false, false); // send to DLQ
    }
  });

  console.log("[Booking Service] Listening for PAYMENT_COMPLETED / BOOKING_FAILED");
}

module.exports = { publishEvent, startConsumer };
