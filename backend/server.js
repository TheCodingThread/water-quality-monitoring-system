const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorData = require("./models/SensorData");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

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

  if (data.temperature > 30) {
    issues.push("High temperature");
  }

  return {
    status: issues.length === 0 ? "SAFE" : "UNSAFE",
    issues,
  };
}

function generateRandomData() {
  const locations = ["Jaipur", "Delhi", "Ajmer", "Udaipur"];

  const location = locations[Math.floor(Math.random() * locations.length)];

  const isSafe = Math.random() < 0.8;

  let pH, tds, turbidity;

  if (isSafe) {
    pH = +(Math.random() * (8.5 - 6.5) + 6.5).toFixed(2);
    tds = Math.floor(Math.random() * (500 - 200) + 200);
    turbidity = +(Math.random() * (5 - 1) + 1).toFixed(2);
  } else {
    pH = +(
      Math.random() < 0.5
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

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ==========================================
// CREATE / SIMULATE SENSOR READING
// ==========================================

app.post("/api/sensor-data", async (req, res) => {
  try {
    const randomData = generateRandomData();

    const evaluation = evaluateWaterQuality(randomData);

    const newEntry = new SensorData({
      ...randomData,
      status: evaluation.status,
      issues: evaluation.issues,
    });

    await newEntry.save();

    console.log("New sensor reading created");

    res.status(201).json(newEntry);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Server Error",
    });
  }
});


// ==========================================
// GET SENSOR DATA
// ==========================================

app.get("/api/sensor-data", async (req, res) => {
  try {
    const { days, from, to, limit = 20 } = req.query;

    const query = {};

    // --------------------------------------
    // DATE FILTER
    // --------------------------------------

    if (from || to) {
      query.timestamp = {};

      if (from) {
        query.timestamp.$gte = new Date(from);
      }

      if (to) {
        const endDate = new Date(to);

        // Include the complete "to" day
        endDate.setDate(endDate.getDate() + 1);

        query.timestamp.$lt = endDate;
      }
    }

    // --------------------------------------
    // LAST N DAYS FILTER
    // --------------------------------------

    else if (days) {
      const daysNumber = Number(days);

      if (!Number.isNaN(daysNumber) && daysNumber > 0) {
        const startDate = new Date();

        startDate.setDate(
          startDate.getDate() - daysNumber
        );

        query.timestamp = {
          $gte: startDate,
        };
      }
    }

    // --------------------------------------
    // FETCH DATA
    // --------------------------------------

    const data = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(data);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
