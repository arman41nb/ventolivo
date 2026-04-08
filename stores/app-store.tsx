"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

interface AppState {
  cart: CartItem[];
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

type AppAction =
  | { type: "ADD_TO_CART"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_FROM_CART"; payload: { productId: number } }
  | { type: "CLEAR_CART" };

const initialState: AppState = {
  cart: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((item) => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.payload.productId),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useCart() {
  const { state, dispatch } = useApp();
  return {
    items: state.cart,
    addItem: (item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD_TO_CART", payload: item }),
    removeItem: (productId: number) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: { productId } }),
    clear: () => dispatch({ type: "CLEAR_CART" }),
    totalItems: state.cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}
