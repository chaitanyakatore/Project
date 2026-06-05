/**
 * game/systems/ScoreSystem.ts
 *
 * Manages all scoring logic:
 * - Score accumulation
 * - Coin counting
 * - Lives management
 * - High score tracking (localStorage)
 * - Event emission for HUD updates
 */
import Phaser from 'phaser';
import { GameEvent } from '@/types/game';
import {
  SCORE_COIN, SCORE_STOMP, SCORE_LEVEL,
  PLAYER_LIVES_START,
} from '../config/gameConfig';

export class ScoreSystem {
  private scene: Phaser.Scene;
  private _score = 0;
  private _coins = 0;
  private _lives: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Read existing lives from registry (persists across scenes)
    this._lives = scene.registry.get('lives') as number ?? PLAYER_LIVES_START;
    this._score = scene.registry.get('score') as number ?? 0;
    this._coins = scene.registry.get('coins') as number ?? 0;
  }

  // ── Public actions ─────────────────────────────────────────────────────────

  addCoin(): void {
    this._coins++;
    this._score += SCORE_COIN;
    this.syncRegistry();
    this.scene.events.emit(GameEvent.CoinsUpdated, this._coins);
    this.scene.events.emit(GameEvent.ScoreUpdated, this._score);

    // Every 100 coins = extra life (classic Mario rule)
    if (this._coins % 100 === 0) {
      this._lives++;
      this.scene.events.emit(GameEvent.LivesUpdated, this._lives);
    }
  }

  addStompScore(): void {
    this._score += SCORE_STOMP;
    this.syncRegistry();
    this.scene.events.emit(GameEvent.ScoreUpdated, this._score);
  }

  addLevelCompleteScore(): void {
    this._score += SCORE_LEVEL;
    this.syncRegistry();
    this.scene.events.emit(GameEvent.ScoreUpdated, this._score);
  }

  loseLife(): boolean {
    this._lives--;
    this.syncRegistry();
    this.scene.events.emit(GameEvent.LivesUpdated, this._lives);

    if (this._lives <= 0) {
      this.saveHighScore();
      return false; // game over
    }
    return true; // still alive
  }

  reset(): void {
    this._score = 0;
    this._coins = 0;
    this._lives = PLAYER_LIVES_START;
    this.syncRegistry();
  }

  // ── Persistence ────────────────────────────────────────────────────────────

  saveHighScore(): void {
    const current = this.getHighScore();
    if (this._score > current) {
      try {
        localStorage.setItem('mario_highscore', String(this._score));
      } catch {
        // localStorage may not be available in all environments
      }
      this.scene.registry.set('highScore', this._score);
    }
  }

  getHighScore(): number {
    try {
      return parseInt(localStorage.getItem('mario_highscore') ?? '0', 10);
    } catch {
      return 0;
    }
  }

  // ── Sync game state to Phaser registry ────────────────────────────────────
  private syncRegistry(): void {
    this.scene.registry.set('score', this._score);
    this.scene.registry.set('coins', this._coins);
    this.scene.registry.set('lives', this._lives);
  }

  // ── Getters ────────────────────────────────────────────────────────────────
  get score(): number { return this._score; }
  get coins(): number { return this._coins; }
  get lives(): number { return this._lives; }
}
