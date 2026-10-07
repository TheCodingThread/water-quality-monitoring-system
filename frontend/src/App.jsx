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

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Line } from "react-chartjs-2";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import SystemStatus from "./components/SystemStatus";
import Analytics from "./pages/Analytics";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
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

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function App() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a new simulated sensor reading
        await fetch(
          "https://water-quality-monitoring-system-sqag.onrender.com/api/sensor-data",
          {
            method: "POST",
          },
        );

        // Fetch existing sensor readings
        const response = await fetch(
          "https://water-quality-monitoring-system-sqag.onrender.com/api/sensor-data",
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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Find the latest reading for each location
  const latestByLocation = Object.values(
    data.reduce((locations, reading) => {
      const existing = locations[reading.location];

      if (
        !existing ||
        new Date(reading.timestamp) > new Date(existing.timestamp)
      ) {
        locations[reading.location] = reading;
      }

      return locations;
    }, {}),
  );

  const safeLocations = latestByLocation
    .filter((reading) => reading.status === "SAFE")
    .map((reading) => reading.location)
    .sort();

  const unsafeLocations = latestByLocation
    .filter((reading) => reading.status === "UNSAFE")
    .map((reading) => reading.location)
    .sort();

  const chartData = {
    labels: data
      .map((d) => new Date(d.timestamp).toLocaleTimeString())
      .reverse(),

    datasets: [
      {
        label: "pH",
        data: [...data].reverse().map((d) => d.pH),

        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",

        borderWidth: 2,

        pointRadius: 2,
        pointHoverRadius: 5,

        tension: 0.35,

        yAxisID: "quality",
      },

      {
        label: "TDS",
        data: [...data].reverse().map((d) => d.tds),

        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.08)",

        borderWidth: 2,

        pointRadius: 2,
        pointHoverRadius: 5,

        tension: 0.35,

        yAxisID: "tds",
      },

      {
        label: "Turbidity",
        data: [...data].reverse().map((d) => d.turbidity),

        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.08)",

        borderWidth: 2,

        pointRadius: 2,
        pointHoverRadius: 5,

        tension: 0.35,

        yAxisID: "quality",
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",

        labels: {
          usePointStyle: true,

          padding: 18,

          color: darkMode ? "#cbd5e1" : "#475569",

          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        mode: "index",
        intersect: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: darkMode ? "#94a3b8" : "#64748b",

          maxTicksLimit: 8,

          font: {
            size: 10,
          },
        },
      },

      quality: {
        position: "left",

        min: 0,

        max: 15,

        title: {
          display: true,
          text: "pH / Turbidity",
          color: darkMode ? "#94a3b8" : "#64748b",
        },

        grid: {
          color: darkMode
            ? "rgba(148, 163, 184, 0.08)"
            : "rgba(100, 116, 139, 0.08)",
        },

        ticks: {
          color: darkMode ? "#94a3b8" : "#64748b",
        },
      },

      tds: {
        position: "right",

        min: 0,

        title: {
          display: true,
          text: "TDS",
          color: darkMode ? "#94a3b8" : "#64748b",
        },

        grid: {
          drawOnChartArea: false,
        },

        ticks: {
          color: darkMode ? "#94a3b8" : "#64748b",
        },
      },
    },
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="main-layout">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="main-content">
          {activePage === "analytics" ? (
            <Analytics data={data} darkMode={darkMode} />
          ) : (
            <div className="dashboard-container">
              <div className="dashboard-header">
                <h1>Good evening, Sebin 👋</h1>

                <p>
                  Here's what's happening with your water monitoring system.
                </p>
              </div>

              <div className="stats-grid">
                <StatCard title="Water Quality" icon="💧" variant="blue">
                  <div className="water-quality-status">
                    <div className="quality-group safe-group">
                      <div className="quality-label">
                        <span className="quality-dot safe-dot"></span>
                        SAFE
                      </div>

                      <div className="quality-locations">
                        {safeLocations.length > 0
                          ? safeLocations.join(" • ")
                          : "No safe locations"}
                      </div>
                    </div>

                    <div className="quality-group unsafe-group">
                      <div className="quality-label">
                        <span className="quality-dot unsafe-dot"></span>
                        UNSAFE
                      </div>

                      <div className="quality-locations">
                        {unsafeLocations.length > 0
                          ? unsafeLocations.join(" • ")
                          : "No unsafe locations"}
                      </div>
                    </div>
                  </div>
                </StatCard>

                <StatCard
                  title="Total Readings"
                  value={data.length}
                  subtitle="Latest sensor records"
                  icon="📊"
                  variant="blue"
                />

                <StatCard
                  title="Safe Readings"
                  value={
                    data.length > 0
                      ? `${data.filter((item) => item.status === "SAFE").length}`
                      : "0"
                  }
                  subtitle="Within safe limits"
                  icon="✓"
                  variant="green"
                />

                <StatCard
                  title="Unsafe Readings"
                  value={
                    data.length > 0
                      ? `${data.filter((item) => item.status === "UNSAFE").length}`
                      : "0"
                  }
                  subtitle="Require attention"
                  icon="⚠"
                  variant="red"
                />
              </div>

              <div className="dashboard-grid-top">
                <div className="dashboard-card sensor-card">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Sensor Readings</h2>
                      <p>Latest water quality measurements</p>
                    </div>

                    <span className="reading-count">
                      Latest {Math.min(data.length, 8)}
                    </span>
                  </div>

                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Location</th>
                          <th>pH</th>
                          <th>TDS</th>
                          <th>Turbidity</th>
                          <th>Temperature</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.slice(0, 8).map((d) => (
                          <tr key={d._id}>
                            <td>
                              <div className="location-cell">
                                <span className="location-icon">📍</span>
                                <span>{d.location}</span>
                              </div>
                            </td>

                            <td>
                              <span className="sensor-value">{d.pH}</span>
                            </td>

                            <td>
                              <span className="sensor-value">{d.tds}</span>
                            </td>

                            <td>
                              <span className="sensor-value">
                                {d.turbidity}
                              </span>
                            </td>

                            <td>
                              <span className="sensor-value">
                                {d.temperature}°C
                              </span>
                            </td>

                            <td>
                              <div className="status-cell">
                                <span
                                  className={`status-badge ${
                                    d.status === "SAFE"
                                      ? "status-safe"
                                      : "status-unsafe"
                                  }`}
                                >
                                  <span className="status-badge-dot"></span>

                                  {d.status}
                                </span>

                                {d.status === "UNSAFE" &&
                                  d.issues?.length > 0 && (
                                    <div className="status-issues">
                                      {d.issues.join(" • ")}
                                    </div>
                                  )}

                                {d.status === "SAFE" && (
                                  <div className="status-normal">
                                    All parameters normal
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid-bottom">
                <div className="dashboard-card chart-card">
                  <div className="section-heading">
                    <div>
                      <h2>Water Quality Trends</h2>
                      <p>Recent sensor measurements</p>
                    </div>

                    <span className="live-badge">
                      <span className="live-dot"></span>
                      LIVE
                    </span>
                  </div>

                  <div className="chart-container">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>

                <div className="dashboard-card map-card">
                  <div className="section-heading">
                    <div>
                      <h2>Water Quality Map</h2>
                      <p>Geographic monitoring</p>
                    </div>

                    <span className="map-count">
                      {latestByLocation.length} locations
                    </span>
                  </div>

                  <MapContainer
                    center={[26.9124, 75.7873]}
                    zoom={6}
                    style={{
                      height: "400px",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {latestByLocation.map((d) =>
                      cityCoordinates[d.location] ? (
                        <Marker
                          key={d.location}
                          position={cityCoordinates[d.location]}
                          icon={d.status === "SAFE" ? greenIcon : redIcon}
                        >
                          <Popup>
                            <div className="map-popup">
                              <div className="popup-location">{d.location}</div>

                              <div
                                className={`popup-status ${
                                  d.status === "SAFE"
                                    ? "popup-safe"
                                    : "popup-unsafe"
                                }`}
                              >
                                {d.status}
                              </div>

                              <div className="popup-readings">
                                <div>
                                  <span>pH</span>
                                  <strong>{d.pH}</strong>
                                </div>

                                <div>
                                  <span>TDS</span>
                                  <strong>{d.tds}</strong>
                                </div>

                                <div>
                                  <span>Turbidity</span>
                                  <strong>{d.turbidity}</strong>
                                </div>

                                <div>
                                  <span>Temperature</span>
                                  <strong>{d.temperature}°C</strong>
                                </div>
                              </div>

                              <div className="popup-updated">
                                Last updated:{" "}
                                {new Date(d.timestamp).toLocaleTimeString()}
                              </div>

                              {d.status === "UNSAFE" &&
                                d.issues?.length > 0 && (
                                  <div className="popup-issues">
                                    <strong>Issues</strong>

                                    {d.issues.map((issue, index) => (
                                      <div key={index}>• {issue}</div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </Popup>
                        </Marker>
                      ) : null,
                    )}
                  </MapContainer>

                  <div className="map-legend">
                    <div className="legend-item">
                      <span className="legend-dot legend-safe"></span>
                      <span>Safe Water</span>
                    </div>

                    <div className="legend-item">
                      <span className="legend-dot legend-unsafe"></span>
                      <span>Unsafe Water</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
