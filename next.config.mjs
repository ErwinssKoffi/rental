/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Arena/E2B preview host to access dev-only resources (HMR, etc.)
  allowedDevOrigins: ["*.e2b.app", "e2b.app"],
  images: {
    // Sandboxed preview network cannot reach Unsplash server-side;
    // serve remote images as plain <img> tags so the browser loads them directly.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
