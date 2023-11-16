import { create } from 'zustand';
import type { ScrollPosition } from '@/config/types';

type ScrollPositionDelta = {
    deltaX: number;
    deltaY: number;
};

export const useScrollPosition = create<{
    scrollPosition: ScrollPosition;
    setScrollPosition: (scrollPosition: ScrollPosition) => void;
    updateScrollPosition: (delta: ScrollPositionDelta) => void;
}>((set) => {
    return {
        scrollPosition: { x: 0, y: 0 },
        setScrollPosition: (scrollPosition: ScrollPosition) => set(() => ({ scrollPosition })),
        updateScrollPosition: (delta: ScrollPositionDelta) => {
            return set((state) => ({
                scrollPosition: {
                    x: state.scrollPosition.x + delta.deltaX,
                    y: state.scrollPosition.y + delta.deltaY,
                },
            }));
        },
    };
});
