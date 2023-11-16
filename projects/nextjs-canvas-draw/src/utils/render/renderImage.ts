import type { ImageObject } from '@/config/types';

export const renderImage = (option: { context: CanvasRenderingContext2D } & Omit<ImageObject, 'type'>) => {
    const { context, x, y, width, height, opacity, imageElement } = option;
    context.globalAlpha = opacity / 100;
    if (imageElement) {
        context.drawImage(imageElement, x, y, width, height);
    }
    context.globalAlpha = 1;
};
