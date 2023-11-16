import type { FreeDrawObject } from '@/config/types';
import { hexToRgba } from '../hexToRgba';
import { getPositionFromDrawingPoints } from '../getPositionFromDrawingPoints';

export const renderFreeDrawing = (option: { context: CanvasRenderingContext2D } & Omit<FreeDrawObject, 'type'>) => {
    const { context, x, y, strokeColorHex, strokeWidth, opacity, freeDrawPoints } = option;

    context.strokeStyle = hexToRgba({ hex: strokeColorHex, opacity });
    context.lineWidth = strokeWidth || 1;
    context.beginPath();

    const positionFromDrawingPoints = getPositionFromDrawingPoints({ freeDrawPoints });
    freeDrawPoints.forEach((point, index) => {
        const realX = x - positionFromDrawingPoints.x + point.x;
        const realY = y - positionFromDrawingPoints.y + point.y;

        if (index === 0) {
            context.moveTo(realX, realY);
        } else {
            context.lineTo(realX, realY);
        }
    });

    context.stroke();
    context.closePath();
};
