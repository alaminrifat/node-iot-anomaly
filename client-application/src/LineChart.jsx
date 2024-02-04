import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data }) => {
  const chartData = {
    labels: data?.map((entry) => entry.createdAt),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data?.map((entry) => parseFloat(entry.temp_c)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Humidity (%)",
        data: data?.map((entry) => parseFloat(entry.humidity)),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Temperature and Humidity Over Time",
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default LineChart;
