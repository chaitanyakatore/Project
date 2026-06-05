import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mario Platformer',
  description: 'A Mario-like platformer built with Next.js 15 + Phaser 3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Press Start 2P — the classic pixel game font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black overflow-hidden">{children}</body>
    </html>
  );
}
