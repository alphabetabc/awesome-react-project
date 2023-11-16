import svgPathParser from 'svgpath';
import type { IconObject } from '@/config/types';
import { hexToRgba } from '../hexToRgba';
import { getDimensionsFromSVGIconObject } from '../getDimensionsFromSVGIconObject';

export const renderSvgIcon = (option: { context: CanvasRenderingContext2D } & Omit<IconObject, 'type'>) => {
    const { context, x, y, width, height, backgroundColorHex, opacity, svgPath } = option;

    context.fillStyle = hexToRgba({ hex: backgroundColorHex, opacity });

    const dimensions = getDimensionsFromSVGIconObject({ context, iconObject: { x, y, width, height, svgPath } });
    const transformed = svgPathParser(svgPath)
        .rel()
        .scale(dimensions.widthRatio, dimensions.heightRatio)
        .translate(x - dimensions.svgAdjustedX, y - dimensions.svgAdjustedY)
        .toString();

    context.beginPath();
    const path2d = new Path2D(transformed);
    context.fill(path2d);
    context.closePath();
};
