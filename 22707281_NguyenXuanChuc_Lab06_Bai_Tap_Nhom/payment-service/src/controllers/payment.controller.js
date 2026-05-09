const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const payments = require("../data/payments");

const ORDER_SERVICE = process.env.ORDER_SERVICE_URL;

// Giả lập notification (console log)
const sendNotification = (username, orderId, method, amount) => {
  const msg = `🔔 [NOTIFICATION] ${username} đã đặt đơn #${orderId} thành công | Phương thức: ${method} | Tổng tiền: ${amount.toLocaleString()}đ`;
  console.log("=".repeat(70));
  console.log(msg);
  console.log("=".repeat(70));
  return msg;
};

const createPayment = async (req, res) => {
  try {
    const { orderId, method, username } = req.body;
    // method: COD | BANKING

    if (!orderId || !method)
      return res.status(400).json({ message: "Thiếu orderId hoặc method" });

    if (!["COD", "BANKING"].includes(method))
      return res.status(400).json({ message: "Phương thức phải là COD hoặc BANKING" });

    // 1. Lấy thông tin đơn hàng
    const orderRes = await axios.get(`${ORDER_SERVICE}/orders/${orderId}`);
    const order = orderRes.data;

    if (order.status === "PAID")
      return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });

    // 2. Giả lập xử lý thanh toán (luôn thành công)
    await new Promise((r) => setTimeout(r, 500)); // giả lập delay

    // 3. Tạo payment record
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId,
      method,
      amount: order.totalAmount,
      status: "SUCCESS",
      processedAt: new Date().toISOString(),
    };
    payments.push(payment);

    // 4. Update order status → PAID
    await axios.patch(`${ORDER_SERVICE}/orders/${orderId}/status`, { status: "PAID" });

    // 5. Gửi notification
    const notifMsg = sendNotification(
      username || order.username,
      orderId,
      method,
      order.totalAmount
    );

    res.status(201).json({
      message: "Thanh toán thành công",
      payment,
      notification: notifMsg,
    });
  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).json({ message: "Lỗi thanh toán", error: err.message });
  }
};

const getAllPayments = (req, res) => {
  res.json(payments.sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt)));
};

module.exports = { createPayment, getAllPayments };
