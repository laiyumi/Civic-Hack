"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ScreenReaderSimulator from "@/components/bat/ScreenReaderSimulator";
import BatAnimation from "@/components/bat/BatAnimation";

const initialCode = `<form>
  <input type="text" id="name" placeholder="Your name">
  <input type="email" id="email" placeholder="Your email">
</form>`;

export default function FormLabelsGame() {
  const [code, setCode] = useState(initialCode);
  const [isValid, setIsValid] = useState("exploring");
  const [codeValidated, setCodeValidated] = useState(false);
  const [batPosition, setBatPosition] = useState({ x: 0, y: 0 });
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const rightPanelRef = useRef(null);
  const batRef = useRef(null);

  const hasLabelForInput = (inputId) => {
    const labelRegex = new RegExp(`<label[^>]*for=["']${inputId}["'][^>]*>`);
    return labelRegex.test(code);
  };

  useEffect(() => {
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
  }, [code, codeValidated]);

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
    <div className="flex h-screen bg-purple-100 p-5">
      {/* Left Panel - Code Editor */}
      <div className="w-1/2 bg-gray-900 text-white p-5 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-3">
          Help Blinky the Bat Navigate the Form!
        </h2>
        <p className="text-sm mb-3">
          Blinky, the screen reader bat, is struggling to understand this form.
          Add labels so Blinky can "see" the fields properly.
        </p>
        <textarea
          className="w-full h-40 p-3 bg-gray-800 text-green-300 font-mono text-sm rounded-md"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setCodeValidated(false);
          }}
        />
        <button
          onClick={validateCode}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Run Code
        </button>
        <p className="mt-3 text-yellow-300">
          {!codeValidated
            ? "🦇 Click 'Run Code' to check your labels!"
            : isValid === "valid"
            ? "✅ Blinky can now read the form!"
            : isValid === "invalid"
            ? "⚠️ Blinky is confused! Add <label> tags."
            : "🦇 Blinky is exploring the form..."}
        </p>
      </div>

      {/* Right Panel */}
      <div
        ref={rightPanelRef}
        className="w-1/2 flex flex-col items-center justify-center relative p-8"
      >
        {/* Input Elements */}
        <div className="absolute top-48 flex flex-col gap-48 w-80">
          <input
            type="text"
            id="name"
            // placeholder="Name"
            className="p-2 border rounded-md"
          />
          <input
            type="email"
            id="email"
            // placeholder="Email"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Bat Animation */}
        <div
          ref={batRef}
          style={{
            position: "absolute",
            left: `${batPosition.x}px`,
            top: `${batPosition.y}px`,
            transition: "all 1.5s ease-in-out",
          }}
        >
          <BatAnimation isValid={isValid} message={screenReaderMessage} />
        </div>

        {screenReaderMessage && (
          <div className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-md">
            {screenReaderMessage}
          </div>
        )}

        {/* <div className="absolute bottom-4">
          <ScreenReaderSimulator isValid={isValid} />
        </div> */}
      </div>
    </div>
  );
}
