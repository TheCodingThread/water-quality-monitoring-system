const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorData = require("./models/SensorData");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  "mongodb+srv://admin:<TSOwqc5577>@water-quality-cluster.xfw4xk0.mongodb.net/?appName=water-quality-cluster";

// ---------------- WATER QUALITY EVALUATION ----------------
function evaluateWaterQuality(data) {
  let issues = [];

  if (data.pH < 6.5 || data.pH > 8.5) {
    issues.push("pH out of safe range");
  }

  if (data.turbidity > 5) {
    issues.push("High turbidity");
  }

  if (data.tds > 500) {
    issues.push("High TDS");
  }

  return {
    status: issues.length === 0 ? "SAFE" : "UNSAFE",
    issues,
  };
}

// ---------------- RANDOM DATA GENERATOR ----------------
function generateRandomData() {
  const locations = ["Jaipur", "Delhi", "Ajmer", "Udaipur"];

  const location =
    locations[Math.floor(Math.random() * locations.length)];

  // 80% SAFE
  const isSafe = Math.random() < 0.8;

  let pH, tds, turbidity;

  if (isSafe) {
    pH = +(Math.random() * (8.5 - 6.5) + 6.5).toFixed(2);
    tds = Math.floor(Math.random() * (500 - 200) + 200);
    turbidity = +(Math.random() * (5 - 1) + 1).toFixed(2);
  } else {
    pH = +(Math.random() < 0.5
      ? Math.random() * (6.4 - 4) + 4
      : Math.random() * (10 - 8.6) + 8.6
    ).toFixed(2);

    tds = Math.floor(Math.random() * (1200 - 700) + 700);
    turbidity = +(Math.random() * (15 - 8) + 8).toFixed(2);
  }

  return {
    location,
    pH,
    tds,
    turbidity,
    temperature: Math.floor(Math.random() * 15) + 20,
  };
}

// ---------------- ROOT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ---------------- MAIN API ----------------
app.get("/api/sensor-data", async (req, res) => {
  try {

    // -------- GENERATE RANDOM DATA --------
    const randomData = generateRandomData();

    const evaluation = evaluateWaterQuality(randomData);

    const newEntry = new SensorData({
      ...randomData,
      status: evaluation.status,
      issues: evaluation.issues,
    });

    await newEntry.save();

    console.log("Generated new sensor data");

    // -------- FETCH LATEST 20 RECORDS --------
    const data = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ---------------- START SERVER ----------------
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });