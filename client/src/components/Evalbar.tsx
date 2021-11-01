import React, { useState, useEffect } from "react";

interface IEvalbar {
  evaluation: number;
}

interface IColor {
  up: string;
  down: string;
  upBackground: string;
  downBackground: string;
}

interface IPercentage {
  p: number;
  e: string | number;
}

const Evalbar: React.FC<IEvalbar> = ({ evaluation }) => {
  const [percentage, setPercentage] = useState<IPercentage>({
    p: 0.5,
    e: 0,
  });
  const [color, setColor] = useState<IColor>({
    up: "#ddd",
    down: "#101010",
    upBackground: "#101010",
    downBackground: "#ddd",
  });

  useEffect(() => {
    const e = (evaluation / 10) * 0.5;
    const a = Math.min(Math.max(e, -0.5), 0.5);

    setPercentage({
      p: 0.5 + a,
      e: evaluation >= 10 ? Math.round(evaluation) : evaluation.toFixed(1),
    });
  }, [evaluation]);

  return (
    <div className="evalbar">
      <div
        className="evalbar-up"
        style={{
          height: `${100 * (1 - percentage.p)}%`,
          backgroundColor: color.upBackground,
          color: color.up,
        }}
      >
        <span>{evaluation < 0 ? percentage.e : ""}</span>
      </div>
      <div
        className="evalbar-down"
        style={{
          height: `${100 * percentage.p}%`,
          backgroundColor: color.downBackground,
          color: color.down,
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
        }}
      >
        <span>{evaluation >= 0 ? percentage.e : ""}</span>
      </div>
    </div>
  );
};

export default Evalbar;
