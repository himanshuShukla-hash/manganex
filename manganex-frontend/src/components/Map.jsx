import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";

function Map() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch("/heatmap_data.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, dynamicTyping: true });
        setPoints(parsed.data.filter((p) => p.lat && p.lon));
      });
  }, []);

  return (
    <MapContainer
      center={[21.6, 79.5]}
      zoom={8}
      style={{ height: "600px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="OpenStreetMap"
      />

      {points.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point.lat, point.lon]}
          radius={6}
          fillColor={point.prospectivity === 1 ? "#22c55e" : "#ef4444"}
          color="transparent"
          fillOpacity={0.7}
        >
          <Popup>
            <b>Mine Site:</b> {point.mine_site} <br />
            <b>Prospectivity:</b>{" "}
            {point.prospectivity === 1 ? "✅ High" : "❌ Low"} <br />
            <b>Confidence:</b> {(point.confidence * 100).toFixed(1)}%
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default Map;
