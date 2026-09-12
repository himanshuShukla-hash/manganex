import pandas as pd
import numpy as np
import json
import joblib

# 1. Model load karo
model = joblib.load("prospectivity_model.pkl")

# 2. CSV load karo
df = pd.read_csv("MOIL_Prospectivity_Dataset.csv")

# 3. Coordinates extract karo .geo column se
def extract_coords(geo_str):
    try:
        geo = json.loads(geo_str)
        lon = geo['coordinates'][0]
        lat = geo['coordinates'][1]
        return lat, lon
    except:
        return None, None

df['lat'], df['lon'] = zip(*df['.geo'].apply(extract_coords))

# 4. Invalid rows hatao
df = df.dropna(subset=['lat', 'lon'])

# 5. Features select karo
features = ['LST_Celsius', 'NDVI', 'NIR_SWIR2_Ratio',
            'Red_SWIR1_Ratio', 'SWIR_Ratio']

X = df[features]

# 6. Predict karo har point ke liye
df['prospectivity'] = model.predict(X)
df['confidence'] = model.predict_proba(X).max(axis=1).round(3)

# 7. Sirf zaroori columns rakho
result = df[['lat', 'lon', 'mine_site', 'prospectivity', 'confidence']]

# 8. Save karo
result.to_csv("heatmap_data.csv", index=False)
print(f"✅ Done! {len(result)} points saved!")
print(result.head())
print(f"\nProspective zones: {result['prospectivity'].sum()}")
print(f"Non-prospective: {(result['prospectivity'] == 0).sum()}")