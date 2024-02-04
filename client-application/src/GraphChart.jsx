import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GraphChart = ({ data }) => {
  const last50Data = data?.slice(-300); // Extract the last 50 entries

  const formattedData = last50Data?.map((item) => ({
    name: new Date(item.createdAt).toLocaleTimeString(), // You can format the time as per your preference
    humidity: parseFloat(item.humidity),
    temp_c: parseFloat(item.temp_c),
    temp_f: parseFloat(item.temp_f),
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#8884d8"
          name="Humidity"
        />
        <Line
          type="monotone"
          dataKey="temp_c"
          stroke="#82ca9d"
          name="Temperature (C)"
        />
        <Line
          type="monotone"
          dataKey="temp_f"
          stroke="#ffc658"
          name="Temperature (F)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraphChart;
