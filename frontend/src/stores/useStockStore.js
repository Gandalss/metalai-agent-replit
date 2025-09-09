import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useStockStore = create((set, get) => ({
    stock: [],
    filteredStock: [],
    filtered: false,
    loading: false,
    setFiltered: (value) => {
        set({ filtered: value });
    },
    getStock: async () => {
        try {
            set({ loading: true });
            const response = await fetch(`${API_BASE_URL}/api/metal_pieces/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const res = await response.json();
            set({ stock: res });
            toast.success("Stock loaded successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },
    postStock: async (measurements) => {
        try {
            set({ loading: true });
            const response = await fetch(`${API_BASE_URL}/api/metal_pieces/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(measurements)
            });
            const res = await response.json();
            set({ stock: res });
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },
    filterStock: async (measurements) => {
        try {
            set({ loading: true });
            set({ sortedStock: [] });
            set({ filtered: true });

            const minWidth = Number(measurements?.width) || 0;
            const minHeight = Number(measurements?.height) || 0;
            const minDepth = Number(measurements?.depth) || 0;

            const filtered = get().stock.filter(item => {
                if (item.width < minWidth) return false;
                if (item.height < minHeight) return false;
                if (item.depth < minDepth) return false;
                return true;
            });
            set({ filteredStock: filtered });
            toast.success("Stock filtered successfully!");
            console.log(filtered);
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },
    deleteStockItem: async (id) => {
        try {
            set({ loading: true });
            await fetch(`${API_BASE_URL}/api/metal_pieces/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success("Stock item deleted successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    }
}));
