import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Phaser uses browser APIs — exclude it from SSR bundling
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Tell webpack to treat these browser-only modules as externals on the server
      config.externals = [...(config.externals || []), 'phaser'];
    }
    return config;
  },
};

export default nextConfig;
