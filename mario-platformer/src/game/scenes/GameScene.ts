/**
 * game/scenes/GameScene.ts
 *
 * The main gameplay scene. Orchestrates:
 * - Level construction (LevelBuilder)
 * - Player creation + input
 * - Camera (CameraSystem)
 * - Collisions (CollisionSystem)
 * - Score (ScoreSystem)
 * - Pause handling
 * - Death / respawn flow
 * - Level complete transition
 */
import Phaser from "phaser";
import { SceneKey, GameEvent } from "@/types/game";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/gameConfig";
import { LEVELS } from "../config/levels";
import { Player } from "../entities/Player";
import { LevelBuilder, LevelObjects } from "../systems/LevelBuilder";
import { ScoreSystem } from "../systems/ScoreSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { registerAnimations } from "../utils/animationRegistry";
import { SoundSystem } from "../utils/soundSystem";

export class GameScene extends Phaser.Scene {
  // ── Entities & systems ────────────────────────────────────────────────────
  private player!: Player;
  private levelObjects!: LevelObjects;
  private scoreSystem!: ScoreSystem;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;

  // ── Input ─────────────────────────────────────────────────────────────────
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: Record<string, Phaser.Input.Keyboard.Key>;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;

  // ── State ─────────────────────────────────────────────────────────────────
  private isPaused = false;
  private levelIndex = 0;
  private deathCount = 0;
  private levelComplete = false;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    this.levelIndex = ((this.registry.get("level") as number) ?? 1) - 1;
    this.isPaused = false;
    this.levelComplete = false;

    const levelData = LEVELS[this.levelIndex] ?? LEVELS[0];

    // ── Register animations ────────────────────────────────────────────────
    registerAnimations(this);

    // ── Set physics world bounds ───────────────────────────────────────────
    this.physics.world.setBounds(0, 0, levelData.width, levelData.height + 100);

    // ── Build level ────────────────────────────────────────────────────────
    const builder = new LevelBuilder(this);
    this.levelObjects = builder.build(levelData);

    // ── Create player ──────────────────────────────────────────────────────
    this.player = new Player(
      this,
      levelData.playerStart.x,
      levelData.playerStart.y,
    );
    this.player.setSpawn(levelData.playerStart.x, levelData.playerStart.y);
    this.player.setDepth(10);

    // ── Systems ────────────────────────────────────────────────────────────
    this.scoreSystem = new ScoreSystem(this);
    this.cameraSystem = new CameraSystem(
      this,
      levelData.width,
      levelData.height,
    );
    this.cameraSystem.followPlayer(this.player);

    this.collisionSystem = new CollisionSystem(
      this,
      this.scoreSystem,
      this.cameraSystem,
    );
    this.collisionSystem.register(
      this.player,
      this.levelObjects.platforms,
      this.levelObjects.coins,
      this.levelObjects.enemies,
      this.levelObjects.enemyList,
      this.levelObjects.coinList,
      this.levelObjects.deathZone,
      this.levelObjects.goal,
      () => this.handleLevelComplete(),
    );

    // ── Input ──────────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z,
    );
    this.pauseKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.P,
    );
    this.wasdKeys = this.input.keyboard!.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    // Also allow SPACE for jump
    const spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    spaceKey.on("down", () => {
      this.jumpKey.isDown = true;
    });

    // ── Event listeners ────────────────────────────────────────────────────
    this.events.on(GameEvent.PlayerDied, this.handlePlayerDied, this);

    // ESC also toggles pause
    this.input.keyboard!.on("keydown-ESC", () => this.togglePause());
    this.input.keyboard!.on("keydown-P", () => this.togglePause());

    // Start the HUD scene running alongside (parallel scene)
    if (!this.scene.isActive(SceneKey.HUD)) {
      this.scene.launch(SceneKey.HUD);
    }

    // Broadcast initial values to HUD
    this.events.emit(GameEvent.ScoreUpdated, this.scoreSystem.score);
    this.events.emit(GameEvent.LivesUpdated, this.scoreSystem.lives);
    this.events.emit(GameEvent.CoinsUpdated, this.scoreSystem.coins);
  }

  update(): void {
    if (this.isPaused || this.levelComplete) return;

    // ── Player input ───────────────────────────────────────────────────────
    this.player.handleInput(this.cursors, this.wasdKeys, this.jumpKey);

    // ── Enemy AI ───────────────────────────────────────────────────────────
    this.levelObjects.enemyList.forEach((e) => {
      if (e.active) e.update();
    });

    // ── Goal proximity check (emitted to collision system) ────────────────
    this.events.emit("player-check-goal");
  }

  // ── Pause ──────────────────────────────────────────────────────────────────
  togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.physics.pause();
      this.scene.launch(SceneKey.Pause);
      this.scene.bringToTop(SceneKey.Pause);
    } else {
      this.physics.resume();
      this.scene.stop(SceneKey.Pause);
    }
  }

  resume(): void {
    this.isPaused = false;
    this.physics.resume();
  }

  // ── Player death handling ──────────────────────────────────────────────────
  private handlePlayerDied(): void {
    this.deathCount++;
    this.cameraSystem.shake(0.02, 400);

    const stillAlive = this.scoreSystem.loseLife();

    if (!stillAlive) {
      // Game over — wait for death animation then transition
      this.time.delayedCall(1500, () => {
        this.scene.stop(SceneKey.HUD);
        this.scene.start(SceneKey.GameOver);
      });
    }
    // If alive, Player.respawn() handles the actual repositioning
  }

  // ── Level complete ─────────────────────────────────────────────────────────
  private handleLevelComplete(): void {
    if (this.levelComplete) return;
    this.levelComplete = true;

    this.scoreSystem.addLevelCompleteScore();
    this.scoreSystem.saveHighScore();
    SoundSystem.play("levelComplete");

    this.cameraSystem.flash(0xffffff, 500);

    // Big score text
    const cam = this.cameraSystem.cam;
    const textX = cam.scrollX + GAME_WIDTH / 2;
    const textY = cam.scrollY + GAME_HEIGHT / 2;

    this.add
      .text(textX, textY, "LEVEL CLEAR!", {
        fontFamily: '"Press Start 2P"',
        fontSize: "28px",
        color: "#FBD000",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Transition to win scene
    this.time.delayedCall(2500, () => {
      this.scene.stop(SceneKey.HUD);
      this.scene.start(SceneKey.Win);
    });
  }

  // ── Clean up on scene stop ─────────────────────────────────────────────────
  shutdown(): void {
    this.events.off(GameEvent.PlayerDied, this.handlePlayerDied, this);
  }
}
