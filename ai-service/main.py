from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Smart Field Service AI Service")

class ServiceRequest(BaseModel):
    description: str

class ClassificationResponse(BaseModel):
    category: str
    priority: str
    aiConfidence: float
    recommendedTechnicianId: Optional[str] = None
    summary: str

@app.get("/")
def home():
    return {"message": "AI Service is running successfully!"}

@app.post("/classify", response_model=ClassificationResponse)
def classify_request(request: ServiceRequest):
    text = request.description.lower()
    
    # Category and Priority Logic
    if "ac" in text or "air conditioner" in text or "cooling" in text or "refrigerator" in text or "freezer" in text:
        category = "HVAC"
        priority = "High" if "not working" in text or "loud" in text or "warm" in text or "spoil" in text else "Medium"
        tech_id = "TECH_HVAC_01"
    elif "generator" in text or "power" in text or "electricity" in text:
        category = "Electrical Maintenance"
        priority = "High"
        tech_id = "TECH_ELEC_02"
    elif "internet" in text or "wifi" in text or "router" in text:
        category = "Internet Installation"
        priority = "Low"
        tech_id = "TECH_NET_03"
    else:
        category = "General Appliance Repair"
        priority = "Medium"
        tech_id = "TECH_GEN_04"
        
    summary = f"Automated analysis: Identified issue under {category} category with {priority} priority. Recommended technician assigned."
    
    return {
        "category": category,
        "priority": priority,
        "aiConfidence": 0.94,
        "recommendedTechnicianId": tech_id,
        "summary": summary
    }