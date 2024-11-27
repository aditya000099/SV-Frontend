import React, { useRef, useEffect } from "react";
import { AnimatedBeam } from "./AnimatedBeams"; // Assuming the AnimatedBeam is already implemented

function BrainWireEffect() {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const innerCircleRefs = Array.from({ length: 6 }, () => useRef(null)); // Inner circle points
  const outerCircleRefs = Array.from({ length: 6 }, () => useRef(null)); // Outer circle points

  useEffect(() => {
    const container = containerRef.current;
    const center = centerRef.current;

    if (container && center) {
      const containerRect = container.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();

      const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
      const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

      const innerRadius = 120; // Radius of the inner circle
      const outerRadius = 180; // Radius of the outer circle

      // Position points in a circular pattern for inner and outer circles
      const positionPoints = (refs, radius) => {
        refs.forEach((ref, index) => {
          const angle = (2 * Math.PI * index) / refs.length; // Full circle
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const element = ref.current;
          if (element) {
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
          }
        });
      };

      positionPoints(innerCircleRefs, innerRadius);
      positionPoints(outerCircleRefs, outerRadius);
    }
  }, [innerCircleRefs, outerCircleRefs]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center w-full h-screen overflow-hidden ray-100"
    >
      {/* Central Image */}
      <div
        ref={centerRef}
        className="relative z-20 flex items-center justify-center w-40 h-40 bg-transparent"
      >
        <img
          src="./svlogo.png"
          alt="Brain"
          className="w-40 h-40 object-cover rounded-full shadow-lg"
        />
      </div>

      {/* Invisible circles for inner and outer points */}
      {innerCircleRefs.map((ref, index) => (
        <div
          key={`inner-circle-${index}`}
          ref={ref}
          className="absolute w-2 h-2 bg-transparent"
        />
      ))}
      {outerCircleRefs.map((ref, index) => (
        <div
          key={`outer-circle-${index}`}
          ref={ref}
          className="absolute w-2 h-2 bg-transparent"
        />
      ))}

      {/* Animated Beams between inner and outer circles */}
      {innerCircleRefs.map((innerRef, index) => (
        <AnimatedBeam
          key={`beam-inner-${index}`}
          containerRef={containerRef}
          fromRef={innerRef}
          toRef={outerCircleRefs[index % outerCircleRefs.length]} // Match inner and outer points
          curvature={index % 2 === 0 ? 30 : -30} // Alternate curvature
          duration={4 + Math.random()} // Slight randomization
          gradientStartColor="#ffaa40"
          gradientStopColor="#4080ff"
        />
      ))}
    </div>
  );
}

export default BrainWireEffect;
