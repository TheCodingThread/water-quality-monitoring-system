const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  pH: Number,
  turbidity: Number,
  tds: Number,
  temperature: Number,

  status: {
    type: String,
    enum: ["SAFE", "UNSAFE"],
  },

  issues: [String],

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
