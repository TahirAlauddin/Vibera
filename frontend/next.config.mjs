/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    turbo: false, // hard-disable Turbopack
  },
};

export default nextConfig;
