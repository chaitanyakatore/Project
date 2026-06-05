/**
 * components/ui/SoundToggle.tsx
 *
 * Button that mutes/unmutes the Web Audio procedural sound system.
 */
'use client';

import { useState } from 'react';
import { SoundSystem } from '@/game/utils/soundSystem';

export function SoundToggle(): JSX.Element {
  const [muted, setMuted] = useState(false);

  const toggle = (): void => {
    const next = !muted;
    setMuted(next);
    SoundSystem.setEnabled(!next);
  };

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute' : 'Mute'}
      className="
        w-8 h-8 flex items-center justify-center
        bg-black/60 border border-white/30 rounded
        text-white text-sm hover:bg-black/80
        transition-colors select-none
      "
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
