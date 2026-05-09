const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const users = require("../data/users");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    if (users.find((u) => u.email === email))
      return res.status(409).json({ message: "Email đã tồn tại" });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashed,
      role: role === "ADMIN" ? "ADMIN" : "USER",
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const { password: _, ...safe } = newUser;
    res.status(201).json({ message: "Đăng ký thành công", user: safe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Sai mật khẩu" });
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    const { password: _, ...safe } = user;
    res.json({ message: "Đăng nhập thành công", token, user: safe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUsers = (req, res) => {
  res.json(users.map(({ password, ...u }) => u));
};

const getUserById = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy" });
  const { password, ...safe } = user;
  res.json(safe);
};

// Internal API — Order Service gọi để validate user
const validateUser = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ valid: false, message: "User not found" });
  const { password, ...safe } = user;
  res.json({ valid: true, user: safe });
};

module.exports = { register, login, getUsers, getUserById, validateUser };
