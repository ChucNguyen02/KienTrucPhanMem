import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { foodId: food.id, name: food.name, price: food.price, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId) => setCart((prev) => prev.filter((i) => i.foodId !== foodId));

  const updateQty = (foodId, qty) => {
    if (qty <= 0) return removeFromCart(foodId);
    setCart((prev) => prev.map((i) => (i.foodId === foodId ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
