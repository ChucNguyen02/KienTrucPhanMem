import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.token);
      toast.success(`Chào mừng ${res.data.user.username}! 🎉`);
      nav("/foods");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍜 Mini Food</h1>
        <h2 style={styles.subtitle}>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, color: "#666" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: "#e05d00" }}>Đăng ký</Link>
        </p>
        <div style={styles.hint}>
          <b>Demo:</b> admin@company.com / password
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff8f0" },
  card: { background: "#fff", borderRadius: 16, padding: "40px 36px", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", fontSize: 32, margin: "0 0 4px" },
  subtitle: { textAlign: "center", color: "#666", fontWeight: 400, margin: "0 0 24px" },
  input: { width: "100%", padding: "12px 14px", marginBottom: 14, border: "1.5px solid #ddd", borderRadius: 8, fontSize: 15, boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "13px", background: "#e05d00", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" },
  hint: { marginTop: 16, background: "#fff8f0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#666", textAlign: "center" },
};
