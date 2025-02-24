"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ColorSliders } from "@/components/chameleon/ColorSliders";
import { ContrastBadge } from "@/components/chameleon/ContrastBadge";
import { isHex } from "@/utils/color-utils";
import { useRouter } from "next/navigation";

// Dynamically import ChameleonAnimation to prevent SSR issues
const ChameleonAnimation = dynamic(
  () => import("@/components/chameleon/ChameleonAnimation"),
  { ssr: false }
);

// Initial color values
const INITIAL_COLORS = {
  chameleon: "#237191",
  environment: "#042330",
};

export default function AccessibilityChallenge() {
  const router = useRouter();
  const [chameleonColor, setChameleonColor] = useState("#237191");
  const [environmentColor, setEnvironmentColor] = useState("#042330");
  const [chameleonInput, setChameleonInput] = useState("#237191");
  const [environmentInput, setEnvironmentInput] = useState("#042330");

  const handleChameleonColorChange = (e) => {
    const value = e.target.value;
    setChameleonInput(value);
    if (isHex(value)) {
      setChameleonColor(value);
    }
  };

  const handleEnvironmentColorChange = (e) => {
    const value = e.target.value;
    setEnvironmentInput(value);
    if (isHex(value)) {
      setEnvironmentColor(value);
    }
  };

  const swapColors = () => {
    const tempColor = chameleonColor;
    const tempInput = chameleonInput;
    setChameleonColor(environmentColor);
    setChameleonInput(environmentInput);
    setEnvironmentColor(tempColor);
    setEnvironmentInput(tempInput);
  };

  const resetColors = () => {
    setChameleonColor(INITIAL_COLORS.chameleon);
    setChameleonInput(INITIAL_COLORS.chameleon);
    setEnvironmentColor(INITIAL_COLORS.environment);
    setEnvironmentInput(INITIAL_COLORS.environment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Added Next button */}
        <header className="max-w-4xl mx-auto mb-12 text-center relative">
          <div className="inline-block px-3 py-1 mb-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
            Level 1
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5390b0] to-[#97c7e1] pt-8 mb-2">
            🦎 Welcome to A11Y Zoo: Chameleon Mode!
          </h1>

          <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Help our chameleon blend into its environment while staying{" "}
              <span
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-help"
                title="Web Content Accessibility Guidelines"
              >
                WCAG 2.1 compliant
              </span>
              ! Can you strike the perfect balance between{" "}
              <span className="font-semibold text-green-400">visibility</span>{" "}
              and{" "}
              <span className="font-semibold text-purple-400">
                accessibility
              </span>
              ?
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="p-6">
              {/* Code Editor */}
              <div className="bg-gray-900/80 rounded-lg overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span className="px-2 py-1 rounded bg-gray-700/50">
                      style.css
                    </span>
                  </div>
                </div>
                <div className="p-4 font-mono text-sm">
                  <div className="text-gray-300">
                    <p>
                      <span className="text-blue-400">.chameleon</span> {"{"}
                    </p>
                    <div className="pl-6 space-y-4">
                      <div className="flex items-center group">
                        <span className="text-purple-400">color:</span>
                        <div className="relative ml-2">
                          <input
                            type="text"
                            value={chameleonInput}
                            onChange={handleChameleonColorChange}
                            className="bg-gray-800/50 px-3 py-1 rounded border border-gray-700 focus:border-blue-500 focus:outline-none
                              transition-all duration-200 w-28 font-mono group-hover:w-32"
                            placeholder="#000000"
                          />
                          <div
                            className="w-4 h-4 rounded absolute right-2 top-1/2 -translate-y-1/2"
                            style={{ backgroundColor: chameleonColor }}
                          ></div>
                        </div>
                        <span className="text-gray-500">;</span>
                      </div>
                      <div className="flex items-center group">
                        <span className="text-purple-400">
                          background-color:
                        </span>
                        <div className="relative ml-2">
                          <input
                            type="text"
                            value={environmentInput}
                            onChange={handleEnvironmentColorChange}
                            className="bg-gray-800/50 px-3 py-1 rounded border border-gray-700 focus:border-blue-500 focus:outline-none
                              transition-all duration-200 w-28 font-mono group-hover:w-32"
                            placeholder="#ffffff"
                          />
                          <div
                            className="w-4 h-4 rounded absolute right-2 top-1/2 -translate-y-1/2"
                            style={{ backgroundColor: environmentColor }}
                          ></div>
                        </div>
                        <span className="text-gray-500">;</span>
                      </div>
                    </div>
                    <p>{"}"}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={swapColors}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                      text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                      hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                      Swap Colors
                    </span>
                  </button>

                  <button
                    onClick={resetColors}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                      text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                      hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reset Colors
                    </span>
                  </button>
                </div>

                <ContrastBadge
                  bgColor={environmentColor}
                  fgColor={chameleonColor}
                />

                <div className="grid grid-cols-2 gap-4">
                  <ColorSliders
                    color={chameleonColor}
                    onChange={(color) => {
                      setChameleonColor(color);
                      setChameleonInput(color);
                    }}
                    label="Chameleon Color"
                  />

                  <ColorSliders
                    color={environmentColor}
                    onChange={(color) => {
                      setEnvironmentColor(color);
                      setEnvironmentInput(color);
                    }}
                    label="Background Color"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="h-full">
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-300"
                style={{ backgroundColor: environmentColor }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <ChameleonAnimation color={chameleonColor} />
                  <p
                    className="absolute bottom-8 text-2xl font-bold tracking-wide"
                    style={{ color: chameleonColor }}
                  >
                    Zoo Entrance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Added Next button at bottom */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => router.push("/bat")}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
              text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]
              hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] flex items-center"
          >
            Next
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
