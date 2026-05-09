const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const orders = require("../data/orders");

const USER_SERVICE = process.env.USER_SERVICE_URL;
const FOOD_SERVICE = process.env.FOOD_SERVICE_URL;

const createOrder = async (req, res) => {
  try {
    const { userId, items, note } = req.body;
    // items = [{ foodId, quantity }]

    if (!userId || !items || !items.length)
      return res.status(400).json({ message: "Thiếu userId hoặc items" });

    // 1. Validate user
    const userRes = await axios.get(`${USER_SERVICE}/users/${userId}/validate`);
    if (!userRes.data.valid)
      return res.status(400).json({ message: "User không hợp lệ" });

    // 2. Lấy thông tin món ăn
    const foodIds = items.map((i) => i.foodId);
    const foodRes = await axios.post(`${FOOD_SERVICE}/foods/batch`, { ids: foodIds });
    const foodMap = {};
    foodRes.data.forEach((f) => (foodMap[f.id] = f));

    // 3. Tính tổng tiền
    const orderItems = items.map((item) => {
      const food = foodMap[item.foodId];
      if (!food) throw new Error(`Món ăn ${item.foodId} không tồn tại`);
      return {
        foodId: item.foodId,
        foodName: food.name,
        price: food.price,
        quantity: item.quantity,
        subtotal: food.price * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId,
      username: userRes.data.user.username,
      items: orderItems,
      totalAmount,
      note: note || "",
      status: "PENDING", // PENDING → PAID → COMPLETED / CANCELLED
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    console.log(`📦 Đơn hàng mới: ${newOrder.id} - ${newOrder.username} - ${totalAmount.toLocaleString()}đ`);
    res.status(201).json({ message: "Tạo đơn hàng thành công", order: newOrder });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error("❌ Order Error:", detail);
    res.status(500).json({
      message: "Lỗi tạo đơn hàng",
      error: err.message,
      detail,
    });
  }
};

const getAllOrders = (req, res) => {
  const { userId, status } = req.query;
  let result = [...orders];
  if (userId) result = result.filter((o) => o.userId === userId);
  if (status) result = result.filter((o) => o.status === status);
  res.json(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const getOrderById = (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  res.json(order);
};

// Internal — Payment Service gọi để update status
const updateOrderStatus = (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  order.status = req.body.status;
  order.updatedAt = new Date().toISOString();
  res.json({ message: "Cập nhật trạng thái thành công", order });
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
