import { create } from 'zustand';

export interface CartItem {
  id: number | string;
  title: string;
  price: string;
  quantity: number;
  image?: string;
}

interface StoreState {
  // UI State
  isSearchModalOpen: boolean;
  isCartOpen: boolean;
  setSearchModalOpen: (isOpen: boolean) => void;
  setCartOpen: (isOpen: boolean) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // UI Actions
  isSearchModalOpen: false,
  isCartOpen: false,
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  // Cart Actions
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ cart: [] }),
}));
