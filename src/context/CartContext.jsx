import React, { createContext, useContext, useState, useEffect } from "react";

const CART_STORAGE_KEY = "crytek_cart";
const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readStoredCart());

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors in demo mode
    }
  }, [cartItems]);

  useEffect(() => {
    const syncCart = () => setCartItems(readStoredCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const addToCart = (item) => {
    if (!item) return;
    setCartItems((prev) => {
      const uniqueId = item.id || item.title;
      const existing = prev.find(
        (entry) => (entry.id || entry.title) === uniqueId,
      );
      if (existing) {
        return prev.map((entry) =>
          (entry.id || entry.title) === uniqueId
            ? { ...entry, quantity: (entry.quantity || 1) + 1 }
            : entry,
        );
      }
      return [...prev, { ...item, id: uniqueId, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const removeSelectedItems = (ids) => {
    const idSet = new Set(ids);
    setCartItems((prev) => prev.filter((item) => !idSet.has(item.id)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeSelectedItems,
        clearCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return ctx;
};
