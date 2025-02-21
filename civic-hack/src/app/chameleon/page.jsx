"use client";

import { useState } from "react";
import chroma from "chroma-js";
import dynamic from "next/dynamic";

// Dynamically import ChameleonAnimation to prevent SSR issues
const ChameleonAnimation = dynamic(
  () => import("@/components/ChameleonAnimation"),
  { ssr: false }
);

export default function ChameleonContrastGame() {
  const [textColor, setTextColor] = useState("#239DB2");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Function to check contrast ratio
  const getContrastRatio = (color1, color2) => {
    return chroma.contrast(color1, color2).toFixed(2);
  };

  const contrastRatio = getContrastRatio(textColor, bgColor);
  const meetsWCAG =
    contrastRatio >= 4.5 ? "✅ Meets WCAG 2.1 AA" : "⚠️ Contrast too low";

  return (
    <div className="flex h-screen bg-green-100 p-5">
      {/* Left Panel - Code Editor */}
      <div className="w-1/2 bg-gray-900 text-white p-5 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-3">Adjust the Chameleon Color</h2>
        <p className="text-sm mb-3">
          Help the chameleon stands out from the background color to pass WCAG
          2.1 contrast test.
        </p>
        <div className="bg-gray-800 p-3 rounded-md font-mono text-sm">
          <p>#sign {"{"}</p>
          <p className="pl-5">
            color:
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="ml-2 border-none w-10 h-5 cursor-pointer"
            />
            ;
          </p>
          <p className="pl-5">
            background-color:
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="ml-2 border-none w-10 h-5 cursor-pointer"
            />
            ;
          </p>
          <p>{"}"}</p>
        </div>
        <p className="mt-3 text-yellow-300">{meetsWCAG}</p>
      </div>

      {/* Right Panel - Chameleon & Sign Preview */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div
          className="w-full h-full flex items-center justify-center rounded-md shadow-lg border"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <ChameleonAnimation color={textColor} />
          <p className="text-xl font-bold">Zoo Entrance</p>
        </div>
      </div>
    </div>
  );
}
