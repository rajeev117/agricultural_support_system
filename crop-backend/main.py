from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import requests
import random
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("crop_model.pkl")

API_KEY = "9955d7a1d6da933774670e7c4392f2b2"  
class CropInput(BaseModel):
    lat: float
    lon: float
    N: float
    P: float
    K: float
    ph: float

@app.post("/predict-crop")
def predict_crop(data: CropInput):
    #live weather
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={data.lat}&lon={data.lon}&appid={API_KEY}&units=metric"
    weather = requests.get(url).json()

    temp = weather['main']['temp']
    humidity = weather['main']['humidity']
    rainfall =round(random.uniform(60, 300), 2)



    prediction = model.predict([[data.N, data.P, data.K, temp, humidity, data.ph, rainfall]])

    return {
        "crop": prediction[0],
        "temperature": temp,
        "humidity": humidity
    }