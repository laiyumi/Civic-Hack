"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import batFlyingAnimation from "../../../public/FlyingBat.json";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
        return "translate-y-0 scale-110 animate-[scale_2s_ease-in-out_infinite]";
      case "invalid":
        return "translate-y-4 scale-75";
      case "exploring":
      default:
        return "translate-y-2 scale-90";
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
    </div>
  );
};

export default BatAnimation;
