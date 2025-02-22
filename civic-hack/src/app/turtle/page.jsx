"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import chroma from "chroma-js";

// Dynamically import TurtleAnimation to prevent SSR errors
const TurtleAnimation = dynamic(
  () => import("@/components/turtle/MenuNaivation"),
  {
    ssr: false,
  }
);
const MenuNavigation = dynamic(
  () => import("@/components/turtle/MenuNaivation"),
  {
    ssr: false,
  }
);

const initialCode = `<ul id="menu">
  <li>Home</li>
  <li>About</li>
  <li>Contact</li>
</ul>`;

export default function KeyboardNavGame() {
  const [code, setCode] = useState(initialCode);
  const [isValid, setIsValid] = useState(false);

  const validateCode = () => {
    if (code.includes('tabindex="0"') && code.includes('role="menuitem"')) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="flex h-screen bg-blue-100 p-5">
      {/* Left Panel - Code Editor */}
      <div className="w-1/2 bg-gray-900 text-white p-5 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-3">
          Fix the Turtle’s Menu Navigation
        </h2>
        <p className="text-sm mb-3">
          Help the turtle navigate the menu using keyboard controls.
        </p>
        <textarea
          className="w-full h-40 p-3 bg-gray-800 text-green-300 font-mono text-sm rounded-md"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={validateCode}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Run Code
        </button>
        <p className="mt-3 text-yellow-300">
          {isValid
            ? "✅ Correct! The turtle can navigate."
            : "⚠️ Incomplete. Add tabindex & role!"}
        </p>
      </div>

      {/* Right Panel - Interactive Menu with Turtle */}
      <div className="w-1/2 flex flex-col items-center justify-center relative">
        <TurtleAnimation />
        <MenuNavigation isValid={isValid} />
      </div>
    </div>
  );
}
