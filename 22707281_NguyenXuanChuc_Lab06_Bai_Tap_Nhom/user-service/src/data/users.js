// In-memory DB — reset khi restart server
const users = [
  {
    id: "admin-001",
    username: "admin",
    email: "admin@company.com",
    // password: "password"
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-001",
    username: "nguyenvana",
    email: "vana@company.com",
    // password: "password"
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "USER",
    createdAt: new Date().toISOString(),
  },
];

module.exports = users;
