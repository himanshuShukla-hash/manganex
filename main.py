from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# React se connection ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model load karo
model = joblib.load("prospectivity_model.pkl")

# Input format define karo
class MineData(BaseModel):
    LST_Celsius: float
    NDVI: float
    NIR_SWIR2_Ratio: float
    Red_SWIR1_Ratio: float
    SWIR_Ratio: float

# Test route
@app.get("/")
def home():
    return {"status": "MANGANEX API Running ✅"}

# Prediction route
@app.post("/predict")
def predict(data: MineData):
    features = [[
        data.LST_Celsius,
        data.NDVI,
        data.NIR_SWIR2_Ratio,
        data.Red_SWIR1_Ratio,
        data.SWIR_Ratio
    ]]
    
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    
    return {
        "prospectivity": int(prediction),
        "confidence": round(float(probability[prediction]) * 100, 2),
        "label": "High Prospectivity ✅" if prediction == 1 else "Low Prospectivity ❌"
    } 

# Shortfall Model load karo
shortfall_model = joblib.load("shortfall_model.pkl")

# Shortfall Input
class ShortfallData(BaseModel):
    equipment_downtime_hours: float
    dgms_blasting_restricted: int
    rainfall_mm: float
    temperature_c: float
    is_monsoon: int
    downtime_cause_encoded: int

# Shortfall prediction route
@app.post("/predict-shortfall")
def predict_shortfall(data: ShortfallData):
    features = [[
        data.equipment_downtime_hours,
        data.dgms_blasting_restricted,
        data.rainfall_mm,
        data.temperature_c,
        data.is_monsoon,
        data.downtime_cause_encoded
    ]]

    prediction = shortfall_model.predict(features)[0]
    probability = shortfall_model.predict_proba(features)[0]

    # Corrective Action Engine
    actions = []
    if data.equipment_downtime_hours > 4:
        actions.append("⚠️ Equipment ko Zone B se redeploy karo")
    if data.dgms_blasting_restricted == 1:
        actions.append("⚠️ Blasting schedule adjust karo — DGMS restriction hai")
    if data.rainfall_mm > 20:
        actions.append("⚠️ Heavy rainfall — indoor processing pe shift karo")
    if data.is_monsoon == 1:
        actions.append("⚠️ Monsoon season — advance stockpiling karo")
    if not actions:
        actions.append("✅ Sab normal hai — koi action required nahi")

    return {
        "shortfall": int(prediction),
        "confidence": round(float(probability[prediction]) * 100, 2),
        "label": "🚨 Shortfall Expected" if prediction == 1 else "✅ Production Normal",
        "corrective_actions": actions
    }