import { create } from 'zustand';

export const useCanvasBackgroundColor = create<{
    canvasBackgroundColor: string;
    setCanvasBackgroundColor: (canvasBackgroundColor: string) => void;
}>((set) => {
    return {
        canvasBackgroundColor: '#ffffff',
        setCanvasBackgroundColor: (canvasBackgroundColor) => set(() => ({ canvasBackgroundColor })),
    };
});
