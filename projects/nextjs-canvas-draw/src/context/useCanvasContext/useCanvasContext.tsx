'use client';

import React, { useContext, useRef, useMemo, useEffect, useCallback, createContext, createRef, type MutableRefObject } from 'react';

import { useActionMode } from '@/store/useActionMode';
import { useActiveObjectId } from '@/store/useActiveObjectId';
import { useCanvasBackgroundColor } from '@/store/useCanvasBackgroundColor';
import { useCanvasObjects } from '@/store/useCanvasObjects';
import { useCanvasWorkingSize } from '@/store/useCanvasWorkingSize';
import { useScrollPosition } from '@/store/useScrollPosition';
import { useWindowSize } from '@/store/useWindowSize';
import { useZoom } from '@/store/useZoom';

import { canvasInit } from './utils/canvasInit';
import { canvasSetCenter } from './utils/canvasSetCenter';
import { canvasDrawEverything } from './utils/canvasDrawEverything';

interface CanvasContextType {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
    initCanvas: () => void;
    setCenter: () => void;
    drawEverything: () => void;
}

const initialState: CanvasContextType = {
    canvasRef: createRef(),
    contextRef: createRef(),
    initCanvas: () => undefined,
    setCenter: () => undefined,
    drawEverything: () => undefined,
};

const CanvasContext = createContext<CanvasContextType>(initialState);

export const CanvasContextProvider = (props: { children: any }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const zoom = useZoom((state) => state.zoom);
    const setZoom = useZoom((state) => state.setZoom);

    const activeObjectId = useActiveObjectId((state) => state.activeObjectId);
    const canvasObjects = useCanvasObjects((state) => state.canvasObjects);

    const actionMode = useActionMode((state) => state.actionMode);

    const canvasWorkingSize = useCanvasWorkingSize((state) => state.canvasWorkingSize);

    const windowSize = useWindowSize((state) => state.windowSize);
    const scrollPosition = useScrollPosition((state) => state.scrollPosition);
    const setScrollPosition = useScrollPosition((state) => state.setScrollPosition);

    const canvasBackgroundColor = useCanvasBackgroundColor((state) => state.canvasBackgroundColor);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (!context) return;
        contextRef.current = context;
        canvasInit({ canvas, context, canvasWidth: canvasWorkingSize.width, canvasHeight: canvasWorkingSize.height });
    }, [canvasWorkingSize.height, canvasWorkingSize.width]);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    const setCenter = useCallback(() => {
        canvasSetCenter({
            canvas: canvasRef.current,
            context: contextRef.current,
            canvasWorkingSize,
            setZoom,
            setScrollPosition,
        });
    }, [canvasWorkingSize, setZoom, setScrollPosition]);

    useEffect(() => {
        setCenter();
    }, [setCenter]);

    const drawEverything = useCallback(() => {
        canvasDrawEverything({
            canvas: canvasRef.current,
            context: contextRef.current,
            canvasWorkingSize,
            canvasBackgroundColor,
            canvasObjects,
            activeObjectId,
            actionMode,
            zoom,
            scrollPosition,
            windowSize,
        });
    }, [canvasWorkingSize, canvasBackgroundColor, canvasObjects, activeObjectId, actionMode, zoom, scrollPosition, windowSize]);

    useEffect(() => {
        drawEverything();
    }, [drawEverything]);

    const value = useMemo(
        () => ({
            canvasRef,
            contextRef,
            initCanvas,
            setCenter,
            drawEverything,
        }),
        [initCanvas, setCenter, drawEverything],
    );

    return <CanvasContext.Provider value={value}>{props.children}</CanvasContext.Provider>;
};

export const useCanvasContext = () => useContext(CanvasContext);
