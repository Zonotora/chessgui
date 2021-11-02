import React, { useEffect, useState } from "react";
import { Chart, registerables, LineController } from "chart.js";

class LineWithLine extends LineController {
  draw = () => {
    super.draw();

    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      const activePoint = this.chart.tooltip._active[0],
        ctx = this.chart.ctx,
        x = activePoint.element.x,
        topY = this.chart.legend.bottom,
        bottomY = this.chart.chartArea.bottom;

      // draw line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.restore();
    }
  };
}
LineWithLine.id = "lineWithLine";
LineWithLine.defaults = LineController.defaults;
Chart.register(LineWithLine);

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
      pointBackgroundColor: "black",
      pointRadius: 0,
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
  scales: {
    y: {
      min: -20,
      max: 20,
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
};

const click = (chart, selected) => {
  if (!chart) return;
  const meta = chart.getDatasetMeta(0);
  if (!meta.data[selected]) return;
  const x = meta.data[selected].x;
  const y = meta.data[selected].y;

  const canvas = chart.canvas;

  const bounds = canvas.getBoundingClientRect();
  const mouseX = Math.round(
    (((bounds.left + x) / (bounds.right - bounds.left)) * canvas.width) /
      chart.currentDevicePixelRatio
  );
  const mouseY = Math.round(
    (((bounds.top + y) / (bounds.bottom - bounds.top)) * canvas.height) /
      chart.currentDevicePixelRatio
  );

  const event = new MouseEvent("click", {
    screenX: mouseX,
    screenY: mouseY,
    clientX: mouseX,
    clientY: mouseY,
  });
  canvas.dispatchEvent(event);
};

const EvalChart = ({ scores, onClick, selected }) => {
  const [chart, setChart] = useState();

  useEffect(() => {
    Chart.register(...registerables);
    const canvas = document.getElementById("eval-chart-canvas");

    const ctx = canvas.getContext("2d");
    const c = new Chart(ctx, {
      type: "lineWithLine",
      data: data,
      options: {
        ...options,
        onClick: (e, a) => {
          onClick(a[0].index);
        },
      },
    });
    setChart(c);
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.data.datasets[0].data = scores;
    chart.data.labels = scores.map((_, i) => i);
    chart.update();
  }, [scores, chart]);

  useEffect(() => {
    click(chart, selected);
  }, [selected]);

  return (
    <div className="eval-chart">
      <canvas
        id="eval-chart-canvas"
        onMouseLeave={() => click(chart, selected)}
      ></canvas>
    </div>
  );
};

export default EvalChart;
