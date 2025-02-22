"use client";

import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import chroma from "chroma-js";
import animationData from "./../../public/RunningChameleon.json";

const ChameleonAnimation = ({ color }) => {
  // const [Lottie, setLottie] = useState(null);

  const [modifiedAnimation, setModifiedAnimation] = useState(animationData);

  // useEffect(() => {
  //   import("lottie-react").then((module) => setLottie(() => module.default));
  // }, []);

  useEffect(() => {
    if (!color) return;

    // Deep clone JSON to avoid mutating the original
    const newAnimation = JSON.parse(JSON.stringify(animationData));

    // Function to update only the chameleon's body and tail color
    function updateColor(obj, newColor) {
      if (
        obj.nm &&
        (obj.nm.includes("Group 5") ||
          obj.nm.includes("Group 1") ||
          obj.nm.includes("Group 2"))
      ) {
        // Ensure only the body and tail layers are updated
        if (obj.it) {
          obj.it.forEach((shape) => {
            if (shape.ty === "fl" && shape.c && shape.c.k) {
              shape.c.k = chroma(newColor)
                .rgb()
                .map((v) => v / 255); // Convert color to normalized RGB array
            }
          });
        }
      }
      if (obj.it) obj.it.forEach((child) => updateColor(child, newColor)); // Recursively update nested layers
    }

    newAnimation.layers.forEach((layer) => {
      if (layer.nm) {
        if (layer.shapes) {
          layer.shapes.forEach((shape) => updateColor(shape, color));
        }
      }
    });

    setModifiedAnimation(newAnimation);
  }, [color]);

  // if (!Lottie) return null;

  return <Lottie animationData={modifiedAnimation} loop autoplay />;
};

export default ChameleonAnimation;
