/**
 * game/systems/LevelBuilder.ts
 *
 * Reads a LevelData definition and constructs all Phaser game objects:
 * - Platform static groups (using the tile sprite)
 * - Coin physics group
 * - Enemy physics group
 * - Goal flag
 * - Death zone (invisible rectangle at the bottom)
 */
import Phaser from 'phaser';
import { LevelData } from '@/types/game';
import { TILE_SIZE } from '../config/gameConfig';
import { Enemy } from '../entities/Enemy';
import { Coin } from '../entities/Coin';

// Maps tile type names to frame indices in the 'tiles' spritesheet
const TILE_FRAMES: Record<string, number> = {
  grass:    0,
  dirt:     1,
  brick:    2,
  question: 3,
};

export interface LevelObjects {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  coins:     Phaser.Physics.Arcade.StaticGroup;
  enemies:   Phaser.Physics.Arcade.Group;
  goal:      Phaser.GameObjects.Sprite;
  deathZone: Phaser.GameObjects.Zone;
  enemyList: Enemy[];
  coinList:  Coin[];
}

export class LevelBuilder {
  private scene: Phaser.Scene;
  private T = TILE_SIZE;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  build(data: LevelData): LevelObjects {
    const platforms = this.buildPlatforms(data);
    const { coins, coinList } = this.buildCoins(data);
    const { enemies, enemyList } = this.buildEnemies(data);
    const goal = this.buildGoal(data);
    const deathZone = this.buildDeathZone(data);
    this.buildBackground(data);

    return { platforms, coins, enemies, goal, deathZone, enemyList, coinList };
  }

  // ── Platforms ──────────────────────────────────────────────────────────────
  private buildPlatforms(data: LevelData): Phaser.Physics.Arcade.StaticGroup {
    const group = this.scene.physics.add.staticGroup();

    data.platforms.forEach((p) => {
      const tileType  = p.tileType ?? 'grass';
      const frameIdx  = TILE_FRAMES[tileType] ?? 0;

      for (let i = 0; i < p.width; i++) {
        const tileX = p.x + i * this.T + this.T / 2;
        const tileY = p.y + this.T / 2;

        // Use a regular image from the spritesheet
        const tile = this.scene.physics.add.staticImage(tileX, tileY, 'tiles', frameIdx);
        tile.setDisplaySize(this.T, this.T);
        tile.refreshBody();

        group.add(tile);
      }
    });

    return group;
  }

  // ── Coins ──────────────────────────────────────────────────────────────────
  private buildCoins(data: LevelData): { coins: Phaser.Physics.Arcade.StaticGroup; coinList: Coin[] } {
    const group    = this.scene.physics.add.staticGroup();
    const coinList: Coin[] = [];

    data.coins.forEach((c) => {
      const coin = new Coin(this.scene, c.x, c.y);
      group.add(coin);
      coinList.push(coin);
    });

    return { coins: group, coinList };
  }

  // ── Enemies ────────────────────────────────────────────────────────────────
  private buildEnemies(
    data: LevelData
  ): { enemies: Phaser.Physics.Arcade.Group; enemyList: Enemy[] } {
    const group     = this.scene.physics.add.group();
    const enemyList: Enemy[] = [];

    data.enemies.forEach((e) => {
      const enemy = new Enemy(this.scene, e);
      group.add(enemy);
      enemyList.push(enemy);
    });

    return { enemies: group, enemyList };
  }

  // ── Goal flag ──────────────────────────────────────────────────────────────
  private buildGoal(data: LevelData): Phaser.GameObjects.Sprite {
    const goal = this.scene.add.sprite(data.goalX, data.height - 64, 'goal');
    goal.setOrigin(0.5, 1);
    goal.setScale(1);

    // Wave the flag gently
    this.scene.tweens.add({
      targets: goal,
      scaleX: 0.95,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    return goal;
  }

  // ── Death zone (bottom of world) ───────────────────────────────────────────
  private buildDeathZone(data: LevelData): Phaser.GameObjects.Zone {
    // A wide invisible trigger zone below the visible area
    return this.scene.add.zone(
      data.width / 2,
      data.height + 50,
      data.width,
      100
    );
  }

  // ── Parallax background ────────────────────────────────────────────────────
  private buildBackground(data: LevelData): void {
    const { width, height } = data;

    // Sky fill
    this.scene.add.rectangle(0, 0, width, height, 0x5C94FC).setOrigin(0).setDepth(-10);

    // Mountains — tile to cover the whole level width
    const mountainsCount = Math.ceil(width / 800) + 1;
    for (let i = 0; i < mountainsCount; i++) {
      this.scene.add.image(i * 800, height - 300, 'bg_mountains')
        .setOrigin(0)
        .setScrollFactor(0.1)  // parallax: moves at 10% of camera speed
        .setDepth(-9);
    }

    // Clouds
    const cloudsCount = Math.ceil(width / 800) + 1;
    for (let i = 0; i < cloudsCount; i++) {
      this.scene.add.image(i * 800, 0, 'bg_clouds')
        .setOrigin(0)
        .setScrollFactor(0.2)
        .setDepth(-8);
    }

    // Hills
    const hillsCount = Math.ceil(width / 800) + 1;
    for (let i = 0; i < hillsCount; i++) {
      this.scene.add.image(i * 800, height - 200, 'bg_hills')
        .setOrigin(0)
        .setScrollFactor(0.4)
        .setDepth(-7);
    }
  }
}
