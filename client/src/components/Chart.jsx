import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";

const data = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "test",
      data: [12, -19, 3, 5, 2, 3],
      fill: {
        target: "origin",
        above: "rgba(255, 255, 255, 0.5)", // Area will be red above the origin
        below: "rgba(0, 0, 0, 0.5)", // And blue below the origin
      },
      borderColor: "rgba(255, 255, 255, 0.8)",
      borderWidth: 1,
      lineTension: 0.2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const CustomChart = ({ x, y }) => {
  const [ctx, setCtx] = useState();
  const [chart, setChart] = useState();

  useEffect(() => {
    Chart.register(...registerables);
    setCtx(document.getElementById("eval-chart-canvas").getContext("2d"));
  }, []);

  useEffect(() => {
    if (!ctx) return;

    if (chart) {
      chart.destroy();
    }

    setChart(
      new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      })
    );
  }, [x, y]);

  return (
    <div className="eval-chart">
      <canvas id="eval-chart-canvas"></canvas>
    </div>
  );
};

export default CustomChart;
