/**
 * game/utils/spriteGenerator.ts
 *
 * Generates all placeholder sprite textures using Phaser's Graphics API.
 * This means the game looks good out of the box with NO external image files.
 * Replace these with real sprite sheets later — just swap the texture keys.
 */
import Phaser from "phaser";
import { TILE_SIZE } from "../config/gameConfig";

const T = TILE_SIZE;

// ─── Player Sprites ────────────────────────────────────────────────────────────

/**
 * Creates a spritesheet texture for the player (Mario-like character).
 * Each "frame" is T×T pixels. We draw 8 frames:
 *  0: idle, 1-3: run, 4: jump, 5: skid, 6: dead, 7: crouch
 */
export function generatePlayerSprite(scene: Phaser.Scene): void {
  const frameCount = 8;
  const gfx = scene.add.graphics({ x: 0, y: 0 });

  for (let i = 0; i < frameCount; i++) {
    const ox = i * T;

    // Body (red)
    gfx.fillStyle(0xe52521);
    gfx.fillRect(ox + 8, 4, 16, 16);

    // Hat (red)
    gfx.fillStyle(0xe52521);
    gfx.fillRect(ox + 6, 0, 20, 6);

    // Face (skin)
    gfx.fillStyle(0xfdcea3);
    gfx.fillRect(ox + 8, 6, 14, 10);

    // Eyes
    gfx.fillStyle(0x000000);
    gfx.fillRect(ox + 11, 8, 3, 3);
    gfx.fillRect(ox + 18, 8, 3, 3);

    // Moustache
    gfx.fillStyle(0x4a2e0a);
    gfx.fillRect(ox + 9, 13, 5, 3);
    gfx.fillRect(ox + 17, 13, 5, 3);

    // Overalls (blue) — vary per animation frame
    gfx.fillStyle(0x049cd8);
    if (i === 4) {
      // Jump — legs tucked up
      gfx.fillRect(ox + 8, 18, 16, 10);
    } else if (i % 2 === 0) {
      // Frame A — legs apart
      gfx.fillRect(ox + 8, 18, 16, 10);
      gfx.fillRect(ox + 8, 26, 6, 6);
      gfx.fillRect(ox + 18, 26, 6, 6);
    } else {
      // Frame B — legs together
      gfx.fillRect(ox + 8, 18, 16, 14);
    }

    // Shoes (dark)
    gfx.fillStyle(0x4a2e0a);
    if (i !== 4) {
      gfx.fillRect(ox + 6, 28, 8, 4);
      gfx.fillRect(ox + 18, 28, 8, 4);
    }
  }

  gfx.generateTexture("player", frameCount * T, T);
  scene.textures.addSpriteSheet("player", scene.textures.get("player"), {
    frameWidth: T,
    frameHeight: T,
  });
  gfx.destroy();
}

// ─── Enemy Sprites ─────────────────────────────────────────────────────────────

export function generateGoombaSprite(scene: Phaser.Scene): void {
  const gfx = scene.add.graphics({ x: 0, y: 0 });

  // Frame 0: walk A
  // Frame 1: walk B
  // Frame 2: squished (dead)
  for (let i = 0; i < 3; i++) {
    const ox = i * T;
    const squished = i === 2;

    const bodyH = squished ? 8 : 24;
    const bodyY = squished ? 24 : 8;

    // Body (brown mushroom)
    gfx.fillStyle(0x8b4513);
    gfx.fillRoundedRect(ox + 4, bodyY, 24, bodyH, 4);

    // Eyes — angry V shape
    gfx.fillStyle(0xffffff);
    gfx.fillRect(ox + 8, bodyY + 4, 6, 6);
    gfx.fillRect(ox + 18, bodyY + 4, 6, 6);
    gfx.fillStyle(0x000000);
    gfx.fillRect(ox + 10, bodyY + 5, 3, 3);
    gfx.fillRect(ox + 20, bodyY + 5, 3, 3);

    if (!squished) {
      // Feet — alternate per frame
      gfx.fillStyle(0x3d1a00);
      if (i === 0) {
        gfx.fillRect(ox + 4, 28, 8, 4);
        gfx.fillRect(ox + 20, 28, 8, 4);
      } else {
        gfx.fillRect(ox + 2, 28, 8, 4);
        gfx.fillRect(ox + 22, 28, 8, 4);
      }
    }
  }

  gfx.generateTexture("goomba", 3 * T, T);
  scene.textures.addSpriteSheet("goomba", scene.textures.get("goomba"), {
    frameWidth: T,
    frameHeight: T,
  });
  gfx.destroy();
}

// ─── Tile Sprites ──────────────────────────────────────────────────────────────

export function generateTileSprites(scene: Phaser.Scene): void {
  const gfx = scene.add.graphics({ x: 0, y: 0 });

  // ── Grass tile (frame 0) ──
  gfx.fillStyle(0x43b047); // top
  gfx.fillRect(0, 0, T, 8);
  gfx.fillStyle(0xc84b0c); // dirt
  gfx.fillRect(0, 8, T, T - 8);
  gfx.fillStyle(0x2e8b00);
  gfx.fillRect(4, 2, 4, 4);
  gfx.fillRect(18, 1, 3, 5);

  // ── Dirt tile (frame 1) ──
  const dx = T;
  gfx.fillStyle(0xc84b0c);
  gfx.fillRect(dx, 0, T, T);
  gfx.fillStyle(0xa33a00);
  gfx.fillRect(dx + 2, 2, 6, 6);
  gfx.fillRect(dx + 20, 10, 5, 5);

  // ── Brick tile (frame 2) ──
  const bx = T * 2;
  gfx.fillStyle(0xc84b0c);
  gfx.fillRect(bx, 0, T, T);
  gfx.fillStyle(0x8b3a00);
  // Mortar lines
  gfx.fillRect(bx, 10, T, 2);
  gfx.fillRect(bx, 22, T, 2);
  gfx.fillRect(bx + 16, 0, 2, 10);
  gfx.fillRect(bx + 8, 12, 2, 10);
  gfx.fillRect(bx + 24, 12, 2, 10);

  // ── Question block (frame 3) ──
  const qx = T * 3;
  gfx.fillStyle(0xfbd000);
  gfx.fillRect(qx, 0, T, T);
  gfx.fillStyle(0xe0a800);
  gfx.fillRect(qx + 2, 2, T - 4, T - 4);
  gfx.fillStyle(0xffffff);
  // "?" shape
  gfx.fillRect(qx + 12, 6, 8, 4);
  gfx.fillRect(qx + 16, 10, 4, 4);
  gfx.fillRect(qx + 12, 14, 4, 4);
  gfx.fillRect(qx + 12, 20, 4, 4);

  // ── Question block used (frame 4 — grey) ──
  const ux = T * 4;
  gfx.fillStyle(0x888888);
  gfx.fillRect(ux, 0, T, T);
  gfx.fillStyle(0x666666);
  gfx.fillRect(ux + 2, 2, T - 4, T - 4);

  gfx.generateTexture("tiles", T * 5, T);
  scene.textures.addSpriteSheet("tiles", scene.textures.get("tiles"), {
    frameWidth: T,
    frameHeight: T,
  });
  gfx.destroy();
}

// ─── Coin Sprite ───────────────────────────────────────────────────────────────

export function generateCoinSprite(scene: Phaser.Scene): void {
  const frameCount = 4;
  const gfx = scene.add.graphics({ x: 0, y: 0 });

  const colors = [0xfbd000, 0xffe84a, 0xfff4a0, 0xffe84a]; // shimmer cycle

  for (let i = 0; i < frameCount; i++) {
    const ox = i * T;
    gfx.fillStyle(colors[i]);
    gfx.fillCircle(ox + T / 2, T / 2, 10);
    gfx.fillStyle(0xe0a800);
    gfx.fillCircle(ox + T / 2, T / 2, 7);
    gfx.fillStyle(0xfbd000);
    gfx.fillCircle(ox + T / 2, T / 2, 4);
  }

  gfx.generateTexture("coin", frameCount * T, T);
  scene.textures.addSpriteSheet("coin", scene.textures.get("coin"), {
    frameWidth: T,
    frameHeight: T,
  });
  gfx.destroy();
}

// ─── Goal Flag ─────────────────────────────────────────────────────────────────

export function generateGoalSprite(scene: Phaser.Scene): void {
  const gfx = scene.add.graphics({ x: 0, y: 0 });

  // Pole
  gfx.fillStyle(0xaaaaaa);
  gfx.fillRect(14, 0, 4, 128);

  // Flag
  gfx.fillStyle(0x43b047);
  gfx.fillTriangle(18, 8, 18, 40, 50, 24);

  gfx.generateTexture("goal", 64, 128);
  gfx.destroy();
}

// ─── Parallax Background Layers ────────────────────────────────────────────────

export function generateBackgroundLayers(scene: Phaser.Scene): void {
  // Layer 0 — distant mountains (800 wide)
  const g0 = scene.add.graphics({ x: 0, y: 0 });
  g0.fillStyle(0x7ba0d8); // slightly darker than sky
  // Mountain silhouettes
  drawMountain(g0, 100, 300, 120, 180);
  drawMountain(g0, 320, 300, 90, 160);
  drawMountain(g0, 550, 300, 140, 200);
  drawMountain(g0, 750, 300, 80, 140);
  g0.generateTexture("bg_mountains", 800, 300);
  g0.destroy();

  // Layer 1 — clouds (800 wide)
  const g1 = scene.add.graphics({ x: 0, y: 0 });
  drawCloud(g1, 80, 50, 1.2);
  drawCloud(g1, 280, 80, 0.9);
  drawCloud(g1, 500, 40, 1.5);
  drawCloud(g1, 680, 70, 1.0);
  g1.generateTexture("bg_clouds", 800, 150);
  g1.destroy();

  // Layer 2 — distant hills (800 wide)
  const g2 = scene.add.graphics({ x: 0, y: 0 });
  g2.fillStyle(0x3da040);
  drawHill(g2, 0, 200, 200, 100);
  drawHill(g2, 300, 200, 160, 80);
  drawHill(g2, 600, 200, 220, 110);
  g2.generateTexture("bg_hills", 800, 200);
  g2.destroy();
}

// ─── Helper drawing functions ─────────────────────────────────────────────────

function drawMountain(
  g: Phaser.GameObjects.Graphics,
  x: number,
  baseY: number,
  halfW: number,
  height: number,
): void {
  g.fillTriangle(x, baseY, x + halfW, baseY - height, x + halfW * 2, baseY);
}

function drawCloud(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  scale: number,
): void {
  g.fillStyle(0xffffff, 0.9);
  g.fillCircle(x, y, 20 * scale);
  g.fillCircle(x + 22 * scale, y - 10 * scale, 26 * scale);
  g.fillCircle(x + 48 * scale, y, 20 * scale);
  g.fillRect(x, y, 48 * scale, 20 * scale);
}

function drawHill(
  g: Phaser.GameObjects.Graphics,
  x: number,
  baseY: number,
  width: number,
  height: number,
): void {
  g.fillEllipse(x + width / 2, baseY, width, height * 2);
}

// ─── Particle texture (tiny square for effects) ───────────────────────────────

export function generateParticleTexture(scene: Phaser.Scene): void {
  const gfx = scene.add.graphics({ x: 0, y: 0 });
  gfx.fillStyle(0xfbd000);
  gfx.fillRect(0, 0, 6, 6);
  gfx.generateTexture("particle_coin", 6, 6);
  gfx.fillStyle(0xff4444);
  gfx.fillRect(0, 0, 6, 6);
  gfx.generateTexture("particle_death", 6, 6);
  gfx.destroy();
}

// ─── Master generator: call once in PreloadScene ──────────────────────────────
export function generateAllSprites(scene: Phaser.Scene): void {
  generatePlayerSprite(scene);
  generateGoombaSprite(scene);
  generateTileSprites(scene);
  generateCoinSprite(scene);
  generateGoalSprite(scene);
  generateBackgroundLayers(scene);
  generateParticleTexture(scene);
}
