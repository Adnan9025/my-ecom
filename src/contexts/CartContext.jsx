import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const item = action.payload;
      const itemId = item._id || item.id;
      const existingItem = state.items.find(
        (i) => (i._id || i.id) === itemId
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((i) =>
          (i._id || i.id) === itemId
            ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
            : i
        );
      } else {
        updatedItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
      }
      return { ...state, items: updatedItems };
    }

    case "REMOVE_FROM_CART": {
      // Handles both direct ID strings AND objects like { id } or { _id }
      const targetId =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload.id || action.payload._id
          : action.payload;

      const updatedItems = state.items.filter(
        (i) => (i._id || i.id) !== targetId && i._id !== targetId && i.id !== targetId
      );
      return { ...state, items: updatedItems };
    }

    case "UPDATE_QUANTITY": {
      const payload = action.payload || {};
      const targetId = payload.id || payload._id;
      const qty = payload.quantity;

      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => (i._id || i.id) !== targetId && i._id !== targetId && i.id !== targetId
          ),
        };
      }
      const updatedItems = state.items.map((i) =>
        (i._id || i.id) === targetId || i._id === targetId || i.id === targetId
          ? { ...i, quantity: qty }
          : i
      );
      return { ...state, items: updatedItems };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
};

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};