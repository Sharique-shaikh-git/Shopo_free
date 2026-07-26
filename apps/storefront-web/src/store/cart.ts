import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  quantity: number;
  thumbnailUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) => 
                item === existingItem 
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              )
            };
          }
          
          return { items: [...state.items, newItem] };
        });
      },
      
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          )
        }));
      },
      
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) => 
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'shopo-cart',
    }
  )
);
