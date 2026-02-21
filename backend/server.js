const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorData = require("./models/SensorData");
const sendAlertEmail = require("./utils/sendAlertEmail");

const app = express();
const PORT = 5000;
const axios = require("axios");

app.use(cors());
app.use(express.json());

const MONGO_URI =
  "mongodb+srv://admin:TSOwqc5577@water-quality-cluster.xfw4xk0.mongodb.net/waterDB?retryWrites=true&w=majority";

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


async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Start auto simulator AFTER server starts
      setInterval(async () => {
        try {
          const data = generateRandomData();
          await axios.post(
            `http://localhost:${PORT}/api/sensor-data`,
            data
          );
          console.log("Auto data sent");
        } catch (error) {
          console.log("Auto simulation error:", error.message);
        }
      }, 60000);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

app.post("/api/sensor-data", async (req, res) => {
  try {
    const evaluation = evaluateWaterQuality(req.body);

    console.log("Evaluation Status:", evaluation.status);
    console.log("Issues:", evaluation.issues);


    const data = new SensorData({
      ...req.body,
      status: evaluation.status,
      issues: evaluation.issues,
    });

    await data.save();

    if (evaluation.status === "UNSAFE") {
      try {
        console.log("Triggering email alert...");
        await sendAlertEmail(data);
        console.log("Alert email sent");
      } catch (emailError) {
        console.error("Email failed, but data saved:", emailError.message);
      }
    }

    res.status(201).json({
      message: "Sensor data saved and evaluated",
      status: evaluation.status,
      issues: evaluation.issues,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to process sensor data",
      error: error.message,
    });
  }
});

function generateRandomData() {
  const locations = ["Jaipur", "Delhi", "Ajmer", "Udaipur"];
  const location = locations[Math.floor(Math.random() * locations.length)];

  // Decide SAFE (70%) or UNSAFE (30%)
  const isSafe = Math.random() < 0.7;

  let pH, tds, turbidity;

  if (isSafe) {
    // SAFE ranges
    pH = +(Math.random() * (8.5 - 6.5) + 6.5).toFixed(2);
    tds = Math.floor(Math.random() * (500 - 200) + 200);
    turbidity = +(Math.random() * (5 - 1) + 1).toFixed(2);
  } else {
    // UNSAFE ranges
    pH = +(Math.random() < 0.5
      ? Math.random() * (6.4 - 4) + 4
      : Math.random() * (10 - 8.6) + 8.6
    ).toFixed(2);

    tds = Math.floor(Math.random() * (1200 - 800) + 800);
    turbidity = +(Math.random() * (20 - 10) + 10).toFixed(2);
  }

  return {
    location,
    pH,
    tds,
    turbidity,
    temperature: Math.floor(Math.random() * 20) + 20,
  };
}

setInterval(async () => {
  try {
    const data = generateRandomData();
    await axios.post(
    `http://localhost:${process.env.PORT || 5000}/api/sensor-data`,
    data
);
    console.log("Auto data sent");
  } catch (error) {
    console.log("Auto simulation error");
  }
}, 60000); // every 60 seconds

startServer();
