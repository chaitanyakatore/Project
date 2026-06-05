import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Retro pixel-style font stack
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        mario: {
          red: '#E52521',
          blue: '#049CD8',
          yellow: '#FBD000',
          green: '#43B047',
          brown: '#8B4513',
          sky: '#5C94FC',
          ground: '#C84B0C',
        },
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
