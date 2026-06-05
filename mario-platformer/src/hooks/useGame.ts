/**
 * hooks/useGame.ts
 *
 * Custom React hook that:
 * 1. Creates a GameManager (Phaser.Game) when the component mounts
 * 2. Destroys it when the component unmounts
 *
 * Using a hook rather than inline useEffect in the component
 * keeps the component clean and makes the game logic testable.
 */
'use client';

import { useEffect, useRef } from 'react';
import type { GameManager } from '@/game/GameManager';

export function useGame(containerRef: React.RefObject<HTMLDivElement | null>): void {
  // Store the GameManager in a ref (not state) to avoid re-renders
  const managerRef = useRef<GameManager | null>(null);

  useEffect(() => {
    // Safety check — only run in the browser
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    // Don't double-init if the effect runs twice in React strict mode
    if (managerRef.current) return;

    // Dynamic import ensures Phaser is NEVER bundled for SSR
    import('@/game/GameManager').then(({ GameManager }) => {
      if (!containerRef.current) return;
      managerRef.current = new GameManager(containerRef.current);
    });

    // Cleanup — called when the component unmounts
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [containerRef]);
}
