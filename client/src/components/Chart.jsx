import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";

const data = {
  labels: [],
  datasets: [
    {
      label: "Evaluation",
      data: [],
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

const EvalChart = ({ scores }) => {
  const [chart, setChart] = useState();

  useEffect(() => {
    Chart.register(...registerables);
    const ctx = document.getElementById("eval-chart-canvas").getContext("2d");
    setChart(
      new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      })
    );
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.data.datasets[0].data = scores;
    chart.data.labels = scores.map((_, i) => i);
    chart.update();
  }, [scores, chart]);

  return (
    <div className="eval-chart">
      <canvas id="eval-chart-canvas"></canvas>
    </div>
  );
};

export default EvalChart;
