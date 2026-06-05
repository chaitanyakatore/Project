/**
 * game/config/gameConfig.ts
 *
 * Central config for the Phaser game instance and gameplay constants.
 * Change values here to tweak feel without hunting through scene files.
 */
// ─── Canvas dimensions ─────────────────────────────────────────────────────────
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;

// ─── Physics ───────────────────────────────────────────────────────────────────
export const GRAVITY = 800;
export const PLAYER_SPEED = 220; // horizontal pixels/sec
export const PLAYER_JUMP_VELOCITY = -520; // negative = up in Phaser coords
export const MAX_FALL_SPEED = 600;

// ─── Tile size ─────────────────────────────────────────────────────────────────
export const TILE_SIZE = 32;

// ─── Scoring ───────────────────────────────────────────────────────────────────
export const SCORE_COIN = 100;
export const SCORE_STOMP = 200;
export const SCORE_LEVEL = 1000;

// ─── Player ────────────────────────────────────────────────────────────────────
export const PLAYER_LIVES_START = 3;
export const RESPAWN_DELAY_MS = 1500; // time before respawning after death

// ─── Camera ────────────────────────────────────────────────────────────────────
export const CAMERA_LERP_X = 0.1; // lower = smoother/lazier camera
export const CAMERA_LERP_Y = 0.1;

// ─── Parallax ──────────────────────────────────────────────────────────────────
export const PARALLAX_SPEEDS = [0.1, 0.2, 0.35];

// ─── Phaser game config (scenes are registered dynamically) ───────────────────
// We export a factory function so scenes can be imported lazily (avoids SSR issues).
export function buildPhaserConfig(
  parent: HTMLElement,
  scenes: Phaser.Scene[],
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: "#5C94FC",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: GRAVITY },
        debug: process.env.NODE_ENV === "development" && false, // set to true for hitbox viz
      },
    },
    scene: scenes,
    render: {
      pixelArt: true, // keeps pixel art crisp
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    audio: {
      disableWebAudio: false,
    },
  };
}

// ─── Default game state ────────────────────────────────────────────────────────
export const DEFAULT_GAME_STATE = {
  score: 0,
  lives: PLAYER_LIVES_START,
  coins: 0,
  level: 1,
  highScore: 0,
};
