import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useDualEsp32Store = create((set) => ({
    loading: false,
    data: null,
    images: null,
    capture: async () => {
        try {
            set({ loading: true });
            const response = await fetch(`${API_BASE_URL}/api/dual_esp32/capture_coordinated`, {
                method: 'POST',
            });
            const json = await response.json();
            const images = json.front_image && json.side_image ? { front: json.front_image, side: json.side_image } : null;
            if (!response.ok) {
                set({ data: null, images });
                toast.error(json.error || `Server error ${response.status}`);
                return { data: null, images };
            }
            set({ data: json.data, images });
            toast.success('Measurement successful!');
            return { data: json.data, images };
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'An error occurred');
            return null;
        } finally {
            set({ loading: false });
        }
    },
}));
