# 🌊 Smart Water Quality Monitoring System

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Status](https://img.shields.io/badge/Deployment-Live-success)

A full-stack real-time water quality monitoring platform that simulates IoT sensor data, evaluates drinking water safety and visualizes live readings using an interactive dashboard with charts, geographic mapping, and filtering.

## 🚀 Live Demo
- **Frontend:** https://water-quality-monitoring-system-one.vercel.app/ 
- **Backend:** https://water-quality-monitoring-system-sqag.onrender.com/

## 📌 Features
- Real-time ingestion of simulated IoT sensor data  
- Automatic water safety classification (SAFE / UNSAFE)  
- Interactive dashboard with charts and maps  
- Geographic contamination tracking using Leaflet  
- Dynamic filtering by city and safety status  
- Cloud database integration (MongoDB Atlas)  
- Fully deployed full-stack architecture  

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Chart.js
- Leaflet
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- REST APIs

**Simulation**
- Python Sensor Simulator

**Deployment**
- Vercel (Frontend)
- Render (Backend)

## 🏗 System Architecture

Sensor Simulator → Node.js API → MongoDB Atlas → React Dashboard

## ⚙️ Local Setup

### Clone repository
```bash
git clone https://github.com/TheCodingThread/water-quality-monitoring-system.git
cd water-quality-monitoring-system
```

### Backend
```
cd backend
npm install
node server.js
```

### Frontend
```
cd frontend
npm install
npm run dev
```

### Simulator
```
cd simulator
python sensor_simulator.py
```

## 📈 Future Improvements
- Machine learning based contamination prediction
- Email/SMS alert notifications
- Integration with real IoT sensors

## 👨‍💻 Author
- Sebin
- Computer Science Engineering (Artificial Intelligence)
- Jaipur Engineering College and Research Centre