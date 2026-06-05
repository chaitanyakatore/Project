# 🍄 Super Platformer — Mario-like game with Next.js 15 + Phaser 3

A production-grade Mario-style platformer built with:
- **Next.js 15** (App Router)
- **Phaser 3.87** (game engine)
- **TypeScript** (strict mode)
- **Tailwind CSS** (UI styling)
- **Zustand** (optional global state)

---

## 🚀 Installation

```bash
# 1. Clone / copy the project
cd mario-platformer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 📁 Folder Structure

```
mario-platformer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (loads pixel font)
│   │   ├── page.tsx            # Entry page (dynamic imports GameContainer)
│   │   └── globals.css         # Tailwind + global styles
│   │
│   ├── components/
│   │   ├── game/
│   │   │   └── GameContainer.tsx   # React ↔ Phaser bridge
│   │   └── ui/
│   │       ├── SoundToggle.tsx
│   │       └── FullscreenButton.tsx
│   │
│   ├── game/
│   │   ├── GameManager.ts      # Creates/owns Phaser.Game instance
│   │   ├── config/
│   │   │   ├── gameConfig.ts   # All gameplay constants
│   │   │   └── levels.ts       # Level data (platforms, enemies, coins)
│   │   ├── scenes/
│   │   │   ├── BootScene.ts    # Initialises registry
│   │   │   ├── PreloadScene.ts # Generates sprites
│   │   │   ├── MainMenuScene.ts
│   │   │   ├── GameScene.ts    # Main gameplay
│   │   │   ├── HUDScene.ts     # Score/lives overlay
│   │   │   ├── PauseScene.ts
│   │   │   ├── EndScenes.ts    # GameOver + Win
│   │   │   └── index.ts        # Barrel exports
│   │   ├── entities/
│   │   │   ├── Player.ts       # Player with coyote time + jump buffer
│   │   │   ├── Enemy.ts        # Patrol enemy
│   │   │   └── Coin.ts         # Collectible coin
│   │   ├── systems/
│   │   │   ├── LevelBuilder.ts  # Builds levels from data
│   │   │   ├── ScoreSystem.ts   # Score / lives / high score
│   │   │   ├── CameraSystem.ts  # Smooth follow camera
│   │   │   └── CollisionSystem.ts
│   │   └── utils/
│   │       ├── spriteGenerator.ts  # Procedural placeholder graphics
│   │       ├── soundSystem.ts      # Web Audio procedural SFX
│   │       └── animationRegistry.ts
│   │
│   ├── hooks/
│   │   └── useGame.ts          # Manages Phaser lifecycle in React
│   └── types/
│       └── game.ts             # All shared TypeScript types
│
├── public/
│   └── assets/
│       ├── sprites/            # ← Put real .png sprite sheets here
│       ├── audio/              # ← Put real .mp3/.ogg audio here
│       └── tilemaps/           # ← Put Tiled JSON maps here (optional)
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎮 Controls

| Action | Keys |
|--------|------|
| Move Left | `← Arrow` or `A` |
| Move Right | `→ Arrow` or `D` |
| Jump | `Z`, `Space`, or `↑ Arrow` |
| Pause | `P` or `Escape` |

**Mobile**: Touch buttons are shown on small screens.

---

## 🎨 Adding Real Sprites

The game uses **procedurally generated placeholder graphics** so it works out of the box with zero assets. When you have real sprites:

1. Place your sprite sheets in `public/assets/sprites/`
2. Edit `src/game/scenes/PreloadScene.ts` — replace `generateAllSprites(this)` with:

```ts
this.load.spritesheet('player', '/assets/sprites/player.png', {
  frameWidth: 32,
  frameHeight: 32,
});
this.load.spritesheet('goomba', '/assets/sprites/goomba.png', {
  frameWidth: 32,
  frameHeight: 32,
});
// etc.
```

3. The rest of the game already references these texture keys — no other changes needed.

---

## 🔊 Adding Real Audio

1. Place audio files in `public/assets/audio/`
2. In `PreloadScene.ts`:

```ts
this.load.audio('bgm_main', '/assets/audio/bgm.mp3');
this.load.audio('sfx_jump', '/assets/audio/jump.wav');
```

3. Play them via `this.sound.play('sfx_jump')` in the relevant scene/entity.

---

## ➕ Adding a New Level

Edit `src/game/config/levels.ts` and push a new entry to the `LEVELS` array. Each level is pure data — no code changes needed.

---

## 🏗️ Architecture Notes

- **Phaser never runs on the server** — `GameContainer` is loaded with `ssr: false` via `dynamic()`.
- **React and Phaser are fully decoupled** — `GameManager` owns Phaser; React only manages the DOM wrapper.
- **Scenes communicate via Phaser's event system** (`this.events.emit`) and the shared `registry`.
- **All gameplay constants** are in `gameConfig.ts` — change values there to tweak feel.
- **Coyote time + jump buffering** make movement feel responsive (see `Player.ts`).

---

## 🛠️ Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check (no emit)
npm run lint         # ESLint
```
