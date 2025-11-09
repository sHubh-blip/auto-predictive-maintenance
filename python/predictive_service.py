from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

app = FastAPI(title="Predictive Maintenance AI Service")

@app.get("/")
def root():
    return {
        "ok": True,
        "service": "Predictive Maintenance AI Service",
        "endpoints": ["POST /predict", "POST /forecast", "POST /insights", "GET /docs"]
    }

@app.get("/health")
def health():
    return {"ok": True}

# --- Models ---
class PredictRequest(BaseModel):
    vin: str
    sensors: dict
    dtc: List[str] = []
    usage: dict = {}
    mileageKm: float = 0

class ForecastRequest(BaseModel):
    fleet: Optional[List[dict]] = None

class InsightsRequest(BaseModel):
    pass

# --- Simple heuristic diagnostic engine (fast and dependency-light for demo) ---
COMPONENTS = ["engine", "battery", "brakes", "transmission", "coolant", "tires"]


def bound(v, lo, hi):
    return max(lo, min(hi, v))


def compute_prob(req: PredictRequest):
    s = req.sensors or {}
    p = 0.05
    comp = "engine"

    # DTC hints
    dtc = set(req.dtc or [])
    if "P0300" in dtc:
        p += 0.35
        comp = "engine"
    if "P0420" in dtc:
        p += 0.25
        comp = "transmission"
    if any(code.startswith("C") for code in dtc):
        p += 0.2
        comp = "brakes"

    # Sensor heuristics
    engine_temp = float(s.get("engine_temp", 85))
    oil_pressure = float(s.get("oil_pressure", 28))
    battery_voltage = float(s.get("battery_voltage", 12.4))
    brake_pad = float(s.get("brake_pad_thickness", 7.5))
    tires = [float(s.get(k, 32)) for k in ["tire_pressure_fl","tire_pressure_fr","tire_pressure_rl","tire_pressure_rr"]]

    if engine_temp > 100:
        p += bound((engine_temp - 100) * 0.01, 0, 0.25)
        comp = "engine"
    if oil_pressure < 20:
        p += bound((20 - oil_pressure) * 0.02, 0, 0.3)
        comp = "engine"
    if battery_voltage < 12.0:
        p += bound((12.0 - battery_voltage) * 0.2, 0, 0.4)
        comp = "battery"
    if brake_pad < 4.0:
        p += bound((4.0 - brake_pad) * 0.08, 0, 0.4)
        comp = "brakes"
    if (max(tires) - min(tires)) > 4:
        p += 0.15
        comp = "tires"

    # Usage/mileage factor
    mileage = float(req.mileageKm or 0)
    p += bound(mileage / 200000.0, 0, 0.15)

    p = bound(p, 0, 0.98)
    severity = "low"
    if p > 0.7: severity = "high"
    elif p > 0.4: severity = "medium"

    message = f"Predicted risk of {comp} issue: {p:.2f} ({severity})."
    return comp, float(p), severity, message


@app.post("/predict")
def predict(req: PredictRequest):
    comp, prob, severity, message = compute_prob(req)
    return {"component": comp, "probability": prob, "severity": severity, "message": message}


@app.post("/forecast")
def forecast(_: ForecastRequest):
    # simple synthetic 7-day forecast
    today = datetime.utcnow().date()
    base = 15
    out = []
    for i in range(7):
        day = today + timedelta(days=i)
        # add weekly seasonality bump on weekends
        bump = 8 if day.weekday() >= 5 else 0
        out.append({"date": str(day), "expected_appointments": base + bump + (i % 3)})
    return {"horizon": 7, "forecast": out}


@app.post("/insights")
def insights(_: InsightsRequest):
    # minimal CAPA/RCA demo using CSV
    try:
        df = pd.read_csv("data/capa.csv")
    except Exception:
        # fallback
        df = pd.DataFrame([
            {"component":"brakes","defect_code":"C1234","root_cause":"Pad wear","corrective_action":"Replace pads","preventive_action":"Increase inspection frequency","recurrence_count":27},
            {"component":"battery","defect_code":"B0001","root_cause":"Low charge cycles","corrective_action":"Replace battery","preventive_action":"Improve alternator calibration","recurrence_count":19},
            {"component":"engine","defect_code":"P0300","root_cause":"Random misfire","corrective_action":"Spark plug & coil check","preventive_action":"Supplier QC audit","recurrence_count":31}
        ])
    grouped = df.groupby(["component","root_cause"], as_index=False)["recurrence_count"].sum()
    top = grouped.sort_values("recurrence_count", ascending=False).head(5)

    # map back actions for the top rows
    recs = []
    for _, row in top.iterrows():
        sub = df[(df["component"]==row["component"]) & (df["root_cause"]==row["root_cause"])].iloc[0]
        recs.append({
            "component": row["component"],
            "root_cause": row["root_cause"],
            "total_recurrence": int(row["recurrence_count"]),
            "corrective_action": sub["corrective_action"],
            "preventive_action": sub["preventive_action"]
        })
    return {"insights": recs}
