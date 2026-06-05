/**
 * components/game/GameContainer.tsx
 *
 * The React ↔ Phaser bridge component.
 *
 * - Renders a `<div>` that Phaser will inject its canvas into
 * - Uses `useGame` hook to manage the Phaser lifecycle
 * - Overlays the SoundToggle + FullScreen buttons using Tailwind
 *
 * This component is loaded with `dynamic({ ssr: false })` in page.tsx,
 * so we never have to worry about window/document being undefined here.
 */
'use client';

import { useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { FullscreenButton } from '@/components/ui/FullscreenButton';
import { GAME_WIDTH, GAME_HEIGHT } from '@/game/config/gameConfig';

export default function GameContainer(): JSX.Element {
  // This div is passed to Phaser as the `parent` in its config
  const containerRef = useRef<HTMLDivElement>(null);

  // Starts Phaser when mounted, destroys when unmounted
  useGame(containerRef);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/*
        The Phaser canvas is injected INSIDE this div.
        Phaser's Scale.FIT mode handles responsive sizing automatically.
      */}
      <div
        ref={containerRef}
        id="phaser-container"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
        className="relative"
      />

      {/* UI overlays — these sit above the canvas in React's DOM */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <SoundToggle />
        <FullscreenButton containerId="phaser-container" />
      </div>

      {/* Mobile controls overlay */}
      <MobileControls />
    </div>
  );
}

/**
 * Touch controls for mobile players.
 * Dispatches synthetic keyboard events that the game's input system picks up.
 */
function MobileControls(): JSX.Element {
  const dispatch = (key: string, type: 'keydown' | 'keyup'): void => {
    const event = new KeyboardEvent(type, { key, code: key, bubbles: true });
    window.dispatchEvent(event);
    // Also fire on document for Phaser's keyboard manager
    document.dispatchEvent(event);
  };

  const btnClass =
    'bg-white/20 border-2 border-white/40 text-white font-pixel text-xs ' +
    'rounded-lg px-4 py-3 select-none active:bg-white/40 active:scale-95 ' +
    'transition-transform touch-none';

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-10 md:hidden">
      {/* D-pad: left + right */}
      <div className="flex gap-2">
        <button
          className={btnClass}
          onTouchStart={() => dispatch('ArrowLeft', 'keydown')}
          onTouchEnd={() => dispatch('ArrowLeft', 'keyup')}
          onMouseDown={() => dispatch('ArrowLeft', 'keydown')}
          onMouseUp={() => dispatch('ArrowLeft', 'keyup')}
        >
          ◀
        </button>
        <button
          className={btnClass}
          onTouchStart={() => dispatch('ArrowRight', 'keydown')}
          onTouchEnd={() => dispatch('ArrowRight', 'keyup')}
          onMouseDown={() => dispatch('ArrowRight', 'keydown')}
          onMouseUp={() => dispatch('ArrowRight', 'keyup')}
        >
          ▶
        </button>
      </div>

      {/* Jump button */}
      <button
        className={`${btnClass} bg-mario-red/60 border-mario-red text-lg`}
        onTouchStart={() => dispatch('z', 'keydown')}
        onTouchEnd={() => dispatch('z', 'keyup')}
        onMouseDown={() => dispatch('z', 'keydown')}
        onMouseUp={() => dispatch('z', 'keyup')}
      >
        JUMP
      </button>
    </div>
  );
}
