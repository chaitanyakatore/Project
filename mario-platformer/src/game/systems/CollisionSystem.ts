/**
 * game/systems/CollisionSystem.ts
 *
 * Registers all Phaser physics colliders and overlap handlers.
 * Keeping collision logic here avoids polluting GameScene with callbacks.
 */
import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Coin } from "../entities/Coin";
import { ScoreSystem } from "./ScoreSystem";
import { CameraSystem } from "./CameraSystem";
import { SoundSystem } from "../utils/soundSystem";

export class CollisionSystem {
  private scene: Phaser.Scene;
  private scoreSystem: ScoreSystem;
  private cameraSystem: CameraSystem;

  constructor(
    scene: Phaser.Scene,
    scoreSystem: ScoreSystem,
    cameraSystem: CameraSystem,
  ) {
    this.scene = scene;
    this.scoreSystem = scoreSystem;
    this.cameraSystem = cameraSystem;
  }

  register(
    player: Player,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    coins: Phaser.Physics.Arcade.StaticGroup,
    enemies: Phaser.Physics.Arcade.Group,
    enemyList: Enemy[],
    coinList: Coin[],
    deathZone: Phaser.GameObjects.Zone,
    goalSprite: Phaser.GameObjects.Sprite,
    onLevelComplete: () => void,
  ): void {
    // ── Player ↔ Platforms (solid) ────────────────────────────────────────
    this.scene.physics.add.collider(player, platforms);

    // ── Enemies ↔ Platforms (so they don't fall through) ─────────────────
    this.scene.physics.add.collider(enemies, platforms);

    // ── Player ↔ Coins (collect on overlap) ───────────────────────────────
    this.scene.physics.add.overlap(player, coins, (_player, coinObj) => {
      const coin = coinObj as Coin;
      if (!coin.isCollected) {
        coin.collect();
        this.scoreSystem.addCoin();
        SoundSystem.play("coin");
      }
    });

    // ── Player ↔ Enemies ───────────────────────────────────────────────────
    this.scene.physics.add.overlap(player, enemies, (_player, enemyObj) => {
      const p = _player as Player;
      const enemy = enemyObj as Enemy;
      if (!enemy.isAlive || p.dead || p.invincible) return;

      const playerBody = p.body as Phaser.Physics.Arcade.Body;

      // Stomp = player moving downward AND player's bottom above enemy center
      const stomped = playerBody.velocity.y > 0 && p.y < enemy.y - 8;

      if (stomped) {
        enemy.stomp();
        this.scoreSystem.addStompScore();
        p.bounceOnStomp();
        this.cameraSystem.shake(0.008, 150);
      } else {
        // Player takes damage
        p.die();
        this.cameraSystem.shake(0.015, 300);
      }
    });

    // ── Player falls into death zone (pit) ────────────────────────────────
    this.scene.physics.add.overlap(
      player,
      deathZone as unknown as Phaser.Physics.Arcade.StaticGroup,
      () => {
        if (!player.dead) player.die();
      },
    );

    // ── Player reaches goal ───────────────────────────────────────────────
    // We check proximity manually in update since goal is not a physics body
    this.scene.events.on("player-check-goal", () => {
      if (Math.abs(player.x - goalSprite.x) < 48 && !player.dead) {
        onLevelComplete();
      }
    });
  }
}
