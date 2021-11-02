import React, { useState, useEffect } from "react";

const colors = ["green", "yellow", "red", "orange"];

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
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="black"
          strokeWidth="0.5"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />

        {[20, 30, 40, 50, 60, 70, 80].map((y) => (
          <line
            x1="20"
            y1={y}
            x2="80"
            y2={y}
            stroke="#202020"
            strokeWidth="0.5"
          />
        ))}

        {points?.map((p) => (
          <circle
            cx={p.x}
            cy={p.y}
            r="1"
            fill="none"
            stroke={p.c}
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
};

export default Summary;
