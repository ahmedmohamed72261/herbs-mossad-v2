import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

export interface CartItem {
  id: number | string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  unit?: string;
}

interface AppState {
  language: Language;
  theme: Theme;
  cart: CartItem[];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: CartItem['id']) => void;
  setQuantity: (id: CartItem['id'], quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'light',
      cart: [],
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      addToCart: (item, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find((entry) => entry.id === item.id);
        if (existing) {
          set({
            cart: cart.map((entry) =>
              entry.id === item.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry
            ),
          });
          return;
        }
        set({ cart: [...cart, { ...item, quantity }] });
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((entry) => entry.id !== id) }),
      setQuantity: (id, quantity) =>
        set({
          cart: get()
            .cart.map((entry) =>
              entry.id === id ? { ...entry, quantity: Math.max(1, quantity) } : entry
            )
            .filter((entry) => entry.quantity > 0),
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'herbs-app-storage',
    }
  )
);

export const DELIVERY_CHARGES = 5;

export const getCartTotals = (cart: CartItem[], discount = 0) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? DELIVERY_CHARGES : 0;
  const total = Math.max(0, subtotal + delivery - discount);
  return { itemCount, subtotal, delivery, discount, total };
};

export const formatPrice = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
