import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import styles from "./PieChart.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const { presentCount, absentCount } = props;

  const options = {
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
  };

  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance Analysis",
        data: [presentCount, absentCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.piechartContainer}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
