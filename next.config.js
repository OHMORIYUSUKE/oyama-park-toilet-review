/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc/**",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
        pathname: "/download/**",
      },
    ],
  },
};

module.exports = nextConfig;
