"use client";

import React, { useEffect } from "react";
import Lottie from "lottie-react";
import batFlyingAnimation from "../../../public/FlyingBat.json";

const BatAnimation = ({ isValid, message }) => {
  useEffect(() => {
    // Simple speak function
    const speak = (text) => {
      // Cancel any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Log for debugging
      console.log("Speaking:", text);

      // Speak immediately
      window.speechSynthesis.speak(utterance);
    };

    if (message) {
      // Remove emoji and clean the message
      const cleanMessage = message.replace(/📢/g, "").trim();
      speak(cleanMessage);
    }
  }, [message]);

  const getAnimationStyle = () => {
    switch (isValid) {
      case "valid":
        return "translate-y-0 opacity-100";
      case "invalid":
        return "translate-y-4 opacity-50";
      case "exploring":
      default:
        return "translate-y-2 opacity-75";
    }
  };

  const getMessage = () => {
    switch (isValid) {
      case "valid":
        return "🦇 Blinky understands the form!";
      case "invalid":
        return "🦇 Blinky is confused... Help him!";
      case "exploring":
      default:
        return "🦇 Blinky is exploring...";
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <Lottie
        animationData={batFlyingAnimation}
        loop
        className={`w-32 transition-transform ${getAnimationStyle()}`}
      />
      <p className="text-sm mt-2 text-gray-700">{getMessage()}</p>
    </div>
  );
};

export default BatAnimation;
