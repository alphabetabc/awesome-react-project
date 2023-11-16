import { create } from 'zustand';

import type {
    CanvasObject,
    RectangleObject,
    EllipseObject,
    FreeDrawObject,
    TextObject,
    IconObject,
    ImageObject,
    ActionModeOption,
    CanvasWorkingSize,
} from '@/config/types';

import generateUniqueId from '@/utils/generateUniqueId';
import { getPositionFromDrawingPoints } from '@/utils/getPositionFromDrawingPoints';

const curateObjectModification = (newObject: CanvasObject, existing: CanvasObject) => {
    const hasNegativeISze = newObject.width < 1 || newObject.height < 1;
    if (hasNegativeISze) return existing;
    const isTextWithLessThanThreshold = newObject.type === 'text' && newObject.width < newObject.fontSize;
    return isTextWithLessThanThreshold ? existing : newObject;
};

const DEFAULT_CANVAS_OBJECT: Omit<CanvasObject, 'id' | 'type'> = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    backgroundColorHex: '#000000',
    strokeColorHex: '#000000',
    strokeWidth: 1,
    opacity: 100,
    borderRadius: 0,
    freeDrawPoints: [],
    text: '',
    textJustify: false,
    textAlignHorizontal: 'center',
    textAlignVertical: 'middle',
    fontColorHex: '#000000',
    fontSize: 48,
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    fontLineHeightRatio: 1,
    svgPath: '',
    imageUrl: '',
    imageElement: null,
};

type TUseCanvasObjects = {
    canvasObjects: CanvasObject[];
    appendRectangleObject: (rectangle: Omit<RectangleObject, 'type'>) => void;
    appendEllipseObject: (ellipse: Omit<EllipseObject, 'type'>) => void;
    appendFreeDrawObject: (freeDraw: Omit<FreeDrawObject, 'type'>) => void;
    appendTextObject: (text: Omit<TextObject, 'type'>) => void;
    appendIconObject: (icon: Omit<IconObject, 'type'>) => void;
    appendImageObject: (icon: Omit<ImageObject, 'type'>) => void;
    updateCanvasObject: (id: string, object: Partial<CanvasObject>) => void;
    appendFreeDrawPointToCanvasObject: (id: string, point: { x: number; y: number }) => void;
    deleteCanvasObject: (id: string) => void;
    moveCanvasObject: (params: { id: string; deltaPosition: { deltaX: number; deltaY: number }; canvasWorkingSize: CanvasWorkingSize }) => void;
    resizeCanvasObject: (params: {
        id: string;
        actionModeOption: ActionModeOption;
        delta: { deltaX: number; deltaY: number };
        canvasWorkingSize: CanvasWorkingSize;
    }) => void;
    setCanvasObjectLayerIndex: (id: string, layerIndex: number) => void;
    resetCanvasObjects: () => void;
};

const generateCanvasObject = (type: CanvasObject['type'], shape: any) => {
    return {
        ...DEFAULT_CANVAS_OBJECT,
        type,
        id: generateUniqueId(),
        ...shape,
    };
};

export const useCanvasObjects = create<TUseCanvasObjects>((set) => {
    return {
        canvasObjects: [],
        appendRectangleObject: (rectangle) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('rectangle', rectangle)] }));
        },
        appendEllipseObject: (ellipse) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('ellipse', ellipse)] }));
        },
        appendFreeDrawObject: (freeDraw) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('free-draw', freeDraw)] }));
        },
        appendTextObject: (text) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('text', text)] }));
        },
        appendIconObject: (icon) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('icon', icon)] }));
        },
        appendImageObject: (icon) => {
            return set((state) => ({ canvasObjects: [...state.canvasObjects, generateCanvasObject('image', icon)] }));
        },
        updateCanvasObject: (id, partialObject) => {
            return set((state) => ({
                canvasObjects: state.canvasObjects.map((existing) => {
                    return existing.id === id ? curateObjectModification({ ...existing, ...partialObject }, existing) : existing;
                }),
            }));
        },
        appendFreeDrawPointToCanvasObject(id, point) {
            set((state) => {
                const { x, y } = getPositionFromDrawingPoints({
                    freeDrawPoints: [...(state.canvasObjects.find((o) => o.id === id)?.freeDrawPoints || []), { x: point.x, y: point.y }],
                });

                return {
                    canvasObjects: state.canvasObjects.map((existing) => {
                        return existing.id === id ? { ...existing, x, y, freeDrawPoints: [...existing.freeDrawPoints, point] } : existing;
                    }),
                };
            });
        },
        deleteCanvasObject: (id) => {
            return set((state) => ({
                canvasObjects: state.canvasObjects.filter((existing) => existing.id !== id),
            }));
        },
        moveCanvasObject: (params) => {
            const { id, deltaPosition } = params;
            return set((state) => ({
                canvasObjects: state.canvasObjects.map((existing) => {
                    return existing.id === id
                        ? { ...existing, x: existing.x + deltaPosition.deltaX, y: existing.y + deltaPosition.deltaY }
                        : existing;
                }),
            }));
        },
        resizeCanvasObject(params) {
            const { id, actionModeOption, delta } = params;
            return set((state) => {
                return {
                    canvasObjects: state.canvasObjects.map((existing) => {
                        if (existing.id !== id) return existing;
                        let result: CanvasObject = existing;
                        switch (actionModeOption) {
                            case 'topLeft': {
                                result = {
                                    ...existing,
                                    x: existing.x + delta.deltaX,
                                    y: existing.y + delta.deltaY,
                                    width: existing.width - delta.deltaX,
                                    height: existing.height - delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x - (point.x - existing.x) * growthRatioX,
                                            y: point.y - (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'topCenter': {
                                result = {
                                    ...existing,
                                    y: existing.y + delta.deltaY,
                                    height: existing.height - delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x,
                                            y: point.y - (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'topRight': {
                                result = {
                                    ...existing,
                                    width: existing.width + delta.deltaX,
                                    height: existing.height - delta.deltaY,
                                    y: existing.y + delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x + (point.x - existing.x) * growthRatioX,
                                            y: point.y - (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'middleLeft': {
                                result = {
                                    ...existing,
                                    x: existing.x + delta.deltaX,
                                    width: existing.width - delta.deltaX,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        return {
                                            x: point.x - (point.x - existing.x) * growthRatioX,
                                            y: point.y,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'middleRight': {
                                result = {
                                    ...existing,
                                    width: existing.width + delta.deltaX,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        return {
                                            x: point.x + (point.x - existing.x) * growthRatioX,
                                            y: point.y,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'bottomLeft': {
                                result = {
                                    ...existing,
                                    x: existing.x + delta.deltaX,
                                    width: existing.width - delta.deltaX,
                                    height: existing.height + delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x - (point.x - existing.x) * growthRatioX,
                                            y: point.y + (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'bottomCenter': {
                                result = {
                                    ...existing,
                                    height: existing.height + delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x,
                                            y: point.y + (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                            case 'bottomRight':
                            default: {
                                result = {
                                    ...existing,
                                    width: existing.width + delta.deltaX,
                                    height: existing.height + delta.deltaY,
                                    freeDrawPoints: existing.freeDrawPoints.map((point) => {
                                        const growthRatioX = delta.deltaX / existing.width;
                                        const growthRatioY = delta.deltaY / existing.height;
                                        return {
                                            x: point.x + (point.x - existing.x) * growthRatioX,
                                            y: point.y + (point.y - existing.y) * growthRatioY,
                                        };
                                    }),
                                };
                                break;
                            }
                        }
                        return curateObjectModification(result, existing);
                    }),
                };
            });
        },
        setCanvasObjectLayerIndex: (id, layerIndex) => {
            return set((state) => {
                if (layerIndex < 0 || layerIndex >= state.canvasObjects.length) {
                    return state;
                }

                return {
                    canvasObjects: state.canvasObjects.map((existing, index) => {
                        if (existing.id === id) {
                            return state.canvasObjects[layerIndex];
                        }
                        if (index === layerIndex) {
                            return state.canvasObjects.find((d) => d.id === id)!;
                        }
                        return existing;
                    }),
                };
            });
        },
        resetCanvasObjects: () => set(() => ({ canvasObjects: [] })),
    };
});
