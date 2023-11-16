export const canvasInit = (options: {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    canvasWidth: number;
    canvasHeight: number;
}) => {
    const { canvas, context, canvasWidth, canvasHeight } = options;
    if (!canvas || !context) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
};
