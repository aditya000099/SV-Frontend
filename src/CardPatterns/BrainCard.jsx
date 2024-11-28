import React, { useEffect, useState, useRef } from "react";
import AnimatedBeam from "../CardPatterns/AnimatedBeams";

function BrainWireEffect() {
  const [paths, setPaths] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    const generateInfinityPath = (scale, centerX, centerY) => {
      const a = 120 * scale; // Horizontal scaling
      const b = 60 * scale; // Vertical scaling

      const pathData = Array.from({ length: 500 }) // More points for smoothness
        .map((_, i) => {
          const t = (i / 500) * 2 * Math.PI; // Divide the circle into small segments
          const x = centerX + a * Math.cos(t);
          const y = centerY + b * Math.sin(2 * t); // Key to making the infinity shape
          return `${x},${y}`;
        })
        .join(" ");

      return pathData;
    };

    const centerX = 250; // Center of the container
    const centerY = 250;

    // Generate multiple infinity symbols with scaling
    const lines = [1, 1.3, 1.6].map((scale) =>
      generateInfinityPath(scale, centerX, centerY)
    );

    setPaths(lines);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400px]">
  <AnimatedBeam
    containerRef={containerRef}
    duration={10}
    pathColor="#ccc"
    gradientStartColor="#ffaa40"
    gradientStopColor="#9c40ff"
  />
  <div className="absolute sm:ml-8 sm:mt-3 z-10 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-zinc-500/30 to-purple-500/30 backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="absolute w-20 h-20 rounded-full bg-zinc-900/10 animate-pulse" />
    <img
      src="./svlogo.png"
      alt="Logo"
      className="w-16 h-16 object-contain"
    />
  </div>
</div>


  );
}

export default BrainWireEffect;


