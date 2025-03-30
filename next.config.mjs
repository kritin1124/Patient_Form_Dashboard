/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/socket/socket.io/:path*',
        destination: '/api/socket/socket/:path*',
      },
    ];
  },
};

export default nextConfig;