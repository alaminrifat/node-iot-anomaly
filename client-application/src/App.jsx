import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import GraphChart from "./GraphChart";

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loopCount = 20;

  // Create an array with the specified length
  const tdArray = new Array(loopCount).fill(null);
  // Define the number of times to loop

  // Array to store the generated <td> elements
  const tdElements = [];

  // Use a for loop to generate the <td> elements
  for (let i = 0; i < loopCount; i++) {
    tdElements.push(<td key={i} className="border p-2"></td>);
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://192.168.0.107:3000/api/keypad");
      const jsonData = await response.json();
      setData(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000);
    return () => clearInterval(intervalId);
  }, []);
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });
  };
  console.log(data?.data);
  return (
    <div className="container mx-auto mt-8 bg-gray-100 p-4">
      <div className="p-2 mt-1 flex flex-row align-center justify-between mb-1">
        <h1 className="text-3xl font-bold mb-4">
          Total data = {isLoading ? "Loading New data ..." : data?.totalData}
        </h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Download Data
        </button>
      </div>
      {/* <LineChart data={data?.data} /> */}
      <GraphChart data={data?.data} />
      {data?.data && (
        <table className="min-w-full border bg-white">
          <thead>
            <tr>
              <th className="border p-2">Temperature (C)</th>
              <th className="border p-2">Temperature (F)</th>
              <th className="border p-2">Humidity</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? tdArray.map((_, index) => (
                  <tr key={index}>
                    <td key={index} className="border p-2">
                      Loading...
                    </td>
                    <td key={index} className="border p-2">
                      Loading...
                    </td>
                    <td key={index} className="border p-2">
                      Loading...
                    </td>
                    <td key={index} className="border p-2">
                      Loading...
                    </td>
                  </tr>
                ))
              : data.data
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td className="border p-2">{item.temp_c}</td>
                      <td className="border p-2">{item.temp_f}</td>
                      <td className="border p-2">{item.humidity}</td>
                      <td className="border p-2">
                        {formatTimestamp(item.createdAt)}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
