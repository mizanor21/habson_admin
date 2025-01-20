/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**", // Allow all paths on this domain
      },
    ],
  },
};

export default nextConfig;
