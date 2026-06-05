/**
 * game/entities/Coin.ts
 *
 * Collectible coin sprite. Plays a spin animation, and shows a pop
 * effect when collected. Implements a simple floating bob animation.
 */
import Phaser from 'phaser';

export class Coin extends Phaser.Physics.Arcade.Sprite {
  private collected = false;
  private baseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin', 0);

    this.baseY = y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);  // coins float in mid-air
    body.setImmovable(true);
    body.setSize(20, 20);
    body.setOffset(6, 6);

    this.setScale(1.2);
    this.play('coin_spin');

    // Gentle floating bob
    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  collect(): void {
    if (this.collected) return;
    this.collected = true;

    // Pop-up animation before destroying
    this.scene.tweens.add({
      targets: this,
      y: this.y - 40,
      alpha: 0,
      duration: 300,
      ease: 'Quad.out',
      onComplete: () => this.destroy(),
    });

    // Score popup text ("+100")
    const scoreText = this.scene.add.text(this.x, this.y - 10, '+100', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: scoreText,
      y: scoreText.y - 30,
      alpha: 0,
      duration: 600,
      onComplete: () => scoreText.destroy(),
    });
  }

  get isCollected(): boolean { return this.collected; }
}
