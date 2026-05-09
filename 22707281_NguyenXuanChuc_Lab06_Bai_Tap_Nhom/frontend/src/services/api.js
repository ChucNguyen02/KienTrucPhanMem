import axios from "axios";

const USER_URL = import.meta.env.VITE_USER_SERVICE;
const FOOD_URL = import.meta.env.VITE_FOOD_SERVICE;
const ORDER_URL = import.meta.env.VITE_ORDER_SERVICE;
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_SERVICE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── User Service ───────────────────────────────────
export const register = (data) => axios.post(`${USER_URL}/register`, data);
export const login = (data) => axios.post(`${USER_URL}/login`, data);
export const getUsers = () => axios.get(`${USER_URL}/users`, { headers: getAuthHeader() });

// ─── Food Service ────────────────────────────────────
export const getFoods = () => axios.get(`${FOOD_URL}/foods`);
export const createFood = (data) => axios.post(`${FOOD_URL}/foods`, data);
export const updateFood = (id, data) => axios.put(`${FOOD_URL}/foods/${id}`, data);
export const deleteFood = (id) => axios.delete(`${FOOD_URL}/foods/${id}`);

// ─── Order Service ───────────────────────────────────
export const createOrder = (data) => axios.post(`${ORDER_URL}/orders`, data);
export const getOrders = (userId) =>
  axios.get(`${ORDER_URL}/orders`, { params: userId ? { userId } : {} });

// ─── Payment Service ─────────────────────────────────
export const createPayment = (data) => axios.post(`${PAYMENT_URL}/payments`, data);
