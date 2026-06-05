/**
 * game/entities/Enemy.ts
 *
 * Goomba-style enemy that:
 * - Patrols back and forth within a set distance
 * - Can be stomped from above (killed)
 * - Kills the player on side collision
 * - Has a brief death animation before being destroyed
 */
import Phaser from 'phaser';
import { EnemyConfig } from '@/types/game';
import { SoundSystem } from '../utils/soundSystem';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private config: EnemyConfig;
  private startX: number;
  private facingRight = false;
  private alive = true;

  constructor(scene: Phaser.Scene, config: EnemyConfig) {
    super(scene, config.x, config.y, 'goomba', 0);

    this.config = config;
    this.startX = config.x;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 28);
    body.setOffset(4, 4);
    body.setCollideWorldBounds(true);

    // Start moving left
    body.setVelocityX(-config.speed);
    this.setFlipX(false);

    this.play('goomba_walk');
  }

  update(): void {
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const dx   = this.x - this.startX;

    // Turn around at patrol boundaries
    if (dx > this.config.patrolDistance) {
      body.setVelocityX(-this.config.speed);
      this.facingRight = false;
      this.setFlipX(false);
    } else if (dx < -this.config.patrolDistance) {
      body.setVelocityX(this.config.speed);
      this.facingRight = true;
      this.setFlipX(true);
    }

    // Also turn around if hitting a wall
    if (body.blocked.right) {
      body.setVelocityX(-this.config.speed);
      this.facingRight = false;
    } else if (body.blocked.left) {
      body.setVelocityX(this.config.speed);
      this.facingRight = true;
    }
  }

  /**
   * Called when the player lands on top of this enemy.
   * Returns the score value earned.
   */
  stomp(): number {
    if (!this.alive) return 0;

    this.alive = false;
    SoundSystem.play('stomp');

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);

    this.play('goomba_dead');

    // Squish scale
    this.setScale(1.5, 0.6);
    this.setY(this.y + 8);

    // Disappear after short delay
    this.scene.time.delayedCall(400, () => {
      this.destroy();
    });

    return 200;
  }

  get isAlive(): boolean { return this.alive; }
}
