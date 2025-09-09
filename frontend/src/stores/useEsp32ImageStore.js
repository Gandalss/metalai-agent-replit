import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useEsp32ImageStore = create((set) => ({
    images: null,
    loading: false,
    capture: async () => {
        try {
            set({ loading: true });
            const response = await fetch(`${API_BASE_URL}/api/dual_esp32/capture_images`, {
                method: 'POST',
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server error ${response.status}: ${text}`);
            }
            const data = await response.json();
            set({ images: { front: data.front_image, side: data.side_image } });
            toast.success('Images captured successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            set({ loading: false });
        }
    },
}));
