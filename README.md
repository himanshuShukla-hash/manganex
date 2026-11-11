# ⛏️ Manganex — AI-Driven Manganese Prospectivity & Shortfall Intelligence Platform

> **An integrated Machine Learning & GIS Decision-Support System tailored for Manganese Ore India Limited (MOIL).**

Manganex combines **satellite remote sensing indices** and **operational mining telemetry** to solve two critical challenges in mining operations:
1. **Mineral Prospectivity Mapping:** Accurately identifying high-probability manganese ore deposits across mining concessions.
2. **Production Shortfall Risk Forecasting:** Predicting operational production deficits in advance and generating actionable corrective measures.

---

## 🌟 Key Capabilities

### 1. 🛰️ Remote Sensing Mineral Prospectivity
- Analyzes multispectral satellite signatures including:
  - **Land Surface Temperature (LST)** in Celsius
  - **NDVI** (Normalized Difference Vegetation Index)
  - **SWIR Ratios & Band Combinations** (NIR/SWIR2, Red/SWIR1, SWIR Ratio)
- ML classification pipeline predicts mineral probability and confidence scores with immediate categorization (**High Prospectivity ✅** vs. **Low Prospectivity ❌**).

### 2. 🗺️ Interactive GIS Exploration Map
- Geospatial heatmap built on **React-Leaflet** and **OpenStreetMap**.
- Centered on the central Indian manganese belt (Nagpur, Bhandara, and Balaghat concessions).
- Color-coded deposit prospectivity indicators with coordinate inspection popups.

### 3. 🚨 Operational Shortfall Forecasting & Corrective Action Engine
- Evaluates real-time operational parameters:
  - Equipment downtime hours & downtime cause encoding
  - DGMS (Directorate General of Mines Safety) blasting restrictions
  - Rainfall (mm) and temperature (°C)
  - Monsoon seasonality indicator
- Features an automated **Corrective Action Engine** recommending proactive mitigations (e.g. equipment redeployment, blasting schedule revisions, indoor processing shifts, or advance stockpiling).

---

## 🏗️ Architecture & Tech Stack

```
manganex/
├── main.py                             # FastAPI ML inference backend & REST API
├── generate_heatmap_data.py            # GIS coordinates extractor & heatmap generator
├── prospectivity_model.pkl             # Trained mineral prospectivity classifier
├── shortfall_model.pkl                 # Trained production shortfall classifier
├── MOIL_Prospectivity_Dataset.csv      # Remote sensing geospatial dataset
├── moil_module_b_synthetic_data.csv    # Operational telemetry dataset
├── heatmap_data.csv                    # Pre-generated GIS heatmap coordinates
└── manganex-frontend/                  # React 19 + Vite web interface
    ├── src/
    │   ├── App.jsx                     # Prediction dashboard & dual input forms
    │   ├── components/
    │   │   └── Map.jsx                 # Leaflet GIS interactive map
    │   └── main.jsx
    └── package.json
```

- **Backend:** FastAPI, Pydantic, Scikit-Learn, Joblib, Pandas, NumPy, Uvicorn
- **Frontend:** React 19, Vite, Leaflet, React-Leaflet, PapaParse
- **Mapping:** OpenStreetMap tile layers with dynamic CircleMarker overlays

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/himanshuShukla-hash/manganex.git
cd manganex

# Install Python dependencies
pip install fastapi uvicorn pydantic scikit-learn joblib pandas numpy

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
The API documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd manganex-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Reference

### Health Check
- **Endpoint:** `GET /`
- **Response:** `{"status": "MANGANEX API Running ✅"}`

### Mineral Prospectivity Prediction
- **Endpoint:** `POST /predict`
- **Request Body:**
  ```json
  {
    "LST_Celsius": 32.5,
    "NDVI": 0.21,
    "NIR_SWIR2_Ratio": 1.45,
    "Red_SWIR1_Ratio": 0.88,
    "SWIR_Ratio": 1.12
  }
  ```
- **Response:**
  ```json
  {
    "prospectivity": 1,
    "confidence": 89.4,
    "label": "High Prospectivity ✅"
  }
  ```

### Production Shortfall Prediction
- **Endpoint:** `POST /predict-shortfall`
- **Request Body:**
  ```json
  {
    "equipment_downtime_hours": 5.5,
    "dgms_blasting_restricted": 1,
    "rainfall_mm": 24.0,
    "temperature_c": 28.5,
    "is_monsoon": 1,
    "downtime_cause_encoded": 2
  }
  ```
- **Response:**
  ```json
  {
    "shortfall": 1,
    "confidence": 92.1,
    "label": "🚨 Shortfall Expected",
    "corrective_actions": [
      "⚠️ Equipment ko Zone B se redeploy karo",
      "⚠️ Blasting schedule adjust karo — DGMS restriction hai",
      "⚠️ Heavy rainfall — indoor processing pe shift karo",
      "⚠️ Monsoon season — advance stockpiling karo"
    ]
  }
  ```

---

## 📄 License
MIT License / Academic & Research use.
