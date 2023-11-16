'use client';

import { useEffect, useState, useRef } from 'react';
import { Global } from '@emotion/react';
import { MantineProvider, ColorSchemeProvider, type ColorScheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { usePathname, useSearchParams } from 'next/navigation';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';

import metadataCfg from '@/config/metadata';
import { DEFAULT_COLOR_SCHEME } from '@/config/settings';

import '@/theme/styles/global.css';
import globalStyles from '@/theme/styles/global';
import colors from '@/theme/colors';
import { theme } from '@/theme';

import { useCookies } from '@/hooks/useCookies';
import { CanvasContextProvider } from '@/context/useCanvasContext';
import { ColorSchemeContextProvider } from '@/context/useColorSchemeContext';
import { getAvailableFonts } from '@/utils/getAvailableFonts';
import { ModalContextProvider } from '@/context/useModalContext';
import { useAvailableFonts } from '@/store/useAvailableFonts';

import LoadingOverlay from '@/components/LoadingOverlay';

let nprogressPending = false;

function RouterTransition() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const preUrl = useRef('');

    useEffect(() => {
        const asPath = `${pathname}?${searchParams}`;
        const handleStart = () => {
            if (nprogressPending) return;
            nprogressPending = true;
            nprogress.start();
        };

        let timer: any = null;

        const reset = () => {
            clearTimeout(timer);
        };

        const handleComplete = () => {
            timer = setTimeout(() => {
                nprogress.complete();
                nprogressPending = false;
            }, 100);
        };

        if (preUrl.current === asPath) {
            // handleStart();
            handleComplete();
            return reset;
        }

        preUrl.current = asPath;
        // router.events.on('routeChangeStart', handleStart);
        // router.events.on('routeChangeComplete', handleComplete);
        // router.events.on('routeChangeError', handleComplete);
        handleStart();
        handleComplete();

        return () => {
            reset();
            // router.events.off('routeChangeStart', handleStart);
            // router.events.off('routeChangeComplete', handleComplete);
            // router.events.off('routeChangeError', handleComplete);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    return <NavigationProgress autoReset={true} progressLabel="Loading page" />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(DEFAULT_COLOR_SCHEME);
    const setAvailableFonts = useAvailableFonts((state) => state.setAvailableFonts);

    const { setSavedColoScheme, getSavedColoScheme, getDeviceHash, setDeviceHash } = useCookies();
    // TODO
    const [hasAppLoaded, setHasAppLoaded] = useState<boolean>(false);

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
        setColorScheme(nextColorScheme);
        setSavedColoScheme(nextColorScheme);
        const html = document.querySelector('html');
        const body = document.querySelector('body');
        if (html && body) {
            html.style.background = colors.htmlBackground[nextColorScheme];
            body.style.background = colors.htmlBackground[nextColorScheme];
        }
    };

    // On app load

    useEffect(() => {
        // Initialize color scheme
        const savedColorScheme = getSavedColoScheme();
        if (savedColorScheme) {
            toggleColorScheme(savedColorScheme);
        }
        // Initialize device hash
        const deviceHash = getDeviceHash();
        if (!deviceHash) {
            setDeviceHash();
        }

        // Initialize store
        (async () => {
            const result = await getAvailableFonts();
            // TODO
            setAvailableFonts(result);
        })();
        // Set app ready
        setHasAppLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <html lang={metadataCfg.website.locale}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height"
                />
                <meta name="format-detection" content="telephone=no" />
                {/* Manifest */}
                <link rel="manifest" href={metadataCfg.website.manifest} />
                {/* Icon */}
                <link rel="shortcut icon" href={`${metadataCfg.website.url}/images/favicon/favicon.ico`} />
                <link rel="icon" type="image/x-icon" href={`${metadataCfg.website.url}/images/favicon/favicon.ico`} />
                <link rel="apple-touch-icon" sizes="180x180" href={`${metadataCfg.website.url}/images/favicon/apple-touch-icon.png`} />
                <link rel="icon" type="image/png" sizes="32x32" href={`${metadataCfg.website.url}/images/favicon/favicon-32x32.png`} />
                <link rel="icon" type="image/png" sizes="16x16" href={`${metadataCfg.website.url}/images/favicon/favicon-16x16.png`} />

                {/* Browser Theme */}
                <meta name="theme-color" content={metadataCfg.website.themeColor} />
                <meta name="msapplication-TileColor" content={metadataCfg.website.themeColor} />

                {/* Search Engines */}
                <meta name="robots" content="index, follow" />

                {/* Name */}
                <meta name="application-name" content={metadataCfg.website.name} />
                <meta name="copyright" content={metadataCfg.website.name} />
                <meta name="author" content={metadataCfg.website.name} />
                <meta name="owner" content={metadataCfg.website.name} />
                <meta name="designer" content={metadataCfg.website.name} />
                <meta property="og:site_name" content={metadataCfg.website.name} />

                {/*TODO: Page URL */}
                {/* <meta name="url" content={pageUrl} />
                <meta property="og:url" content={pageUrl} />
                <link rel="canonical" href={pageUrl} /> */}

                {/* Social */}
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={`@${metadataCfg.social.twitter}`} />
                <meta name="twitter:creator" content={`@${metadataCfg.social.twitter}`} />
            </head>

            <body>
                <Global styles={globalStyles} />
                <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                    <ColorSchemeContextProvider>
                        <CanvasContextProvider>
                            <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
                                <ModalsProvider>
                                    <ModalContextProvider>
                                        {!hasAppLoaded && <LoadingOverlay />}
                                        <RouterTransition />
                                        <Notifications position="top-right" zIndex={theme.layers.notifications} />
                                        {children}
                                    </ModalContextProvider>
                                </ModalsProvider>
                            </MantineProvider>
                        </CanvasContextProvider>
                    </ColorSchemeContextProvider>
                </ColorSchemeProvider>
            </body>
        </html>
    );
}
