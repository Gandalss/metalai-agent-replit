import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useMeasurementsStore = create((set) => ({
    measurements: null,
    loading: false,
    updateMeasurements: (newData) =>
        set((state) => ({ measurements: { ...state.measurements, ...newData } })),
    getMeasurements: async (image1, image2) => {
        try {
            set({ loading: true });
            const formData = new FormData();
            formData.append('image1', image1);
            formData.append('image2', image2);
            const response = await fetch(`${API_BASE_URL}/api/measurements/`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                // If the backend returns an HTML error page, trying to parse it
                // as JSON would throw an exception. Read the text instead and
                // throw a descriptive error.
                const text = await response.text();
                throw new Error(`Server error ${response.status}: ${text}`);
            }
            const { data } = await response.json();
            set({ measurements: data });
            toast.success('Measurements done successfully!');
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            set({ loading: false });
        }
    },
}));
