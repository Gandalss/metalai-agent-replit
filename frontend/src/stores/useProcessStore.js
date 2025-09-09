import { create } from 'zustand';

export const useProcessStore = create((set) => ({
    step: 1,
    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: Math.min(4, state.step + 1) })),
    reset: () => set({ step: 1 }),
}));
