const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SensorData = require("./models/SensorData");
const sendAlertEmail = require("./utils/sendAlertEmail");

const app = express();
const PORT = 5000;

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

    app.get("/", (req, res) => {
      res.send("Water Quality Monitoring Backend is running");
    });

    const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }

  app.get("/api/sensor-data", async (req, res) => {
    try {
      const data = await SensorData.find()
        .sort({ timestamp: -1 })
        .limit(20);

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
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

startServer();
