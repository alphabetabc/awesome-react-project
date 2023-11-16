import packageJson from '@/../package.json';

const cleanUrl = 'flat-draw-local.com';

const metadata = {
    website: {
        name: 'flat-draw-local',
        slogan: 'Simple Canvas Drawing App',
        description: 'Open-source canvas drawing web application, built with TypeScript, React, and Next.js.',
        cleanUrl,
        email: `hello@${cleanUrl}`,
        url: `https://${cleanUrl}`,
        manifest: `/manifest.json`,
        thumbnail: `https://${cleanUrl}/images/thumbnail.jpg`,
        locale: 'en',
        themeColor: '#FFFFFF',
        version: packageJson.version,
    },
    social: {
        twitter: 'flat-draw-local',
    },
    links: {
        github: 'https://github.com/diogocapela/flat-draw-local',
    },
    services: {
        googleAnalyticsMeasurementId: 'G-EZDBLF0NEZ',
    },
};

export default metadata;
