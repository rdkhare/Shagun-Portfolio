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
        // Optimized image sizes for hero headshot and other images
        imageSizes: [96, 128, 256, 384, 400, 600],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        // Enable modern formats but with longer cache
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 31536000, // 1 year cache
        dangerouslyAllowSVG: false,
        // Use default loader
        loader: 'default'
    }
};

export default nextConfig;
