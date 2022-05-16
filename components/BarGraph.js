import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = (props) => {
  const { labels, datasets } = props;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#bcccdc",
        },
      },
      title: {
        display: true,
        text: "Attendance Analysis",
        color: "#bcccdc",
      },
    },
    // down
    scales: {
      y: {
        ticks: {
          color: "#bcccdc",
        },
        grid: {
          color: "#334e68",
        },
      },
      x: {
        ticks: {
          color: "#bcccdc",
        },
      },
    },
    // up
  };

  const data = {
    labels,
    datasets,
  };

  return <Bar options={options} data={data} />;
};

export default BarGraph;
