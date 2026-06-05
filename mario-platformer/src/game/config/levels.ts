/**
 * game/config/levels.ts
 *
 * Level data definitions. Each level describes its platforms, enemies,
 * coins, and goal position. Add new levels by pushing to this array.
 */
import { LevelData } from "@/types/game";

export const LEVELS: LevelData[] = [
  // ─── Level 1 ───────────────────────────────────────────────────────────────
  {
    key: "level_1",
    width: 4800,
    height: 450,
    playerStart: { x: 80, y: 300 },
    goalX: 4650,

    // Ground + floating platforms
    platforms: [
      // Starting ground
      { x: 0, y: 416, width: 20, tileType: "grass" },
      // Gap then continue
      { x: 800, y: 416, width: 30, tileType: "grass" },
      // More ground
      { x: 1760, y: 416, width: 25, tileType: "grass" },
      { x: 2720, y: 416, width: 40, tileType: "grass" },
      { x: 4160, y: 416, width: 20, tileType: "grass" },

      // Floating platforms — classic Mario steps
      { x: 300, y: 310, width: 3, tileType: "brick" },
      { x: 480, y: 260, width: 3, tileType: "brick" },
      { x: 640, y: 210, width: 3, tileType: "brick" },

      // Question blocks
      { x: 384, y: 260, width: 1, tileType: "question" },
      { x: 512, y: 210, width: 1, tileType: "question" },

      // Mid section platforms
      { x: 1000, y: 340, width: 4, tileType: "brick" },
      { x: 1200, y: 280, width: 4, tileType: "brick" },
      { x: 1400, y: 220, width: 4, tileType: "brick" },

      // Upper path
      { x: 1600, y: 200, width: 6, tileType: "brick" },
      { x: 1900, y: 240, width: 5, tileType: "brick" },

      // Staircase pattern
      { x: 2200, y: 384, width: 2, tileType: "dirt" },
      { x: 2264, y: 352, width: 2, tileType: "dirt" },
      { x: 2328, y: 320, width: 2, tileType: "dirt" },
      { x: 2392, y: 288, width: 2, tileType: "dirt" },

      // Final approach
      { x: 3000, y: 350, width: 5, tileType: "brick" },
      { x: 3200, y: 300, width: 5, tileType: "brick" },
      { x: 3500, y: 350, width: 5, tileType: "brick" },
      { x: 3800, y: 300, width: 4, tileType: "brick" },
    ],

    enemies: [
      // Goombas on ground
      { x: 500, y: 390, type: "goomba", speed: 60, patrolDistance: 120 },
      { x: 900, y: 390, type: "goomba", speed: 70, patrolDistance: 100 },
      { x: 1100, y: 390, type: "goomba", speed: 80, patrolDistance: 150 },
      { x: 1500, y: 390, type: "goomba", speed: 60, patrolDistance: 100 },
      { x: 2000, y: 390, type: "goomba", speed: 90, patrolDistance: 200 },
      { x: 2500, y: 390, type: "goomba", speed: 70, patrolDistance: 120 },
      { x: 2900, y: 390, type: "goomba", speed: 100, patrolDistance: 160 },
      { x: 3300, y: 390, type: "goomba", speed: 80, patrolDistance: 140 },
      { x: 3700, y: 390, type: "goomba", speed: 90, patrolDistance: 180 },

      // Goombas on platforms
      { x: 1020, y: 314, type: "goomba", speed: 50, patrolDistance: 80 },
      { x: 1620, y: 174, type: "goomba", speed: 60, patrolDistance: 100 },
    ],

    coins: [
      // Arc pattern at start
      { x: 200, y: 350 },
      { x: 240, y: 330 },
      { x: 280, y: 310 },
      { x: 320, y: 300 },
      { x: 360, y: 310 },
      { x: 400, y: 330 },

      // Platform coins
      { x: 310, y: 278 },
      { x: 342, y: 278 },
      { x: 374, y: 278 },
      { x: 490, y: 228 },
      { x: 522, y: 228 },
      { x: 554, y: 228 },

      // Mid level trail
      { x: 1010, y: 310 },
      { x: 1042, y: 310 },
      { x: 1074, y: 310 },
      { x: 1210, y: 250 },
      { x: 1242, y: 250 },
      { x: 1274, y: 250 },
      { x: 1410, y: 190 },
      { x: 1442, y: 190 },
      { x: 1474, y: 190 },

      // Upper path trail
      { x: 1610, y: 168 },
      { x: 1642, y: 168 },
      { x: 1674, y: 168 },
      { x: 1706, y: 168 },
      { x: 1738, y: 168 },

      // Final stretch
      { x: 4000, y: 370 },
      { x: 4060, y: 340 },
      { x: 4120, y: 310 },
      { x: 4180, y: 290 },
      { x: 4240, y: 280 },
      { x: 4300, y: 290 },
      { x: 4360, y: 310 },
      { x: 4420, y: 340 },
      { x: 4480, y: 370 },
    ],
  },
];
