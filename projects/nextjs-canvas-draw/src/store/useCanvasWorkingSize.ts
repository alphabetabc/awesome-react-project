import { create } from 'zustand';

import type { CanvasWorkingSize } from '@/config/types';

const DEFAULT_CANVAS_OBJECT_SIZE = {
    width: 500,
    height: 500,
};

export const useCanvasWorkingSize = create<{
    canvasWorkingSize: CanvasWorkingSize;
    setCanvasWorkingWidth: (width: number) => void;
    setCanvasWorkingHeight: (height: number) => void;
}>((set) => {
    return {
        canvasWorkingSize: { width: DEFAULT_CANVAS_OBJECT_SIZE.width, height: DEFAULT_CANVAS_OBJECT_SIZE.height },
        setCanvasWorkingWidth: (width) => set((state) => ({ ...state, canvasWorkingSize: { ...state.canvasWorkingSize, width } })),
        setCanvasWorkingHeight: (height) => set((state) => ({ ...state, canvasWorkingSize: { ...state.canvasWorkingSize, height } })),
    };
});
