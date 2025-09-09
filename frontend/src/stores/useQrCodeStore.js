import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import QRCode from "qrcode";

export const useQrCodeStore = create((set) => ({
    qrCode: null,
    loading: false,
    generateQrCode: async (measurements) => {
        try {
            set({ loading: true });
            const jsonString = JSON.stringify(measurements);
            try {
                const url = await QRCode.toDataURL(jsonString);
                set({ qrCode: url });
                toast.success("QR generated successfully!");
            } catch (err) {
                toast.error("QR generation failed");
                console.error("QR generation failed:", err);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },
}));
