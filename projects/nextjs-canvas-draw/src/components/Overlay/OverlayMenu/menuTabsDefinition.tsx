import type { ReactNode } from 'react';
import { BsImageFill, BsLayersFill } from 'react-icons/bs';
import { FaInfoCircle, FaCloudDownloadAlt, FaCog } from 'react-icons/fa';

export type MenuTabId = 'canvas' | 'layers' | 'download' | 'settings' | 'about';

type TMenuTabsDefinitionType = {
    id: MenuTabId;
    label: string;
    icon: ReactNode;
};

export const menuTabsDefinition: TMenuTabsDefinitionType[] = [
    {
        id: 'canvas',
        label: 'Canvas',
        icon: <BsImageFill />,
    },
    {
        id: 'download',
        label: 'Download',
        icon: <FaCloudDownloadAlt />,
    },
    {
        id: 'layers',
        label: 'Layers',
        icon: <BsLayersFill />,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <FaCog />,
    },
    {
        id: 'about',
        label: 'About',
        icon: <FaInfoCircle />,
    },
];
