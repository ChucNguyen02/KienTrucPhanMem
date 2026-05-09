const { v4: uuidv4 } = require("uuid");
const foods = require("../data/foods");

const getAllFoods = (req, res) => {
  const { category, available } = req.query;
  let result = [...foods];
  if (category) result = result.filter((f) => f.category === category);
  if (available !== undefined) result = result.filter((f) => f.available === (available === "true"));
  res.json(result);
};

const getFoodById = (req, res) => {
  const food = foods.find((f) => f.id === req.params.id);
  if (!food) return res.status(404).json({ message: "Không tìm thấy món ăn" });
  res.json(food);
};

const createFood = (req, res) => {
  const { name, price, category, image, description } = req.body;
  if (!name || !price || !category)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc (name, price, category)" });
  const newFood = {
    id: uuidv4(),
    name,
    price: Number(price),
    category,
    image: image || "🍽️",
    description: description || "",
    available: true,
    createdAt: new Date().toISOString(),
  };
  foods.push(newFood);
  res.status(201).json({ message: "Thêm món ăn thành công", food: newFood });
};

const updateFood = (req, res) => {
  const idx = foods.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Không tìm thấy món ăn" });
  foods[idx] = { ...foods[idx], ...req.body, id: foods[idx].id, updatedAt: new Date().toISOString() };
  res.json({ message: "Cập nhật thành công", food: foods[idx] });
};

const deleteFood = (req, res) => {
  const idx = foods.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Không tìm thấy món ăn" });
  const deleted = foods.splice(idx, 1)[0];
  res.json({ message: "Xóa thành công", food: deleted });
};

// Internal — Order Service gọi để lấy info món
const getFoodsByIds = (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: "ids phải là array" });
  const result = ids.map((id) => foods.find((f) => f.id === id)).filter(Boolean);
  res.json(result);
};

module.exports = { getAllFoods, getFoodById, createFood, updateFood, deleteFood, getFoodsByIds };
