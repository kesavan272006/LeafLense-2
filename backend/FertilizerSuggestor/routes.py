from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from huggingface_hub import hf_hub_download
import re
import os

router = APIRouter()

# ---------------------------
# Load Model & Configure APIs
# ---------------------------

try:
    # Load your trained machine learning model
    fertilizer_model_path = hf_hub_download(
        repo_id="adityaarun1010/my-new-models",
        filename="fertilizer_model.pkl"
    )
    model, columns = joblib.load(fertilizer_model_path)

    # Configure the Gemini API
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    llm = ChatGoogleGenerativeAI(
        model='gemini-1.5-flash',
    )

except Exception as e:
    raise RuntimeError(f"Failed to initialize the service: {e}")

# ---------------------------
# Pydantic Schemas for Input Validation
# ---------------------------

class FertilizerRequest(BaseModel):
    Temperature: int
    Humidity: int
    Moisture: int
    Soil_Type: str
    Crop_Type: str
    Nitrogen: int
    Phosphorus: int
    Potassium: int

# ---------------------------
# Helper Function for ML Prediction
# ---------------------------

def predict_fertilizer(input_data: dict):
    """Run prediction using the loaded joblib model."""
    new_data = pd.DataFrame([input_data])
    new_data = pd.get_dummies(new_data)
    new_data = new_data.reindex(columns=columns, fill_value=0)
    return model.predict(new_data)[0]

# ---------------------------
# API Endpoint
# ---------------------------

@router.post("/predict")
def predict(data: FertilizerRequest):
    try:
        input_dict = data.dict()
        
        # --- CORE LOGIC CHANGE ---
        # 1. Get the main prediction directly from your trained ML model.
        # This is the value you want to display prominently.
        ml_prediction_result = predict_fertilizer(input_dict)

        # 2. Use Gemini ONLY for supplemental nutrient advice and explanation.
        gemini_prompt = (
            f"Given the soil data, recommend optimal N, P, and K levels and give a short explanation. "
            f"Return ONLY a valid JSON object.\n"
            f"Format: {{\"nitrogen\": <int>, \"phosphorus\": <int>, \"potassium\": <int>, \"explanation\": \"<string>\"}}\n"
            f"Input Data: {json.dumps(input_dict)}"
        )
        
        response = llm.invoke(gemini_prompt)
        match = re.search(r'\{[\s\S]*\}', response.text)
        recommended_n = input_dict["Nitrogen"] + 20
        recommended_p = input_dict["Phosphorus"] + 20
        recommended_k = input_dict["Potassium"] + 20
        explanation = "Based on standard agricultural models, adjustments are recommended to balance nutrient levels for the selected crop."

        # 4. Parse Gemini's response if it's valid.
        if match:
            try:
                gemini_data = json.loads(match.group(0).replace("'", '"'))
                recommended_n = gemini_data.get("nitrogen", recommended_n)
                recommended_p = gemini_data.get("phosphorus", recommended_p)
                recommended_k = gemini_data.get("potassium", recommended_k)
                explanation = gemini_data.get("explanation", explanation)
            except (json.JSONDecodeError, KeyError):
                pass  # If parsing fails, just use the default values.
        
        # 5. Construct the final response with clear separation of concerns.
        result = {
            # The main result from YOUR model
            "mlPrediction": ml_prediction_result,
            
            # Detailed breakdown for the nutrient table, powered by Gemini
            "nutrients": {
                "nitrogen": {"current": input_dict["Nitrogen"], "recommended": recommended_n, "unit": "kg/ha"},
                "phosphorus": {"current": input_dict["Phosphorus"], "recommended": recommended_p, "unit": "kg/ha"},
                "potassium": {"current": input_dict["Potassium"], "recommended": recommended_k, "unit": "kg/ha"}
            },
            
            # The text explanation, powered by Gemini
            "explanation": explanation
        }
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")

