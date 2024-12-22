/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_API: process.env.SERVER_API,
        APP_URL : process.env.APP_URL,
    }
    
};

export default nextConfig;
