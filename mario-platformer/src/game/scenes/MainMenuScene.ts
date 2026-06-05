/**
 * game/scenes/MainMenuScene.ts
 *
 * Animated main menu with:
 * - Scrolling parallax background
 * - Bouncing title
 * - Play / Controls buttons
 * - High score display
 */
import Phaser from "phaser";
import { SceneKey } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/gameConfig";
import { SoundSystem } from "../utils/soundSystem";

export class MainMenuScene extends Phaser.Scene {
  private bgLayers: Phaser.GameObjects.TileSprite[] = [];
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKey.MainMenu });
  }

  create(): void {
    // ── Background ──────────────────────────────────────────────────────────
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x5c94fc).setOrigin(0);

    // Parallax layers as tile sprites (they scroll via update)
    const layerData = [
      { key: "bg_mountains", y: GAME_HEIGHT - 300, scrollFactor: 0.2 },
      { key: "bg_clouds", y: 0, scrollFactor: 0.3 },
      { key: "bg_hills", y: GAME_HEIGHT - 200, scrollFactor: 0.4 },
    ];

    layerData.forEach(({ key, y }) => {
      const sprite = this.add
        .tileSprite(0, y, GAME_WIDTH, 300, key)
        .setOrigin(0);
      this.bgLayers.push(sprite);
    });

    // Ground
    this.add
      .rectangle(0, GAME_HEIGHT - 32, GAME_WIDTH, 32, 0x43b047)
      .setOrigin(0);
    this.add
      .rectangle(0, GAME_HEIGHT - 18, GAME_WIDTH, 18, 0xc84b0c)
      .setOrigin(0);

    // ── Title ───────────────────────────────────────────────────────────────
    this.titleText = this.add
      .text(GAME_WIDTH / 2, 80, "SUPER\nPLATFORMER", {
        fontFamily: '"Press Start 2P"',
        fontSize: "32px",
        color: "#FBD000",
        stroke: "#000",
        strokeThickness: 6,
        align: "center",
        lineSpacing: 16,
      })
      .setOrigin(0.5);

    // Bouncing animation for the title
    this.tweens.add({
      targets: this.titleText,
      y: 90,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    // ── High Score ──────────────────────────────────────────────────────────
    const highScore = this.registry.get("highScore") as number;
    this.add
      .text(GAME_WIDTH / 2, 185, `HI-SCORE: ${highScore}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "10px",
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // ── Buttons ─────────────────────────────────────────────────────────────
    this.createButton(GAME_WIDTH / 2, 260, "PLAY GAME", () => {
      SoundSystem.init();
      SoundSystem.resume();
      this.scene.start(SceneKey.Game);
      this.scene.start(SceneKey.HUD);
    });

    this.createButton(GAME_WIDTH / 2, 320, "CONTROLS", () => {
      this.showControls();
    });

    // ── Decorative player sprite ──────────────────────────────────────────
    const deco = this.add.sprite(80, GAME_HEIGHT - 50, "player", 0);
    deco.setScale(2);
    this.tweens.add({
      targets: deco,
      x: GAME_WIDTH - 80,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: "Linear",
      onUpdate: (tween) => {
        deco.setFlipX((tween.getValue() ?? 0) < 0.5 ? false : true);
      },
    });

    // ── Footer ───────────────────────────────────────────────────────────
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 14, "← → MOVE   Z JUMP   P PAUSE", {
        fontFamily: '"Press Start 2P"',
        fontSize: "6px",
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  update(): void {
    // Slow auto-scroll for parallax effect on the menu
    this.bgLayers[0].tilePositionX += 0.2;
    this.bgLayers[1].tilePositionX += 0.5;
    this.bgLayers[2].tilePositionX += 0.8;
  }

  // ── Helper: create a styled interactive text button ──────────────────────
  private createButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Text {
    const btn = this.add
      .text(x, y, `> ${label} <`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "14px",
        color: "#FBD000",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ color: "#ffffff" }));
    btn.on("pointerout", () => btn.setStyle({ color: "#FBD000" }));
    btn.on("pointerdown", onClick);

    return btn;
  }

  // ── Controls overlay ──────────────────────────────────────────────────────
  private showControls(): void {
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      500,
      300,
      0x000000,
      0.85,
    );

    const lines = [
      "CONTROLS",
      "",
      "← / A   Move Left",
      "→ / D   Move Right",
      "Z / SPACE   Jump",
      "P / ESC   Pause",
      "",
      "Stomp enemies to defeat them",
      "Collect coins for points",
      "",
      "[CLICK TO CLOSE]",
    ];

    const text = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, lines, {
        fontFamily: '"Press Start 2P"',
        fontSize: "9px",
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 3,
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    const closeAll = (): void => {
      overlay.destroy();
      text.destroy();
    };

    overlay.setInteractive().on("pointerdown", closeAll);
    text.setInteractive().on("pointerdown", closeAll);
  }
}
