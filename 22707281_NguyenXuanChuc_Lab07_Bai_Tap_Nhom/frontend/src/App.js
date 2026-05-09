import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { authAPI, movieAPI, bookingAPI, notificationAPI, eventAPI } from "./services/api";
import "./index.css";

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) setUser(JSON.parse(saved));
  }, []);
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">🎬 CineTicket</Link>
      <div className="nav-links">
        <Link to="/movies">Phim</Link>
        {user ? (
          <>
            <Link to="/bookings">Vé của tôi</Link>
            <Link to="/notifications">Thông báo</Link>
            <Link to="/events">Event Log</Link>
            <span className="nav-user">👤 {user.username}</span>
            <button className="btn-sm" onClick={() => { logout(); navigate("/login"); }}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register" className="btn-primary-sm">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      navigate("/movies");
    } catch (e) {
      setError(e.response?.data?.error || "Đăng nhập thất bại");
    } finally { setLoading(false); }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>🔐 Đăng nhập</h2>
        {error && <div className="alert-error">{error}</div>}
        <input placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Mật khẩu" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      await authAPI.register(form);
      setSuccess("✅ Đăng ký thành công! Event USER_REGISTERED đã được publish.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e.response?.data?.error || "Đăng ký thất bại");
    } finally { setLoading(false); }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>📝 Đăng ký</h2>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}
        <input placeholder="Tên đăng nhập" value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Mật khẩu" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
        <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div>
    </div>
  );
}

// ─── Movies Page ──────────────────────────────────────────────────────────────
function MoviesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ movieId: null, seats: 1 });
  const [bookingStatus, setBookingStatus] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: "", description: "", genre: "Action", duration: 120, price: 100000, totalSeats: 100 });

  const load = async () => {
    setLoading(true);
    const { data } = await movieAPI.list();
    setMovies(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleBook = async (movieId) => {
    if (!user) { navigate("/login"); return; }
    setBookingStatus({ ...bookingStatus, [movieId]: "loading" });
    try {
      await bookingAPI.create({ movieId, seats: booking.movieId === movieId ? booking.seats : 1 });
      setBookingStatus({ ...bookingStatus, [movieId]: "success" });
      load(); // refresh seats
    } catch (e) {
      setBookingStatus({ ...bookingStatus, [movieId]: "error: " + (e.response?.data?.error || "Thất bại") });
    }
  };

  const handleAddMovie = async () => {
    try {
      await movieAPI.create(newMovie);
      setShowForm(false);
      load();
    } catch (e) { alert(e.response?.data?.error); }
  };

  const fmt = (n) => n?.toLocaleString("vi-VN") + "đ";

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎬 Danh sách phim</h1>
        {user && <button className="btn-secondary" onClick={() => setShowForm(!showForm)}>+ Thêm phim</button>}
      </div>

      {showForm && (
        <div className="add-movie-form">
          <h3>Thêm phim mới</h3>
          <div className="form-row">
            <input placeholder="Tên phim *" value={newMovie.title} onChange={e => setNewMovie({ ...newMovie, title: e.target.value })} />
            <input placeholder="Thể loại" value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })} />
            <input placeholder="Thời lượng (phút)" type="number" value={newMovie.duration} onChange={e => setNewMovie({ ...newMovie, duration: +e.target.value })} />
            <input placeholder="Giá vé (VND)" type="number" value={newMovie.price} onChange={e => setNewMovie({ ...newMovie, price: +e.target.value })} />
            <input placeholder="Số ghế" type="number" value={newMovie.totalSeats} onChange={e => setNewMovie({ ...newMovie, totalSeats: +e.target.value })} />
          </div>
          <textarea placeholder="Mô tả phim" value={newMovie.description} onChange={e => setNewMovie({ ...newMovie, description: e.target.value })} />
          <button className="btn-primary" onClick={handleAddMovie}>Thêm</button>
        </div>
      )}

      {loading ? <div className="loading">⏳ Đang tải...</div> : (
        <div className="movie-grid">
          {movies.map(m => (
            <div className="movie-card" key={m._id}>
              <div className="movie-badge">{m.genre}</div>
              <h3>{m.title}</h3>
              <p className="movie-desc">{m.description}</p>
              <div className="movie-meta">
                <span>⏱ {m.duration} phút</span>
                <span>💺 {m.availableSeats}/{m.totalSeats} ghế</span>
                <span className="price">{fmt(m.price)}</span>
              </div>
              {user && (
                <div className="booking-row">
                  <input type="number" min="1" max={m.availableSeats}
                    value={booking.movieId === m._id ? booking.seats : 1}
                    onChange={e => setBooking({ movieId: m._id, seats: +e.target.value })}
                    className="seat-input" />
                  <span>ghế</span>
                  <button
                    className="btn-book"
                    onClick={() => handleBook(m._id)}
                    disabled={m.availableSeats === 0 || bookingStatus[m._id] === "loading"}
                  >
                    {m.availableSeats === 0 ? "Hết ghế" : bookingStatus[m._id] === "loading" ? "⏳" : "Đặt vé"}
                  </button>
                </div>
              )}
              {bookingStatus[m._id] && bookingStatus[m._id] !== "loading" && (
                <div className={bookingStatus[m._id] === "success" ? "alert-success" : "alert-error"}>
                  {bookingStatus[m._id] === "success"
                    ? "✅ Đặt vé thành công! Payment đang xử lý..."
                    : bookingStatus[m._id]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bookings Page ────────────────────────────────────────────────────────────
function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await bookingAPI.myList();
      setBookings(data);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 3000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const statusColor = { PENDING: "#f59e0b", CONFIRMED: "#10b981", FAILED: "#ef4444" };
  const fmt = (n) => n?.toLocaleString("vi-VN") + "đ";

  return (
    <div className="page">
      <h1>🎫 Vé của tôi <span className="auto-refresh-badge">🔄 tự cập nhật</span></h1>
      {loading ? <div className="loading">⏳</div> : bookings.length === 0 ? (
        <div className="empty">Chưa có vé nào. <Link to="/movies">Đặt ngay!</Link></div>
      ) : (
        <div className="booking-list">
          {bookings.map(b => (
            <div className="booking-card" key={b._id}>
              <div className="booking-header">
                <h3>{b.movieTitle}</h3>
                <span className="status-badge" style={{ background: statusColor[b.status] }}>{b.status}</span>
              </div>
              <div className="booking-meta">
                <span>💺 {b.seats} ghế</span>
                <span>💰 {fmt(b.totalPrice)}</span>
                <span>📅 {new Date(b.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <div className="booking-id">ID: #{b._id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────
function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await notificationAPI.list(user?.id);
      setNotifications(data);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="page">
      <h1>🔔 Thông báo <span className="auto-refresh-badge">🔄 tự cập nhật</span></h1>
      {notifications.length === 0 ? <div className="empty">Chưa có thông báo</div> : (
        <div className="notification-list">
          {notifications.map(n => (
            <div className={`notification-card ${n.type}`} key={n._id}>
              <p>{n.message}</p>
              <span className="notif-time">{new Date(n.createdAt).toLocaleString("vi-VN")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event Log Page ───────────────────────────────────────────────────────────
function EventLogPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await eventAPI.list();
      setEvents(data);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const eventColor = {
    USER_REGISTERED: "#6366f1",
    BOOKING_CREATED: "#f59e0b",
    PAYMENT_COMPLETED: "#10b981",
    BOOKING_FAILED: "#ef4444",
  };

  return (
    <div className="page">
      <h1>📋 Event Log <span className="auto-refresh-badge">🔄 live</span></h1>
      <div className="event-list">
        {events.map(e => (
          <div className="event-card" key={e._id}>
            <div className="event-header">
              <span className="event-badge" style={{ background: eventColor[e.event] || "#64748b" }}>{e.event}</span>
              <span className="event-time">{new Date(e.timestamp).toLocaleString("vi-VN")}</span>
            </div>
            <pre className="event-data">{JSON.stringify(e.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventLogPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
