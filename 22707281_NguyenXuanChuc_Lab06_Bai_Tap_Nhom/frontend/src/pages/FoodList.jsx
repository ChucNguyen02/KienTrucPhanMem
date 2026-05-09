import { useEffect, useState } from "react";
import { getFoods, createFood, deleteFood } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", price: "", category: "", description: "", image: "🍽️" });
  const { addToCart, cart } = useCart();
  const { user, logoutUser } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    try {
      const res = await getFoods();
      setFoods(res.data);
    } catch { toast.error("Không thể tải danh sách món"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = (food) => {
    addToCart(food);
    toast.success(`Đã thêm ${food.name} vào giỏ 🛒`);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createFood({ ...newFood, price: Number(newFood.price) });
      toast.success("Thêm món thành công!");
      setShowForm(false);
      setNewFood({ name: "", price: "", category: "", description: "", image: "🍽️" });
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi"); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa món "${name}"?`)) return;
    try {
      await deleteFood(id);
      toast.success("Đã xóa món");
      load();
    } catch { toast.error("Không thể xóa"); }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>🍜 Mini Food</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#666" }}>👤 {user?.username}</span>
          {user?.role === "ADMIN" && (
            <button style={styles.btnOutline} onClick={() => setShowForm(!showForm)}>
              {showForm ? "Đóng" : "＋ Thêm món"}
            </button>
          )}
          <button style={styles.cartBtn} onClick={() => nav("/cart")}>
            🛒 Giỏ hàng {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>
          <button style={styles.btnOutline} onClick={() => nav("/orders")}>📋 Đơn hàng</button>
          <button style={{ ...styles.btnOutline, color: "#e05d00", borderColor: "#e05d00" }}
            onClick={() => { logoutUser(); nav("/login"); }}>Đăng xuất</button>
        </div>
      </header>

      {showForm && (
        <div style={styles.formBox}>
          <h3 style={{ margin: "0 0 16px" }}>Thêm món mới</h3>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input style={styles.inp} placeholder="Tên món *" value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} required />
            <input style={styles.inp} type="number" placeholder="Giá (VNĐ) *" value={newFood.price} onChange={(e) => setNewFood({ ...newFood, price: e.target.value })} required />
            <input style={styles.inp} placeholder="Danh mục *" value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })} required />
            <input style={styles.inp} placeholder="Icon (emoji)" value={newFood.image} onChange={(e) => setNewFood({ ...newFood, image: e.target.value })} />
            <input style={{ ...styles.inp, flex: "1 1 300px" }} placeholder="Mô tả" value={newFood.description} onChange={(e) => setNewFood({ ...newFood, description: e.target.value })} />
            <button style={styles.btnPrimary} type="submit">Lưu</button>
          </form>
        </div>
      )}

      <main style={styles.main}>
        {loading ? <p style={{ textAlign: "center", padding: 40 }}>Đang tải...</p> : (
          <div style={styles.grid}>
            {foods.map((food) => (
              <div key={food.id} style={styles.card}>
                <div style={styles.emoji}>{food.image}</div>
                <div style={styles.cardBody}>
                  <div style={styles.category}>{food.category}</div>
                  <h3 style={styles.foodName}>{food.name}</h3>
                  <p style={styles.desc}>{food.description}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{Number(food.price).toLocaleString()}đ</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {user?.role === "ADMIN" && (
                        <button style={styles.btnDanger} onClick={() => handleDelete(food.id, food.name)}>🗑</button>
                      )}
                      <button style={styles.btnAdd} onClick={() => handleAdd(food)}>+ Thêm</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9f5f0", fontFamily: "sans-serif" },
  header: { background: "#fff", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 10 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", transition: "transform .15s", cursor: "default" },
  emoji: { fontSize: 56, textAlign: "center", padding: "20px 0 12px", background: "#fff8f0" },
  cardBody: { padding: "14px 16px 16px" },
  category: { fontSize: 11, fontWeight: 600, color: "#e05d00", textTransform: "uppercase", letterSpacing: 1 },
  foodName: { margin: "4px 0 6px", fontSize: 16, fontWeight: 700 },
  desc: { fontSize: 13, color: "#888", margin: "0 0 12px", lineHeight: 1.4 },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontWeight: 700, fontSize: 17, color: "#e05d00" },
  btnAdd: { background: "#e05d00", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, cursor: "pointer", fontSize: 13 },
  btnDanger: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 13 },
  cartBtn: { background: "#fff8f0", border: "1.5px solid #e05d00", color: "#e05d00", borderRadius: 8, padding: "7px 14px", fontWeight: 600, cursor: "pointer", position: "relative" },
  badge: { background: "#e05d00", color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 12, marginLeft: 6 },
  btnOutline: { background: "transparent", border: "1.5px solid #ddd", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 14 },
  btnPrimary: { background: "#e05d00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" },
  formBox: { maxWidth: 1100, margin: "16px auto 0", padding: "20px 24px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  inp: { padding: "10px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14, flex: "1 1 160px" },
};
