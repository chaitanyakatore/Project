/**
 * game/utils/animationRegistry.ts
 *
 * Registers all Phaser sprite animations in one place.
 * Call `registerAnimations(scene)` once in the GameScene.
 */
import Phaser from 'phaser';

export function registerAnimations(scene: Phaser.Scene): void {
  const anims = scene.anims;

  // ── Player animations ───────────────────────────────────────────────────────
  // Frames 0-7 of the 'player' spritesheet (each 32×32)

  if (!anims.exists('player_idle')) {
    anims.create({
      key: 'player_idle',
      frames: anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!anims.exists('player_run')) {
    anims.create({
      key: 'player_run',
      frames: anims.generateFrameNumbers('player', { frames: [1, 2, 3] }),
      frameRate: 12,
      repeat: -1,
    });
  }

  if (!anims.exists('player_jump')) {
    anims.create({
      key: 'player_jump',
      frames: anims.generateFrameNumbers('player', { frames: [4] }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!anims.exists('player_skid')) {
    anims.create({
      key: 'player_skid',
      frames: anims.generateFrameNumbers('player', { frames: [5] }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!anims.exists('player_dead')) {
    anims.create({
      key: 'player_dead',
      frames: anims.generateFrameNumbers('player', { frames: [6] }),
      frameRate: 1,
      repeat: -1,
    });
  }

  // ── Goomba animations ────────────────────────────────────────────────────────

  if (!anims.exists('goomba_walk')) {
    anims.create({
      key: 'goomba_walk',
      frames: anims.generateFrameNumbers('goomba', { frames: [0, 1] }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.exists('goomba_dead')) {
    anims.create({
      key: 'goomba_dead',
      frames: anims.generateFrameNumbers('goomba', { frames: [2] }),
      frameRate: 1,
      repeat: -1,
    });
  }

  // ── Coin spin animation ───────────────────────────────────────────────────────

  if (!anims.exists('coin_spin')) {
    anims.create({
      key: 'coin_spin',
      frames: anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  }
}
