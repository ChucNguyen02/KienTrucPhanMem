import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post("/api/users/register", data),
  login:    (data) => api.post("/api/users/login", data),
  me:       ()     => api.get("/api/users/me"),
};

export const movieAPI = {
  list:   ()       => api.get("/api/movies"),
  get:    (id)     => api.get(`/api/movies/${id}`),
  create: (data)   => api.post("/api/movies", data),
};

export const bookingAPI = {
  create:  (data)  => api.post("/api/bookings", data),
  myList:  ()      => api.get("/api/bookings"),
  allList: ()      => api.get("/api/bookings?all=true"),
};

export const notificationAPI = {
  list: (userId) => api.get(`/api/notifications${userId ? `?userId=${userId}` : ""}`),
};

export const eventAPI = {
  list: () => api.get("/api/events"),
};
