"use client";

import React from "react";
import Lottie from "lottie-react";
import turtleAnimationData from "./../../public/Turtle.json"; // Replace with actual turtle animation

const TurtleAnimation = () => {
  return (
    <Lottie
      animationData={turtleAnimationData}
      loop
      autoplay
      className="w-24 h-24 absolute top-0 left-10"
    />
  );
};

export default TurtleAnimation;
