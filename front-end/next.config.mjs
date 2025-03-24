/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Bật tính năng logging để debug
    logging: {
      fetches: {
        fullUrl: true
      }
    },
    // Cấu hình rewrites nếu cần proxy API
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ]
    },
    // Cấu hình headers CORS nếu cần
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          ],
        },
      ]
    }
  }
  
  export default nextConfig