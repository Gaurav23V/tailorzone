'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: {
      url: string;
      isDefault?: boolean;
    }[];
    inventory: {
      quantity: number;
    };
  };
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        error: null,
      };

    case 'ADD_ITEM':
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
    error: null,
  });

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch cart');

        const cart = await response.json();
        dispatch({ type: 'SET_ITEMS', payload: cart.items });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            error instanceof Error ? error.message : 'Failed to fetch cart',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCart();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = async (item: { productId: string; quantity: number }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('Failed to add item to cart');

      const cart = await response.json();
      dispatch({ type: 'SET_ITEMS', payload: cart.items });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Failed to add to cart',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Make API call to remove item from cart
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/items/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      dispatch({ type: 'REMOVE_ITEM', payload: productId });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedCart = await response.json();
      dispatch({ type: 'SET_ITEMS', payload: updatedCart.items });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Failed to update quantity',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Make API call to clear cart
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
