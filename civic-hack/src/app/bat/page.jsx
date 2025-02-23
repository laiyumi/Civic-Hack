"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// import BatAnimation from "@/components/bat/BatAnimation";
import ScreenReaderSimulator from "@/components/bat/ScreenReaderSimulator";
// import Lottie from "lottie-react";
import nightAnimation from "../../../public/night.json";

const initialCode = `<form>
  <input type="text" id="name" />
  <input type="email" id="email" />
</form>`;

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const BatAnimation = dynamic(() => import("@/components/bat/BatAnimation"), {
  ssr: false,
});

export default function FormLabelsGame() {
  const [code, setCode] = useState(initialCode);
  const [isValid, setIsValid] = useState("exploring");
  const [codeValidated, setCodeValidated] = useState(false);
  const [batPosition, setBatPosition] = useState(null);
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const rightPanelRef = useRef(null);
  const batRef = useRef(null);
  const [movementMode, setMovementMode] = useState("random");

  useEffect(() => {
    setIsClient(true);
    setBatPosition({ x: 100, y: 100 });
  }, []);

  const hasLabelForInput = (inputId) => {
    const labelRegex = new RegExp(`<label[^>]*for=["']${inputId}["'][^>]*>`);
    return labelRegex.test(code);
  };

  useEffect(() => {
    if (movementMode !== "follow") return;

    const handleMouseMove = (e) => {
      if (!rightPanelRef.current) return;

      const panel = rightPanelRef.current.getBoundingClientRect();
      const x = e.clientX - panel.left;
      const y = e.clientY - panel.top;

      // Ensure the bat stays within bounds
      const boundedX = Math.max(0, Math.min(x, panel.width - 128));
      const boundedY = Math.max(0, Math.min(y, panel.height - 128));

      setBatPosition({ x: boundedX, y: boundedY });

      // Add collision detection
      setTimeout(() => {
        if (!batRef.current) return;
        const batRect = batRef.current.getBoundingClientRect();
        const inputs = rightPanelRef.current.querySelectorAll("input");

        let isColliding = false;
        inputs.forEach((input) => {
          const inputRect = input.getBoundingClientRect();
          if (
            batRect.right > inputRect.left &&
            batRect.left < inputRect.right &&
            batRect.bottom > inputRect.top &&
            batRect.top < inputRect.bottom
          ) {
            isColliding = true;
            // Only check labels if code has been validated
            if (codeValidated) {
              const inputId = input.id;
              const hasLabel = hasLabelForInput(inputId);

              if (hasLabel) {
                setIsValid("valid");
                const message =
                  inputId === "name"
                    ? "📢 Please enter your name"
                    : "📢 Please enter your email";
                setScreenReaderMessage(message);
              } else {
                setIsValid("invalid");
                setScreenReaderMessage("📢 Edit text, Edit text.");
              }
            } else {
              setIsValid("invalid");
              setScreenReaderMessage("📢 Edit text, Edit text.");
            }
            setTimeout(() => setScreenReaderMessage(""), 2000);
          }
        });

        if (!isColliding) {
          setIsValid("exploring");
        }
      }, 100);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [movementMode, code, codeValidated]);

  useEffect(() => {
    if (movementMode !== "random") return;

    const moveRandomly = () => {
      if (!rightPanelRef.current) return;

      const panel = rightPanelRef.current.getBoundingClientRect();
      const inputs = rightPanelRef.current.querySelectorAll("input");

      // 70% chance to move towards an input field
      if (Math.random() < 0.7) {
        // Randomly select one of the input fields
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        const inputRect = randomInput.getBoundingClientRect();

        // Calculate position near the input field
        // Add some random offset to make movement more natural
        const offsetX = (Math.random() - 0.5) * 100; // ±50px horizontally
        const offsetY = (Math.random() - 0.5) * 100; // ±50px vertically

        const newX = inputRect.left - panel.left + offsetX;
        const newY = inputRect.top - panel.top + offsetY;

        // Ensure the bat stays within bounds
        const boundedX = Math.max(0, Math.min(newX, panel.width - 128));
        const boundedY = Math.max(0, Math.min(newY, panel.height - 128));

        setBatPosition({ x: boundedX, y: boundedY });
      } else {
        // 30% chance to move completely randomly
        const newX = Math.random() * (panel.width - 128);
        const newY = Math.random() * (panel.height - 128);
        setBatPosition({ x: newX, y: newY });
      }

      setTimeout(() => {
        if (!batRef.current) return;
        const batRect = batRef.current.getBoundingClientRect();
        const inputs = rightPanelRef.current.querySelectorAll("input");

        let isColliding = false;
        inputs.forEach((input) => {
          const inputRect = input.getBoundingClientRect();
          if (
            batRect.right > inputRect.left &&
            batRect.left < inputRect.right &&
            batRect.bottom > inputRect.top &&
            batRect.top < inputRect.bottom
          ) {
            isColliding = true;
            // Only check labels if code has been validated
            if (codeValidated) {
              const inputId = input.id;
              const hasLabel = hasLabelForInput(inputId);

              if (hasLabel) {
                setIsValid("valid");
                // Check input id to determine correct message
                const message =
                  inputId === "name"
                    ? "📢 Please enter your name"
                    : "📢 Please enter your email";
                setScreenReaderMessage(message);
              } else {
                setIsValid("invalid");
                setScreenReaderMessage("📢 Edit text, Edit text.");
              }
            } else {
              setIsValid("invalid");
              setScreenReaderMessage("📢 Edit text, Edit text.");
            }
            setTimeout(() => setScreenReaderMessage(""), 2000);
          }
        });

        if (!isColliding) {
          setIsValid("exploring");
        }
      }, 100);
    };

    const interval = setInterval(moveRandomly, 3000);
    return () => clearInterval(interval);
  }, [code, codeValidated, movementMode]);

  const validateCode = () => {
    const hasNameLabel = hasLabelForInput("name");
    const hasEmailLabel = hasLabelForInput("email");
    setCodeValidated(true);
    if (hasNameLabel && hasEmailLabel) {
      setIsValid("exploring");
    } else {
      setIsValid("invalid");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center relative">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pt-8 mb-4">
            Echoes of Accessibility: 🦇 Help Blinky "See" the Form!
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Bats use echolocation—sending out sound waves and listening for
            echoes—to navigate the dark. 🦇 Blinky is no different! But instead
            of sound waves, he uses a screen reader to "See" the form.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)]">
          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700 h-full">
            <div className="p-6">
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed pb-4">
                Right now, Blinky's echoes aren't bouncing back because the form
                is missing labels—just like how a bat would be lost in total
                silence. Help Blinky find his way!
              </p>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed pb-4">
                Use the{" "}
                <code className="text-yellow-400 font-mono">&lt;label&gt;</code>{" "}
                element to explicitly associate text with form inputs. The{" "}
                <code className="text-yellow-400 font-mono">for</code> attribute
                must match the input's{" "}
                <code className="text-yellow-400 font-mono">id</code>.
              </p>
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
                      form.html
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <textarea
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeValidated(false);
                    }}
                    className="w-full h-40 bg-transparent text-green-400 font-mono text-sm focus:outline-none"
                    spellCheck="false"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={validateCode}
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Run Code
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setCode(initialCode);
                      setCodeValidated(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg 
                      transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg 
                      hover:shadow-gray-500/25 active:scale-[0.98]"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
                  <span className="text-gray-300">Blinky's Movement Mode:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMovementMode("random")}
                      className={`px-4 py-2 rounded-l-lg transition-all duration-200 ${
                        movementMode === "random"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      🍭 Random
                    </button>
                    <button
                      onClick={() => setMovementMode("follow")}
                      className={`px-4 py-2 rounded-r-lg transition-all duration-200 ${
                        movementMode === "follow"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      👇 Follow Cursor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700 h-full">
            <div className="relative h-full">
              <div
                ref={rightPanelRef}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                {/* Night Animation Background */}
                <div className="absolute inset-0 bg-[#042330]">
                  {isClient && (
                    <Lottie
                      animationData={nightAnimation}
                      loop
                      style={{
                        position: "absolute",
                        top: "-100%",
                        left: "-100%",
                        width: "300%",
                        height: "300%",
                        pointerEvents: "none",
                        opacity: 0.8,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                {/* Form Preview */}
                <div className="relative z-10 w-64 space-y-28 mb-8">
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2 rounded border border-gray-300 bg-white/90"
                  />
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 rounded border border-gray-300 bg-white/90"
                  />
                </div>

                {/* Bat Animation */}
                {isClient && batPosition && (
                  <div
                    ref={batRef}
                    style={{
                      position: "absolute",
                      left: `${batPosition.x}px`,
                      top: `${batPosition.y}px`,
                      transition: "all 1.5s ease-in-out",
                      zIndex: 20,
                    }}
                  >
                    <BatAnimation
                      isValid={isValid}
                      message={screenReaderMessage}
                    />
                  </div>
                )}

                {/* Status Message - Now at the bottom */}
                <div className="absolute bottom-4 left-0 right-0 mx-auto w-max bg-black rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    {isValid === "valid"
                      ? "✅ Blinky can now read the form!"
                      : isValid === "invalid"
                      ? "⚠️ Blinky is confused! Add <label> tags to help Blinky."
                      : "🦇 Blinky is exploring the form..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replace the checkbox with this toggle button */}
      </div>
    </div>
  );
}
