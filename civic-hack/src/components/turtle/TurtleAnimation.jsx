"use client";

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../../../public/Turtle.json';

export default function TurtleAnimation() {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!animationRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute top-6 right-6 w-32 h-32" />
  );
}
