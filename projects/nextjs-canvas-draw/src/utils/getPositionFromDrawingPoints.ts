import type { CanvasObject } from '@/config/types';

export const getPositionFromDrawingPoints = ({ freeDrawPoints }: { freeDrawPoints: CanvasObject['freeDrawPoints'] }) => {
    return {
        x: Math.min(...freeDrawPoints.map((point) => point.x)),
        y: Math.min(...freeDrawPoints.map((point) => point.y)),
    };
};
