import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function App() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://water-quality-monitoring-system-sqag.onrender.com/api/sensor-data"
        );

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "#f5f7fb";
      document.body.style.color = "black";
    }
  }, [darkMode]);

  const chartData = {
    labels: data.map((d) =>
      new Date(d.timestamp).toLocaleTimeString()
    ),

    datasets: [
      {
        label: "pH",
        data: data.map((d) => d.pH),
        borderColor: "blue",
      },

      {
        label: "TDS",
        data: data.map((d) => d.tds),
        borderColor: "green",
      },

      {
        label: "Turbidity",
        data: data.map((d) => d.turbidity),
        borderColor: "red",
      },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f7fb",
        color: darkMode ? "white" : "black",
      }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px",
          backgroundColor: darkMode ? "#333" : "#1976d2",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>🚰 LIVE Water Quality Monitoring Dashboard</h1>

      <div
        style={{
          background: darkMode ? "#1e1e1e" : "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h2>Live Sensor Data</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Location</th>
              <th>pH</th>
              <th>TDS</th>
              <th>Turbidity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d._id}>
                <td>{d.location}</td>
                <td>{d.pH}</td>
                <td>{d.tds}</td>
                <td>{d.turbidity}</td>

                <td
                  style={{
                    color:
                      d.status === "SAFE"
                        ? "limegreen"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {d.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: darkMode ? "#1e1e1e" : "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "30px",
        }}
      >
        <h2>Water Quality Trends</h2>

        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;