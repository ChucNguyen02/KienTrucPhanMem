import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleOrder = async () => {
    if (!cart.length) return toast.error("Giỏ hàng trống!");
    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        items: cart.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
        note,
      };
      const res = await createOrder(payload);
      toast.success(`Đặt hàng thành công! Đơn: ${res.data.order.id}`);
      clearCart();
      nav("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return (
    <div style={styles.empty}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2>Giỏ hàng trống</h2>
      <button style={styles.btnPrimary} onClick={() => nav("/foods")}>← Quay lại menu</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button style={styles.backBtn} onClick={() => nav("/foods")}>←</button>
          <h2 style={{ margin: 0 }}>🛒 Giỏ hàng của bạn</h2>
        </div>

        <div style={styles.layout}>
          <div style={styles.items}>
            {cart.map((item) => (
              <div key={item.foodId} style={styles.item}>
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemPrice}>{Number(item.price).toLocaleString()}đ / phần</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={styles.qtyBox}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.foodId, item.quantity - 1)}>−</button>
                    <span style={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.foodId, item.quantity + 1)}>+</button>
                  </div>
                  <span style={{ fontWeight: 700, minWidth: 90, textAlign: "right" }}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.foodId)}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h3 style={{ margin: "0 0 16px" }}>Tóm tắt đơn hàng</h3>
            <textarea
              style={styles.noteInput}
              placeholder="Ghi chú (không bắt buộc)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div style={styles.totalRow}>
              <span>Tổng cộng:</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#e05d00" }}>{total.toLocaleString()}đ</span>
            </div>
            <button style={styles.orderBtn} onClick={handleOrder} disabled={loading}>
              {loading ? "Đang đặt hàng..." : "🍽️ Đặt hàng ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9f5f0", padding: 24, fontFamily: "sans-serif" },
  container: { maxWidth: 860, margin: "0 auto" },
  layout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" },
  items: { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0f0f0" },
  itemName: { fontWeight: 600, fontSize: 15 },
  itemPrice: { color: "#888", fontSize: 13, marginTop: 2 },
  qtyBox: { display: "flex", alignItems: "center", gap: 8, background: "#f9f5f0", borderRadius: 8, padding: "4px 10px" },
  qtyBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#e05d00", fontWeight: 700 },
  removeBtn: { background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 },
  summary: { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  noteInput: { width: "100%", border: "1.5px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 14, resize: "none", boxSizing: "border-box", marginBottom: 16, fontFamily: "sans-serif" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 16 },
  orderBtn: { width: "100%", padding: "13px", background: "#e05d00", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer" },
  backBtn: { background: "#f0f0f0", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 16 },
  btnPrimary: { background: "#e05d00", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 16 },
  empty: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "sans-serif" },
};
