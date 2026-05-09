const amqplib = require("amqplib");

let connection = null;
let channel = null;

async function connect() {
  if (channel) return channel;
  connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare exchange (topic type for routing flexibility)
  await channel.assertExchange("movie_events", "topic", { durable: true });
  console.log("[RabbitMQ] Connected and exchange declared");
  return channel;
}

async function publishEvent(routingKey, payload) {
  const ch = await connect();
  const message = JSON.stringify({
    event: routingKey,
    data: payload,
    timestamp: new Date().toISOString(),
  });
  ch.publish("movie_events", routingKey, Buffer.from(message), {
    persistent: true,
  });
  console.log(`[EVENT PUBLISHED] ${routingKey}:`, payload);
}

module.exports = { publishEvent };
