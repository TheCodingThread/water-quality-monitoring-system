import requests
import random
import time
from datetime import datetime

API_URL = "http://localhost:5000/api/sensor-data"

locations = ["Jaipur", "Delhi", "Ajmer", "Udaipur"]

def generate_sensor_data():
    return {
        "location": random.choice(locations),
        "pH": round(random.uniform(5.5, 9.0), 2),
        "turbidity": round(random.uniform(1, 15), 2),
        "tds": round(random.uniform(200, 1200), 2),
        "temperature": round(random.uniform(20, 35), 2),
        "timestamp": datetime.utcnow().isoformat()
    }

while True:
    data = generate_sensor_data()
    try:
        response = requests.post(API_URL, json=data)
        print("Sent data:", data)
        print("Response:", response.status_code)
    except Exception as e:
        print("Error sending data:", e)

    time.sleep(5)