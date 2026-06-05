"use client";

import dynamic from "next/dynamic";

const GameContainer = dynamic(() => import("@/components/game/GameContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <p className="font-pixel text-white text-sm animate-pulse">Loading...</p>
    </div>
  ),
});

export default function GameLoader() {
  return <GameContainer />;
}
