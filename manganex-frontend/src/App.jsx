import { useState } from "react";
import Map from "./components/Map";

function App() {
  const [prospectivityForm, setProspectivityForm] = useState({
    LST_Celsius: "",
    NDVI: "",
    NIR_SWIR2_Ratio: "",
    Red_SWIR1_Ratio: "",
    SWIR_Ratio: "",
  });

  const [shortfallForm, setShortfallForm] = useState({
    equipment_downtime_hours: "",
    dgms_blasting_restricted: 0,
    rainfall_mm: "",
    temperature_c: "",
    is_monsoon: 0,
    downtime_cause_encoded: 0,
  });

  const [prospectivityResult, setProspectivityResult] = useState(null);
  const [shortfallResult, setShortfallResult] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleProspectivityChange = (e) => {
    setProspectivityForm({
      ...prospectivityForm,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleShortfallChange = (e) => {
    setShortfallForm({
      ...shortfallForm,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleProspectivityPredict = async () => {
    setLoading1(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prospectivityForm),
      });
      const data = await res.json();
      setProspectivityResult(data);
    } catch {
      alert("FastAPI server chal raha hai?");
    }
    setLoading1(false);
  };

  const handleShortfallPredict = async () => {
    setLoading2(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict-shortfall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shortfallForm),
      });
      const data = await res.json();
      setShortfallResult(data);
    } catch {
      alert("FastAPI server chal raha hai?");
    }
    setLoading2(false);
  };

  const cardStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginTop: "6px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: "1rem",
  };

  const btnStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px",
      }}
    >
      {/* Header */}
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", color: "#38bdf8" }}>
        🪨 MANGANEX
      </h1>
      <p style={{ textAlign: "center", color: "#94a3b8" }}>
        AI-powered Manganese Reserve Mapping & Production Intelligence
      </p>

      {/* Map */}
      <div style={{ margin: "30px 0" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "12px" }}>
          🗺️ Prospectivity Heatmap — MOIL Mine Areas
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "12px" }}>
          🟢 Green = High Prospectivity &nbsp; 🔴 Red = Low Prospectivity
        </p>
        <Map />
      </div>

      {/* Module 1 */}
      <div style={cardStyle}>
        <h2 style={{ color: "#38bdf8", marginBottom: "20px" }}>
          🔍 Module A — Reserve Prospectivity
        </h2>
        {[
          {
            name: "LST_Celsius",
            label: "Land Surface Temperature (°C)",
            placeholder: "e.g. 32.5",
          },
          {
            name: "NDVI",
            label: "NDVI (Vegetation Index)",
            placeholder: "e.g. 0.45",
          },
          {
            name: "NIR_SWIR2_Ratio",
            label: "NIR/SWIR2 Ratio",
            placeholder: "e.g. 1.65",
          },
          {
            name: "Red_SWIR1_Ratio",
            label: "Red/SWIR1 Ratio",
            placeholder: "e.g. 0.35",
          },
          { name: "SWIR_Ratio", label: "SWIR Ratio", placeholder: "e.g. 1.72" },
        ].map((f) => (
          <div key={f.name} style={{ marginBottom: "16px" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              {f.label}
            </label>
            <input
              type="number"
              name={f.name}
              placeholder={f.placeholder}
              onChange={handleProspectivityChange}
              style={inputStyle}
            />
          </div>
        ))}
        <button onClick={handleProspectivityPredict} style={btnStyle}>
          {loading1 ? "Predicting..." : "🔍 Predict Prospectivity"}
        </button>
        {prospectivityResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              background:
                prospectivityResult.prospectivity === 1 ? "#14532d" : "#7f1d1d",
            }}
          >
            <h3>{prospectivityResult.label}</h3>
            <p>
              Confidence: <strong>{prospectivityResult.confidence}%</strong>
            </p>
          </div>
        )}
      </div>

      {/* Module 2 */}
      <div style={cardStyle}>
        <h2 style={{ color: "#f59e0b", marginBottom: "20px" }}>
          ⚠️ Module B — Shortfall Prediction
        </h2>
        {[
          {
            name: "equipment_downtime_hours",
            label: "Equipment Downtime (hours)",
            placeholder: "e.g. 3",
          },
          {
            name: "rainfall_mm",
            label: "Rainfall (mm)",
            placeholder: "e.g. 15",
          },
          {
            name: "temperature_c",
            label: "Temperature (°C)",
            placeholder: "e.g. 34",
          },
        ].map((f) => (
          <div key={f.name} style={{ marginBottom: "16px" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              {f.label}
            </label>
            <input
              type="number"
              name={f.name}
              placeholder={f.placeholder}
              onChange={handleShortfallChange}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Dropdowns */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Downtime Cause
          </label>
          <select
            name="downtime_cause_encoded"
            onChange={handleShortfallChange}
            style={{ ...inputStyle }}
          >
            <option value={0}>None</option>
            <option value={1}>Maintenance</option>
            <option value={2}>Breakdown</option>
            <option value={3}>Power Failure</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            DGMS Blasting Restricted?
          </label>
          <select
            name="dgms_blasting_restricted"
            onChange={handleShortfallChange}
            style={{ ...inputStyle }}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Monsoon Season?
          </label>
          <select
            name="is_monsoon"
            onChange={handleShortfallChange}
            style={{ ...inputStyle }}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <button
          onClick={handleShortfallPredict}
          style={{ ...btnStyle, background: "#f59e0b" }}
        >
          {loading2 ? "Predicting..." : "⚠️ Predict Shortfall"}
        </button>

        {shortfallResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "8px",
              background:
                shortfallResult.shortfall === 1 ? "#7f1d1d" : "#14532d",
            }}
          >
            <h3 style={{ textAlign: "center" }}>{shortfallResult.label}</h3>
            <p style={{ textAlign: "center" }}>
              Confidence: <strong>{shortfallResult.confidence}%</strong>
            </p>
            <div style={{ marginTop: "16px" }}>
              <p style={{ color: "#94a3b8", marginBottom: "8px" }}>
                📋 Corrective Actions:
              </p>
              {shortfallResult.corrective_actions.map((action, i) => (
                <p
                  key={i}
                  style={{
                    background: "#1e293b",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    marginBottom: "6px",
                  }}
                >
                  {action}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
