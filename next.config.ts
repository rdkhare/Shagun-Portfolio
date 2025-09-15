/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allow all HTTPS domains
            },
            {
                protocol: 'http',
                hostname: '**', // Allow all HTTP domains (for development)
            }
        ],
        // Add multiple image sizes for better responsive images
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    }
};

export default nextConfig;
