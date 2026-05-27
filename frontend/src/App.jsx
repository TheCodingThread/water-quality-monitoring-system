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

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const cityCoordinates = {
  Jaipur: [26.9124, 75.7873],
  Delhi: [28.6139, 77.2090],
  Ajmer: [26.4499, 74.6399],
  Udaipur: [24.5854, 73.7125],
};

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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
          <thead
  style={{
    backgroundColor: "#1976d2",
    color: "white",
  }}
>
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
    <tr
      key={d._id}
      style={{
        backgroundColor: darkMode
          ? "#1e1e1e"
          : "white",

        color: darkMode
          ? "white"
          : "black",
      }}
    >
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

      <div
  style={{
    background: darkMode ? "#1e1e1e" : "white",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "30px",
  }}
>
  <h2>Geographic Monitoring</h2>

  <MapContainer
    center={[26.9124, 75.7873]}
    zoom={6}
    style={{
      height: "400px",
      width: "100%",
      borderRadius: "12px",
    }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {data.map((d) =>
      cityCoordinates[d.location] ? (
        <Marker
          key={d._id}
          position={cityCoordinates[d.location]}
          icon={
            d.status === "SAFE"
              ? greenIcon
              : redIcon
          }
        >
          <Popup>
            {d.location} - {d.status}
          </Popup>
        </Marker>
      ) : null
    )}
  </MapContainer>
</div>
    </div>
  );
}

export default App;