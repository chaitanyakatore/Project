/**
 * game/scenes/HUDScene.ts
 *
 * Runs in parallel with GameScene (launched, not started).
 * Listens to GameScene events to update score/lives/coins display.
 * Uses a fixed camera so HUD elements never scroll.
 */
import Phaser from "phaser";
import { SceneKey, GameEvent } from "@/types/game";
import { GAME_WIDTH } from "../config/gameConfig";

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKey.HUD });
  }

  create(): void {
    // HUD is always on top
    this.cameras.main.setBackgroundColor(0x000000);

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: "10px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    };

    // ── Score ─────────────────────────────────────────────────────────────
    this.add.text(10, 10, "SCORE", textStyle);
    this.scoreText = this.add.text(10, 24, "000000", textStyle);

    // ── Coins ─────────────────────────────────────────────────────────────
    this.add.sprite(GAME_WIDTH / 2 - 40, 18, "coin", 0).setScale(0.8);
    this.add.text(GAME_WIDTH / 2 - 24, 14, "×", textStyle);
    this.coinsText = this.add.text(GAME_WIDTH / 2 - 16, 14, "00", textStyle);

    // ── Lives ─────────────────────────────────────────────────────────────
    this.add.sprite(GAME_WIDTH - 90, 18, "player", 0).setScale(0.8);
    this.add.text(GAME_WIDTH - 76, 14, "×", textStyle);
    this.livesText = this.add.text(GAME_WIDTH - 68, 14, "03", textStyle);

    // ── Level ─────────────────────────────────────────────────────────────
    const level = (this.registry.get("level") as number) ?? 1;
    this.levelText = this.add
      .text(GAME_WIDTH / 2, 10, `WORLD ${level}-1`, {
        ...textStyle,
        fontSize: "8px",
      })
      .setOrigin(0.5, 0);

    // ── Listen for game events ────────────────────────────────────────────
    const gameScene = this.scene.get(SceneKey.Game);

    gameScene.events.on(GameEvent.ScoreUpdated, (score: number) => {
      this.scoreText.setText(String(score).padStart(6, "0"));
    });

    gameScene.events.on(GameEvent.CoinsUpdated, (coins: number) => {
      this.coinsText.setText(String(coins).padStart(2, "0"));
    });

    gameScene.events.on(GameEvent.LivesUpdated, (lives: number) => {
      this.livesText.setText(String(Math.max(0, lives)).padStart(2, "0"));

      // Flash lives when low
      if (lives <= 1) {
        this.tweens.add({
          targets: this.livesText,
          alpha: 0,
          duration: 200,
          yoyo: true,
          repeat: 3,
        });
      }
    });

    // Seed from registry
    const score = (this.registry.get("score") as number) ?? 0;
    const coins = (this.registry.get("coins") as number) ?? 0;
    const lives = (this.registry.get("lives") as number) ?? 3;
    this.scoreText.setText(String(score).padStart(6, "0"));
    this.coinsText.setText(String(coins).padStart(2, "0"));
    this.livesText.setText(String(lives).padStart(2, "0"));
  }
}
