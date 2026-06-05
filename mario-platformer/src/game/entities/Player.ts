/**
 * game/entities/Player.ts
 *
 * The player character. Encapsulates:
 * - Movement (left/right with acceleration)
 * - Jumping with coyote time (small window after walking off an edge)
 * - Death / respawn
 * - Animation state machine
 * - Sound triggering
 */
import Phaser from 'phaser';
import {
  PLAYER_SPEED,
  PLAYER_JUMP_VELOCITY,
  RESPAWN_DELAY_MS,
  MAX_FALL_SPEED,
} from '../config/gameConfig';
import { SoundSystem } from '../utils/soundSystem';
import { GameEvent } from '@/types/game';

export class Player extends Phaser.Physics.Arcade.Sprite {
  // State flags
  private isDead   = false;
  private isInvincible = false; // brief invincibility after respawn

  // Coyote time: allows jumping for a few frames after walking off a ledge
  private coyoteTime = 0;
  private readonly COYOTE_FRAMES = 6;

  // Jump buffer: queue a jump if button is pressed just before landing
  private jumpBuffer = 0;
  private readonly JUMP_BUFFER_FRAMES = 8;

  // Respawn point (set when level starts)
  private spawnX = 0;
  private spawnY = 0;

  // Reference to the scene for events
  private gameScene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);

    this.gameScene = scene;
    this.spawnX = x;
    this.spawnY = y;

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.5);
    this.setCollideWorldBounds(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(20, 28);     // tight hitbox
    body.setOffset(6, 4);
    body.setMaxVelocityY(MAX_FALL_SPEED);

    this.play('player_idle');
  }

  setSpawn(x: number, y: number): void {
    this.spawnX = x;
    this.spawnY = y;
  }

  // ── Called every frame from GameScene.update() ─────────────────────────────
  handleInput(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    wasdKeys: Record<string, Phaser.Input.Keyboard.Key>,
    jumpKey: Phaser.Input.Keyboard.Key
  ): void {
    if (this.isDead) return;

    const body   = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;
    const vx     = body.velocity.x;

    // ── Coyote time tracking ────────────────────────────────────────────────
    if (onGround) {
      this.coyoteTime = this.COYOTE_FRAMES;
    } else if (this.coyoteTime > 0) {
      this.coyoteTime--;
    }

    // ── Jump buffer tracking ────────────────────────────────────────────────
    if (Phaser.Input.Keyboard.JustDown(jumpKey) ||
        Phaser.Input.Keyboard.JustDown(cursors.up!) ||
        Phaser.Input.Keyboard.JustDown(wasdKeys['w'])) {
      this.jumpBuffer = this.JUMP_BUFFER_FRAMES;
    } else if (this.jumpBuffer > 0) {
      this.jumpBuffer--;
    }

    // ── Horizontal movement ─────────────────────────────────────────────────
    const left  = cursors.left?.isDown  || wasdKeys['a']?.isDown;
    const right = cursors.right?.isDown || wasdKeys['d']?.isDown;

    if (left) {
      body.setVelocityX(-PLAYER_SPEED);
      this.setFlipX(true);
    } else if (right) {
      body.setVelocityX(PLAYER_SPEED);
      this.setFlipX(false);
    } else {
      // Friction — slow down when no key pressed
      body.setVelocityX(vx * 0.75);
    }

    // ── Jump ────────────────────────────────────────────────────────────────
    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
      body.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.jumpBuffer  = 0;
      this.coyoteTime  = 0;
      SoundSystem.play('jump');
    }

    // Variable jump height — release early for a shorter jump
    if (!jumpKey.isDown && !cursors.up?.isDown && !wasdKeys['w']?.isDown) {
      if (body.velocity.y < -200) {
        body.setVelocityY(body.velocity.y * 0.85);
      }
    }

    // ── Animation state machine ─────────────────────────────────────────────
    this.updateAnimation(onGround, vx);
  }

  private updateAnimation(onGround: boolean, vx: number): void {
    if (!onGround) {
      this.play('player_jump', true);
    } else if (Math.abs(vx) > 20) {
      // Skid: moving but trying to go the other way
      const left  = (this.gameScene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin)
        .addKey('LEFT').isDown;
      const right = (this.gameScene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin)
        .addKey('RIGHT').isDown;
      const skidding = (vx > 0 && left) || (vx < 0 && right);
      if (skidding) {
        this.play('player_skid', true);
      } else {
        this.play('player_run', true);
      }
    } else {
      this.play('player_idle', true);
    }
  }

  // ── Called when player walks into a death zone (pit, enemy) ──────────────
  die(): void {
    if (this.isDead || this.isInvincible) return;

    this.isDead = true;
    SoundSystem.play('death');

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, PLAYER_JUMP_VELOCITY * 0.6);
    body.setAllowGravity(false); // let us control the arc

    this.play('player_dead');
    this.setTint(0xff4444);

    // Notify the game scene
    this.gameScene.events.emit(GameEvent.PlayerDied);

    // Respawn after delay
    this.gameScene.time.delayedCall(RESPAWN_DELAY_MS, () => {
      this.respawn();
    });
  }

  private respawn(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setVelocity(0, 0);

    this.setPosition(this.spawnX, this.spawnY);
    this.clearTint();
    this.isDead = false;

    // Brief invincibility with flicker
    this.isInvincible = true;
    this.gameScene.time.delayedCall(2000, () => {
      this.isInvincible = false;
      this.setAlpha(1);
    });

    // Flicker effect
    this.gameScene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 9,
    });
  }

  // ── Bounce upward after stomping an enemy ────────────────────────────────
  bounceOnStomp(): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(PLAYER_JUMP_VELOCITY * 0.5);
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get dead(): boolean { return this.isDead; }
  get invincible(): boolean { return this.isInvincible; }
}
