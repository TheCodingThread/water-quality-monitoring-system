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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  Delhi: [28.6139, 77.209],
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
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/sensor-data`)
        .then((res) => res.json())
        .then(setData)
        .catch(console.error);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter((item) => {
    const cityMatch =
      selectedCity === "All" || item.location === selectedCity;
    const statusMatch =
      selectedStatus === "All" || item.status === selectedStatus;
    return cityMatch && statusMatch;
  });

  const chartData = {
    labels: filteredData.map((d) =>
      new Date(d.timestamp).toLocaleTimeString()
    ),
    datasets: [
      { label: "pH", data: filteredData.map((d) => d.pH), borderColor: "blue" },
      { label: "TDS", data: filteredData.map((d) => d.tds), borderColor: "green" },
      { label: "Turbidity", data: filteredData.map((d) => d.turbidity), borderColor: "red" },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Water Quality Monitoring Dashboard</h2>

      {/* Filters Card */}
      <div className="card">
        <h3>Filters</h3>
        <label>City: </label>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          <option>All</option>
          <option>Jaipur</option>
          <option>Delhi</option>
          <option>Ajmer</option>
          <option>Udaipur</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Status: </label>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option>All</option>
          <option>SAFE</option>
          <option>UNSAFE</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="card">
        <h3>Live Water Data</h3>
        <table>
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
            {filteredData.map((d) => (
              <tr key={d._id}>
                <td>{d.location}</td>
                <td>{d.pH}</td>
                <td>{d.tds}</td>
                <td>{d.turbidity}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      background: d.status === "SAFE" ? "#e6f4ea" : "#fdecea",
                      color: d.status === "SAFE" ? "#2e7d32" : "#c62828",
                      fontWeight: "bold",
                    }}
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Card */}
      <div className="card">
        <h3>Water Quality Trends</h3>
        <Line data={chartData} />
      </div>

      {/* Map Card */}
      <div className="card">
        <h3>Geographic Monitoring</h3>
        <MapContainer
          center={[26.9124, 75.7873]}
          zoom={6}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredData.map((d) =>
            cityCoordinates[d.location] ? (
              <Marker
                key={d._id}
                position={cityCoordinates[d.location]}
                icon={d.status === "SAFE" ? greenIcon : redIcon}
              >
                <Popup>
                  {d.location} – {d.status}
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
