import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      nav("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍜 Mini Food</h1>
        <h2 style={styles.subtitle}>Tạo tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Tên người dùng" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Mật khẩu" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "#e05d00" }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff8f0" },
  card: { background: "#fff", borderRadius: 16, padding: "40px 36px", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", fontSize: 32, margin: "0 0 4px" },
  subtitle: { textAlign: "center", color: "#666", fontWeight: 400, margin: "0 0 24px" },
  input: { width: "100%", padding: "12px 14px", marginBottom: 14, border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, boxSizing: "border-box" },
  btn: { width: "100%", padding: "13px", background: "#e05d00", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" },
};
