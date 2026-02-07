Smart Water Quality Monitoring System

A full-stack real-time water quality monitoring platform that simulates IoT sensor data, evaluates drinking water safety, and visualises live readings through an interactive dashboard with charts, geographic mapping, and filtering.

Live Demo

Frontend: https://your-frontend-link.vercel.app

Backend API: https://your-backend-link.onrender.com/api/sensor-data

Overview

Access to safe drinking water is a major global challenge. Traditional laboratory testing is slow and not scalable. This project demonstrates a scalable monitoring solution that continuously analyses water quality parameters and provides actionable insights using real-time visualization.

The system ingests simulated sensor readings, evaluates water safety based on predefined thresholds, stores the data in a cloud database, and presents it through a live web dashboard.

Features

Real-time ingestion of simulated IoT sensor data

Automatic water safety classification (SAFE / UNSAFE)

Interactive dashboard displaying live water quality metrics

Historical trend visualisation using charts

Geographic contamination mapping using Leaflet maps

Dynamic filtering by location and safety status

Cloud database integration using MongoDB Atlas

Fully deployed full-stack architecture

Tech Stack
Frontend

React (Vite)

Chart.js

Leaflet Maps

CSS

Backend

Node.js

Express.js

MongoDB Atlas

REST APIs

Simulation

Python (Sensor Data Generator)

Deployment

Vercel (Frontend)

Render (Backend)

System Architecture
Sensor Simulator (Python)
        ↓
Node.js / Express Backend (Render)
        ↓
MongoDB Atlas (Cloud Database)
        ↓
React Dashboard (Vercel)

Local Installation
Clone repository
git clone https://github.com/yourusername/water-quality-monitoring-system.git
cd water-quality-monitoring-system

Backend
cd backend
npm install
node server.js

Frontend
cd frontend
npm install
npm run dev

Sensor Simulator
cd simulator
python sensor_simulator.py

Example API Input
{
  "location": "Jaipur",
  "pH": 7.1,
  "tds": 480,
  "turbidity": 3.5,
  "temperature": 28
}

Future Enhancements

Machine learning based contamination prediction

SMS / Email alert notifications

Integration with real IoT hardware sensors

Role-based dashboards for authorities

Author

Sebin
Computer Science Engineering (Artificial Intelligence)
Jaipur Engineering College and Research Centre

License

This project is developed for educational and demonstration purposes.
