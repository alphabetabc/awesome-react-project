'use client';

import { useEffect } from 'react';
import Overlay from '@/components/Overlay';
import Canvas from '@/components/Canvas';
import CanvasEventListeners from '@/components/CanvasEventListeners';

// src\layouts\AppLayout.tsx
export default function Home() {
    useEffect(() => {
        const html = document.querySelector('html');

        if (html) {
            html.style.overflow = 'hidden';
        }

        return () => {
            if (html) {
                html.style.overflow = 'auto';
            }
        };
    }, []);

    return (
        <>
            <Overlay />
            <Canvas />
            <CanvasEventListeners />
        </>
    );
}
