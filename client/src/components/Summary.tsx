import React, { useState, useEffect } from "react";

const colors = [
  "#3deccf",
  "#7ae24a",
  "#b4e24a",
  "#b3d487",
  "#b39f7a",
  "#f0d29b",
  "#f8bc4c",
  "#f8664c",
];

interface IPoint {
  x: number;
  y: number;
  c: string;
}

const getColor = (y: number) => {
  const min = 10;
  const max = 90;
  const gaps = 8;
  const size = (max - min) / gaps;
  const ny = Math.min(Math.max(y, min), max);
  const index = Math.floor((ny - min) / size);
  return colors[index];
};

const Summary: React.FC = () => {
  const [points, setPoints] = useState<IPoint[]>();

  useEffect(() => {
    const tPoints = [15, 25, 35, 45].map((y) => {
      return { x: 45, y, c: getColor(y) };
    });

    setPoints(tPoints);
  }, []);

  return (
    <div className="summary">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
            fill="white"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>

          <clipPath id="round-corner-top">
            <rect x="20" y="10" width="60" height="13" rx="3" ry="3" />
          </clipPath>
          <clipPath id="round-corner-bottom">
            <rect x="20" y="77" width="60" height="13" rx="3" ry="3" />
          </clipPath>
        </defs>

        {[
          { y: 10, c: "#3deccf", clipPath: "url(#round-corner-top)" },
          { y: 20, c: "#7ae24a" },
          { y: 30, c: "#b4e24a" },
          { y: 40, c: "#b3d487" },
          { y: 50, c: "#b39f7a" },
          { y: 60, c: "#f0d29b" },
          { y: 70, c: "#f8bc4c" },
          { y: 80, c: "#f8664c", clipPath: "url(#round-corner-bottom)" },
        ].map(({ y, c, clipPath }) => (
          <>
            <rect
              x="20"
              y={y}
              width="60"
              height="10"
              fill={`${c}3f`}
              strokeWidth="0"
              clipPath={clipPath}
            />
            <text text-anchor="end" x="15" y={y + 7} fill={c}>
              {0}
            </text>
            <text x="85" y={y + 7} fill={c}>
              {0}
            </text>
          </>
        ))}

        {points?.map((p) => (
          <circle
            cx={p.x}
            cy={p.y}
            r="1.2"
            fill={p.c}
            style={{ cursor: "pointer" }}
          />
        ))}

        <line
          x1="50"
          y1="8"
          x2="50"
          y2="92"
          stroke="white"
          strokeWidth="0.5"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
      </svg>
    </div>
  );
};

export default Summary;
