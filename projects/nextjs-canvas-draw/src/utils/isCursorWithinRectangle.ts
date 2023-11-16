type TOpts = {
    x: number;
    y: number;
    width: number;
    height: number;
    relativeMouseX: number;
    relativeMouseY: number;
};

export function isCursorWithinRectangle(opts: TOpts): boolean {
    const { x, y, width, height, relativeMouseX, relativeMouseY } = opts;
    const minX = x;
    const maxX = minX + width;

    const minY = y;
    const maxY = minY + height;

    if (relativeMouseX >= minX && relativeMouseX <= maxX && relativeMouseY >= minY && relativeMouseY <= maxY) {
        return true;
    }

    return false;
}
