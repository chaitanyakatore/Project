/**
 * app/page.tsx
 *
 * Root page. Dynamically imports GameContainer so Phaser
 * (which requires window/document) is NEVER loaded on the server.
 */
import GameLoader from "@/components/game/GameLoader";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
      <GameLoader />
    </main>
  );
}
