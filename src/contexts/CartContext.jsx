import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem("luxora_cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const getItemId = (item) => item._id || item.id;

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload;
      const targetId = getItemId(newItem);

      const existingIndex = state.items.findIndex(
        (item) => getItemId(item) === targetId
      );

      if (existingIndex > -1) {
        const updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: (item.quantity || 1) + (newItem.quantity || 1),
            };
          }
          return item;
        });
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }],
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => getItemId(item) !== id),
        };
      }

      const updatedItems = state.items.map((item) => {
        if (getItemId(item) === id) {
          return { ...item, quantity };
        }
        return item;
      });

      return { ...state, items: updatedItems };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => getItemId(item) !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCart);

  useEffect(() => {
    localStorage.setItem("luxora_cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);