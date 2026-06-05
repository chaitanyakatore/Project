/**
 * types/game.ts
 *
 * All shared TypeScript interfaces and enums for the Mario platformer.
 * Keeping types in one place makes refactoring much easier.
 */

// ─── Scene Keys ────────────────────────────────────────────────────────────────
// Using an enum prevents typo bugs when switching scenes
export enum SceneKey {
  Boot = 'BootScene',
  Preload = 'PreloadScene',
  MainMenu = 'MainMenuScene',
  Game = 'GameScene',
  HUD = 'HUDScene',
  Pause = 'PauseScene',
  GameOver = 'GameOverScene',
  Win = 'WinScene',
}

// ─── Game State (shared via Phaser registry) ───────────────────────────────────
export interface GameState {
  score: number;
  lives: number;
  coins: number;
  level: number;
  highScore: number;
}

// ─── Player Config ─────────────────────────────────────────────────────────────
export interface PlayerConfig {
  x: number;
  y: number;
  speed: number;      // pixels / second
  jumpVelocity: number;
  gravity: number;
}

// ─── Enemy Config ──────────────────────────────────────────────────────────────
export type EnemyType = 'goomba' | 'koopa';

export interface EnemyConfig {
  x: number;
  y: number;
  type: EnemyType;
  speed: number;
  patrolDistance: number; // how far it walks before turning
}

// ─── Level Data ────────────────────────────────────────────────────────────────
export interface PlatformData {
  x: number;
  y: number;
  width: number;      // number of tiles wide
  tileType?: 'grass' | 'dirt' | 'brick' | 'question';
}

export interface CoinData {
  x: number;
  y: number;
}

export interface LevelData {
  key: string;
  width: number;        // total level width in pixels
  height: number;
  playerStart: { x: number; y: number };
  platforms: PlatformData[];
  enemies: EnemyConfig[];
  coins: CoinData[];
  goalX: number;        // x position of the goal flag
}

// ─── Animation Frames ──────────────────────────────────────────────────────────
export interface AnimationConfig {
  key: string;
  frames: number[];
  frameRate: number;
  repeat: number; // -1 = loop forever
}

// ─── Sound Keys ────────────────────────────────────────────────────────────────
export enum SoundKey {
  Jump = 'sfx_jump',
  Coin = 'sfx_coin',
  Stomp = 'sfx_stomp',
  Death = 'sfx_death',
  LevelComplete = 'sfx_level_complete',
  BGM = 'bgm_main',
}

// ─── Event Names (typed custom events) ────────────────────────────────────────
export enum GameEvent {
  ScoreUpdated = 'score-updated',
  LivesUpdated = 'lives-updated',
  CoinsUpdated = 'coins-updated',
  PlayerDied = 'player-died',
  LevelComplete = 'level-complete',
  PauseToggled = 'pause-toggled',
  GameOverTriggered = 'game-over',
}
