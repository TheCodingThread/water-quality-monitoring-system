import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

function Analytics({ data, darkMode }) {
  const [analyticsData, setAnalyticsData] = useState(data);
  const [period, setPeriod] = useState("7");
  const [loading, setLoading] = useState(false);

  const [customRange, setCustomRange] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);

        let url =
          "https://water-quality-monitoring-system-sqag.onrender.com/api/sensor-data";

        if (customRange && appliedFromDate && appliedToDate) {
          url += `?from=${appliedFromDate}&to=${appliedToDate}&limit=5000`;
        } else {
          url += `?days=${period}&limit=5000`;
        }

        const response = await fetch(url);

        const result = await response.json();

        setAnalyticsData(result);
      } catch (error) {
        console.error("Failed to fetch historical analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [period, customRange, appliedFromDate, appliedToDate]);

  const handleApplyCustomRange = () => {
    if (!fromDate || !toDate) {
      return;
    }

    if (fromDate > toDate) {
      alert("From date cannot be after To date.");
      return;
    }

    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const totalReadings = analyticsData.length;

  const safeReadings = analyticsData.filter(
    (item) => item.status === "SAFE",
  ).length;

  const unsafeReadings = analyticsData.filter(
    (item) => item.status === "UNSAFE",
  ).length;

  const safePercentage =
    totalReadings > 0
      ? ((safeReadings / totalReadings) * 100).toFixed(1)
      : "0.0";

  const unsafePercentage =
    totalReadings > 0
      ? ((unsafeReadings / totalReadings) * 100).toFixed(1)
      : "0.0";

  const average = (values) => {
    if (values.length === 0) return "0.00";

    return (
      values.reduce((sum, value) => sum + value, 0) / values.length
    ).toFixed(2);
  };

  const getStats = (values) => {
    if (values.length === 0) {
      return {
        average: "0.00",
        minimum: "0.00",
        maximum: "0.00",
      };
    }

    return {
      average: (
        values.reduce((sum, value) => sum + value, 0) / values.length
      ).toFixed(2),

      minimum: Math.min(...values).toFixed(2),

      maximum: Math.max(...values).toFixed(2),
    };
  };

  const avgPH = average(analyticsData.map((item) => item.pH));

  const avgTDS = average(analyticsData.map((item) => item.tds));

  const avgTurbidity = average(analyticsData.map((item) => item.turbidity));

  const avgTemperature = average(analyticsData.map((item) => item.temperature));

  const phStats = getStats(analyticsData.map((item) => item.pH));

  const tdsStats = getStats(analyticsData.map((item) => item.tds));

  const turbidityStats = getStats(analyticsData.map((item) => item.turbidity));

  const temperatureStats = getStats(
    analyticsData.map((item) => item.temperature),
  );

  /* -----------------------------
     DOUGHNUT CHART
  ----------------------------- */

  const doughnutData = {
    labels: ["Safe", "Unsafe"],

    datasets: [
      {
        data: [safeReadings, unsafeReadings],

        backgroundColor: ["#16a34a", "#dc2626"],

        borderWidth: 0,

        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "72%",

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: darkMode ? "#f8fafc" : "#334155",

          padding: 20,

          usePointStyle: true,
        },
      },
    },
  };

  /* -----------------------------
     PARAMETER TREND CHART
  ----------------------------- */

  const chartData = {
    labels: [...data]
      .reverse()
      .map((item) => new Date(item.timestamp).toLocaleTimeString()),

    datasets: [
      {
        label: "pH",

        data: [...analyticsData].reverse().map((item) => item.pH),

        borderColor: "#3b82f6",

        backgroundColor: "rgba(59, 130, 246, 0.08)",

        borderWidth: 2,

        pointRadius: 2,

        pointHoverRadius: 5,

        tension: 0.35,
      },

      {
        label: "Turbidity",

        data: [...analyticsData].reverse().map((item) => item.turbidity),

        borderColor: "#ef4444",

        backgroundColor: "rgba(239, 68, 68, 0.08)",

        borderWidth: 2,

        pointRadius: 2,

        pointHoverRadius: 5,

        tension: 0.35,
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
          color: darkMode ? "#f8fafc" : "#334155",

          usePointStyle: true,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: darkMode ? "#94a3b8" : "#64748b",
        },

        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: darkMode ? "#94a3b8" : "#64748b",
        },

        grid: {
          color: darkMode ? "#1e293b" : "#e2e8f0",
        },
      },
    },
  };

  /* -----------------------------
     CITY ANALYTICS
  ----------------------------- */

  const cityStats = {};

  analyticsData.forEach((item) => {
    if (!cityStats[item.location]) {
      cityStats[item.location] = {
        total: 0,
        safe: 0,
        unsafe: 0,
      };
    }

    cityStats[item.location].total++;

    if (item.status === "SAFE") {
      cityStats[item.location].safe++;
    } else {
      cityStats[item.location].unsafe++;
    }
  });

  return (
    <div className="analytics-container">
      {/* HEADER */}

      <div className="analytics-header">
        <div className="dashboard-header">
          <h1>Analytics</h1>

          <p>Analyze water quality performance and sensor measurements.</p>
        </div>

        <div className="analytics-filter">
          <label htmlFor="period">Time Period</label>

          <select
            id="period"
            value={customRange ? "custom" : period}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "custom") {
                setCustomRange(true);
              } else {
                setCustomRange(false);
                setPeriod(value);
                setAppliedFromDate("");
                setAppliedToDate("");
              }
            }}
          >
            <option value="1">Last 24 Hours</option>

            <option value="7">Last 7 Days</option>

            <option value="30">Last 30 Days</option>

            <option value="90">Last 90 Days</option>

            <option value="custom">Custom Range</option>
          </select>
        </div>
        {customRange && (
          <div className="custom-date-filter">
            <div className="date-field">
              <label htmlFor="fromDate">From</label>

              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <span className="date-arrow">→</span>

            <div className="date-field">
              <label htmlFor="toDate">To</label>

              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button
              className="apply-date-button"
              onClick={handleApplyCustomRange}
              disabled={!fromDate || !toDate}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      {loading && (
        <div className="analytics-loading">Updating analytics...</div>
      )}

      {/* KPI CARDS */}

      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <span className="analytics-stat-icon">📊</span>

          <div>
            <p>Total Readings</p>
            <h2>{totalReadings}</h2>
          </div>
        </div>

        <div className="analytics-stat-card analytics-safe-card">
          <span className="analytics-stat-icon">✓</span>

          <div>
            <p>Safe Percentage</p>
            <h2>{safePercentage}%</h2>
          </div>
        </div>

        <div className="analytics-stat-card analytics-unsafe-card">
          <span className="analytics-stat-icon">⚠</span>

          <div>
            <p>Unsafe Percentage</p>
            <h2>{unsafePercentage}%</h2>
          </div>
        </div>

        <div className="analytics-stat-card">
          <span className="analytics-stat-icon">🧪</span>

          <div>
            <p>Average pH</p>
            <h2>{avgPH}</h2>
          </div>
        </div>
      </div>

      {/* CHART ROW */}

      <div className="analytics-chart-grid">
        {/* DOUGHNUT */}

        <div className="analytics-card">
          <div className="section-heading">
            <div>
              <h2>Water Quality Distribution</h2>

              <p>Safe vs unsafe sensor readings</p>
            </div>
          </div>

          <div className="doughnut-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />

            <div className="doughnut-center">
              <strong>{safePercentage}%</strong>

              <span>Safe</span>
            </div>
          </div>
        </div>

        {/* TREND */}

        <div className="analytics-card">
          <div className="section-heading">
            <div>
              <h2>Parameter Trends</h2>

              <p>Recent pH and turbidity measurements</p>
            </div>
          </div>

          <div className="analytics-line-chart">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* PARAMETERS */}

      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <h2>Parameter Statistics</h2>

            <p>
              Minimum, average and maximum measurements for the selected period
            </p>
          </div>
        </div>

        <div className="parameter-statistics">
          {/* pH */}

          <div className="parameter-stat-card">
            <div className="parameter-stat-header">
              <span className="parameter-stat-name">pH</span>

              <span className="parameter-stat-unit">pH</span>
            </div>

            <div className="parameter-stat-values">
              <div>
                <small>Minimum</small>
                <strong>{phStats.minimum}</strong>
              </div>

              <div className="stat-average">
                <small>Average</small>
                <strong>{phStats.average}</strong>
              </div>

              <div>
                <small>Maximum</small>
                <strong>{phStats.maximum}</strong>
              </div>
            </div>

            <span className="parameter-stat-limit">Safe range: 6.5 – 8.5</span>
          </div>

          {/* TDS */}

          <div className="parameter-stat-card">
            <div className="parameter-stat-header">
              <span className="parameter-stat-name">TDS</span>

              <span className="parameter-stat-unit">ppm</span>
            </div>

            <div className="parameter-stat-values">
              <div>
                <small>Minimum</small>
                <strong>{tdsStats.minimum}</strong>
              </div>

              <div className="stat-average">
                <small>Average</small>
                <strong>{tdsStats.average}</strong>
              </div>

              <div>
                <small>Maximum</small>
                <strong>{tdsStats.maximum}</strong>
              </div>
            </div>

            <span className="parameter-stat-limit">Safe limit: ≤ 500 ppm</span>
          </div>

          {/* TURBIDITY */}

          <div className="parameter-stat-card">
            <div className="parameter-stat-header">
              <span className="parameter-stat-name">Turbidity</span>

              <span className="parameter-stat-unit">NTU</span>
            </div>

            <div className="parameter-stat-values">
              <div>
                <small>Minimum</small>
                <strong>{turbidityStats.minimum}</strong>
              </div>

              <div className="stat-average">
                <small>Average</small>
                <strong>{turbidityStats.average}</strong>
              </div>

              <div>
                <small>Maximum</small>
                <strong>{turbidityStats.maximum}</strong>
              </div>
            </div>

            <span className="parameter-stat-limit">Safe limit: ≤ 5 NTU</span>
          </div>

          {/* TEMPERATURE */}

          <div className="parameter-stat-card">
            <div className="parameter-stat-header">
              <span className="parameter-stat-name">Temperature</span>

              <span className="parameter-stat-unit">°C</span>
            </div>

            <div className="parameter-stat-values">
              <div>
                <small>Minimum</small>
                <strong>{temperatureStats.minimum}°</strong>
              </div>

              <div className="stat-average">
                <small>Average</small>
                <strong>{temperatureStats.average}°</strong>
              </div>

              <div>
                <small>Maximum</small>
                <strong>{temperatureStats.maximum}°</strong>
              </div>
            </div>

            <span className="parameter-stat-limit">Safe limit: ≤ 30°C</span>
          </div>
        </div>
      </div>

      {/* CITY ANALYTICS */}

      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <h2>Location Performance</h2>

            <p>Water quality distribution by location</p>
          </div>
        </div>

        <div className="location-analytics">
          {Object.entries(cityStats).map(([city, stats]) => {
            const percentage =
              stats.total > 0
                ? ((stats.safe / stats.total) * 100).toFixed(1)
                : 0;

            return (
              <div className="location-row" key={city}>
                <div className="location-name">
                  <span>📍</span>

                  <strong>{city}</strong>
                </div>

                <div className="location-progress">
                  <div
                    className="location-progress-bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>

                <div className="location-percentage">{percentage}%</div>

                <div className="location-count">
                  {stats.safe} safe / {stats.unsafe} unsafe
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
