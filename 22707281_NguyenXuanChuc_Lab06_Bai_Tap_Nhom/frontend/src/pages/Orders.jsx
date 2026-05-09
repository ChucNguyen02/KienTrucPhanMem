import { useEffect, useState } from "react";
import { getOrders, createPayment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_LABELS = {
  PENDING: { label: "⏳ Chờ thanh toán", color: "#f59e0b" },
  PAID: { label: "✅ Đã thanh toán", color: "#10b981" },
  CANCELLED: { label: "❌ Đã hủy", color: "#ef4444" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState({});
  const { user } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    try {
      const userId = user?.role === "ADMIN" ? undefined : user?.id;
      const res = await getOrders(userId);
      setOrders(res.data);
    } catch { toast.error("Không thể tải đơn hàng"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (order) => {
    const method = selectedMethod[order.id] || "COD";
    setPayingId(order.id);
    try {
      const res = await createPayment({ orderId: order.id, method, username: user?.username });
      toast.success(`Thanh toán thành công! 🎉`);
      console.log("🔔 Notification:", res.data.notification);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button style={styles.backBtn} onClick={() => nav("/foods")}>←</button>
          <h2 style={{ margin: 0 }}>📋 {user?.role === "ADMIN" ? "Tất cả đơn hàng" : "Đơn hàng của tôi"}</h2>
          <button style={styles.refreshBtn} onClick={load}>🔄</button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: 40 }}>Đang tải...</p>
        ) : orders.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 56 }}>📭</div>
            <p>Chưa có đơn hàng nào</p>
            <button style={styles.btnPrimary} onClick={() => nav("/foods")}>Đặt món ngay</button>
          </div>
        ) : (
          orders.map((order) => {
            const status = STATUS_LABELS[order.status] || { label: order.status, color: "#888" };
            return (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.orderId}>{order.id}</span>
                    <span style={{ marginLeft: 12, color: "#888", fontSize: 13 }}>
                      👤 {order.username}
                    </span>
                  </div>
                  <span style={{ ...styles.statusBadge, color: status.color, borderColor: status.color }}>
                    {status.label}
                  </span>
                </div>

                <div style={styles.itemsList}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.itemRow}>
                      <span>{item.foodName} × {item.quantity}</span>
                      <span style={{ color: "#666" }}>{item.subtotal.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div style={styles.note}>📝 {order.note}</div>
                )}

                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.total}>Tổng: {order.totalAmount.toLocaleString()}đ</span>
                    <span style={{ color: "#aaa", fontSize: 12, marginLeft: 12 }}>
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {order.status === "PENDING" && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select
                        style={styles.select}
                        value={selectedMethod[order.id] || "COD"}
                        onChange={(e) => setSelectedMethod({ ...selectedMethod, [order.id]: e.target.value })}
                      >
                        <option value="COD">💵 COD</option>
                        <option value="BANKING">🏦 Banking</option>
                      </select>
                      <button
                        style={styles.payBtn}
                        onClick={() => handlePay(order)}
                        disabled={payingId === order.id}
                      >
                        {payingId === order.id ? "Đang xử lý..." : "Thanh toán"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9f5f0", padding: 24, fontFamily: "sans-serif" },
  container: { maxWidth: 800, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  orderId: { fontWeight: 700, fontSize: 15, fontFamily: "monospace" },
  statusBadge: { border: "1.5px solid", borderRadius: 99, padding: "3px 12px", fontSize: 13, fontWeight: 600 },
  itemsList: { borderTop: "1px solid #f0f0f0", paddingTop: 12, marginBottom: 12 },
  itemRow: { display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14 },
  note: { background: "#fff8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#888", marginBottom: 12 },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: 12 },
  total: { fontWeight: 700, fontSize: 16, color: "#e05d00" },
  select: { padding: "8px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14, background: "#fff" },
  payBtn: { background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  backBtn: { background: "#f0f0f0", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 16 },
  refreshBtn: { background: "#f0f0f0", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 16 },
  btnPrimary: { background: "#e05d00", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  empty: { textAlign: "center", padding: 60, color: "#888" },
};
