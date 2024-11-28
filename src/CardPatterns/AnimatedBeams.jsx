import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const AnimatedBeam = ({
  containerRef,
  curvature = 0,
  duration = 3,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientColors = [
    { start: "#ffaa40", stop: "#9c40ff" },
    { start: "#40ffaa", stop: "#ff40aa" },
    { start: "#aa40ff", stop: "#40aaff" },
  ],
}) => {
  const [paths, setPaths] = useState([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const generateInfinityPath = (centerX, centerY, a, b) => {
      const pathData = Array.from({ length: 360 }) // Smooth curve with points
        .map((_, i) => {
          const t = (i / 360) * 2 * Math.PI;
          const x = centerX + a * Math.cos(t);
          const y = centerY + b * Math.sin(2 * t);
          return `${x},${y}`;
        })
        .join(" ");
      return `M ${pathData}`;
    };

    const generatePaths = () => {
      const { width, height } = svgDimensions;
      const centerX = width / 2;
      const centerY = height / 2;

      // Define sizes for three infinity shapes
      const sizes = [
        { a: 150, b: 75 }, // Main infinity
        { a: 130, b: 65 }, // Inner infinity
        { a: 110, b: 55 }, // Smallest infinity
      ];

      return sizes.map((size) =>
        generateInfinityPath(centerX, centerY, size.a*1.75, size.b*1.75)
      );
    };

    setPaths(generatePaths());
  }, [svgDimensions]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSvgDimensions({ width: rect.width, height: rect.height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <svg
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-0 top-0 pointer-events-none"
    >
      {paths.map((pathD, index) => {
        const gradientId = `gradient-${index}`;
        return (
          <g key={index}>
            <path
              d={pathD}
              stroke={pathColor}
              strokeWidth={pathWidth}
              strokeOpacity={pathOpacity}
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d={pathD}
              stroke={`url(#${gradientId})`}
              strokeWidth={pathWidth}
              strokeOpacity="1"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                delay: index * 0.5, // Stagger the animations
                duration: duration + index, // Vary duration for each infinity
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                repeatDelay: 0,
              }}
            />
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0%"
                x2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={gradientColors[index].start}
                  stopOpacity="0"
                ></stop>
                <stop offset="50%" stopColor={gradientColors[index].start}></stop>
                <stop offset="75%" stopColor={gradientColors[index].stop}></stop>
                <stop
                  offset="100%"
                  stopColor={gradientColors[index].stop}
                  stopOpacity="0"
                ></stop>
              </linearGradient>
            </defs>
          </g>
        );
      })}
    </svg>
  );
};

export default AnimatedBeam;
