from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Smart Field Service AI Service")

class ServiceRequest(BaseModel):
    description: str

class ClassificationResponse(BaseModel):
    category: str
    priority: str
    confidence: float
    summary: str

@app.get("/")
def home():
    return {"message": "AI Service is running successfully!"}

@app.post("/classify", response_model=ClassificationResponse)
def classify_request(request: ServiceRequest):
    text = request.description.lower()
    
    # Simple rule-based/mock AI logic for classification
    if "ac" in text or "air conditioner" in text or "cooling" in text:
        category = "HVAC"
        priority = "High" if "loud" in text or "not working" in text else "Medium"
    elif "generator" in text or "power" in text:
        category = "Electrical Maintenance"
        priority = "High"
    elif "internet" in text or "wifi" in text or "router" in text:
        category = "Internet Installation"
        priority = "Low"
    else:
        category = "General Appliance Repair"
        priority = "Medium"
        
    summary = f"Issue identified as {category} with {priority} priority based on customer description."
    
    return {
        "category": category,
        "priority": priority,
        "confidence": 0.95,
        "summary": summary
    }