/**
 * components/ui/FullscreenButton.tsx
 *
 * Button that toggles the game canvas container fullscreen using the
 * Fullscreen API. Falls back gracefully if not supported.
 */
'use client';

import { useState } from 'react';

interface Props {
  containerId: string;
}

export function FullscreenButton({ containerId }: Props): JSX.Element {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggle = (): void => {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className="
        w-8 h-8 flex items-center justify-center
        bg-black/60 border border-white/30 rounded
        text-white text-sm hover:bg-black/80
        transition-colors select-none
      "
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? '⊡' : '⛶'}
    </button>
  );
}
