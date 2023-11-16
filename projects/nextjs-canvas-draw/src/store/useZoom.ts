import { create } from 'zustand';

const DEFAULT_ZOOM = 100;

const MIN_ZOOM = 10;
const MAX_ZOOM = 200;

export const useZoom = create<{
    zoom: number;
    resetZoom: () => void;
    setZoom: (zoom: number) => void;
    decrementZoom: (zoom: number) => void;
    incrementZoom: (zoom: number) => void;
}>((set) => {
    return {
        zoom: DEFAULT_ZOOM,
        resetZoom: () => set(() => ({ zoom: DEFAULT_ZOOM })),
        setZoom: (zoom) => set(() => ({ zoom })),
        decrementZoom: (zoom: number) => {
            return set((state) => {
                const newZoom = state.zoom - zoom;
                return {
                    zoom: newZoom < MIN_ZOOM ? MIN_ZOOM : newZoom,
                };
            });
        },
        incrementZoom: (zoom: number) => {
            return set((state) => {
                const newZoom = state.zoom + zoom;
                return { zoom: newZoom > MAX_ZOOM ? MAX_ZOOM : newZoom };
            });
        },
    };
});
