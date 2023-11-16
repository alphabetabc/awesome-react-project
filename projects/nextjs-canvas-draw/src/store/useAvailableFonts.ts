import { create } from 'zustand';

type TUseAvailableFonts = {
    availableFonts: string[];
    setAvailableFonts: (availableFonts: string[]) => void;
};

export const useAvailableFonts = create<TUseAvailableFonts>((set) => {
    return {
        availableFonts: [],
        setAvailableFonts: (availableFonts) => set(() => ({ availableFonts })),
    };
});
