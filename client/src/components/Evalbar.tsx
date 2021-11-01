import React, { useState, useEffect } from "react";

export interface IScore {
  score: number;
  mate: string | undefined;
}

interface IEvalbar {
  evaluation: IScore;
}

interface IColor {
  up: string;
  down: string;
  upBackground: string;
  downBackground: string;
}

interface IBar {
  percentage: number;
  evaluation: string | number;
}

const Evalbar: React.FC<IEvalbar> = ({ evaluation }) => {
  const [bar, setBar] = useState<IBar>({
    percentage: 0.5,
    evaluation: 0,
  });
  const [color, setColor] = useState<IColor>({
    up: "#ddd",
    down: "#101010",
    upBackground: "#101010",
    downBackground: "#ddd",
  });

  useEffect(() => {
    const e = (evaluation.score / 10) * 0.5;
    const a = Math.min(Math.max(e, -0.5), 0.5);
    const mate = evaluation.mate?.startsWith("-")
      ? evaluation.mate.substring(1)
      : evaluation.mate;

    let tEvaluation = "";
    if (evaluation.mate) tEvaluation = `M${mate}`;
    else if (evaluation.score >= 10)
      tEvaluation = Math.round(evaluation.score).toString();
    else tEvaluation = evaluation.score.toFixed(1);

    setBar({
      percentage: 0.5 + a,
      evaluation: tEvaluation,
    });
  }, [evaluation]);

  return (
    <div className="evalbar">
      <div
        className="evalbar-up"
        style={{
          height: `${100 * (1 - bar.percentage)}%`,
          backgroundColor: color.upBackground,
          color: color.up,
        }}
      >
        <span>{evaluation.score < 0 ? bar.evaluation : ""}</span>
      </div>
      <div
        className="evalbar-down"
        style={{
          height: `${100 * bar.percentage}%`,
          backgroundColor: color.downBackground,
          color: color.down,
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
        }}
      >
        <span>{evaluation.score >= 0 ? bar.evaluation : ""}</span>
      </div>
    </div>
  );
};

export default Evalbar;
