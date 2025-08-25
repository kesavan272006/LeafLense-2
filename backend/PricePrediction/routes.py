from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import joblib
import pandas as pd
from pydantic import BaseModel
import os

# ✅ Router for Price Prediction
router = APIRouter(prefix="/price", tags=["Price Prediction"])

# ✅ Path to trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "crop_price_model_2.pkl")  # Look for model in same directory
MODEL_PATH_FALLBACK = os.path.join(BASE_DIR, "models", "crop_price_model_2.pkl")  # Fallback in models subdirectory

# ✅ Load model with fallback
model = None
model_loaded = False

for path in [MODEL_PATH, MODEL_PATH_FALLBACK]:
    try:
        if os.path.exists(path):
            print(f"\n🔄 Loading price prediction model from: {path}")
            model = joblib.load(path)
            print("\n✅ Price prediction model loaded successfully")
            model_loaded = True
            break
    except Exception as e:
        print(f"\n❌ Failed to load price prediction model from {path}: {e}")
        continue

if not model_loaded:
    print(f"\n⚠️  No price prediction model found. Checked paths:")
    print(f"   - {MODEL_PATH}")
    print(f"   - {MODEL_PATH_FALLBACK}")
    print(f"\n📝 To enable predictions, place your trained model file at one of these locations.")
    print(f"\n🔧 Creating mock model for development/testing...")
    
    # Create a simple mock model for development/testing
    class MockPricePredictionModel:
        def predict(self, df):
            # Return a mock prediction based on input data
            import numpy as np
            np.random.seed(42)  # For consistent results
            # Generate a reasonable price prediction between min and max
            if 'avg_min_price' in df.columns and 'avg_max_price' in df.columns:
                avg_min = df['avg_min_price'].iloc[0] if len(df) > 0 else 1000
                avg_max = df['avg_max_price'].iloc[0] if len(df) > 0 else 1500
                # Predict a price within the range with some variation
                predicted_price = np.random.uniform(avg_min * 0.95, avg_max * 1.05)
            else:
                predicted_price = np.random.uniform(1000, 2000)
            return [predicted_price]
    
    model = MockPricePredictionModel()
    model_loaded = "mock"
    print("\n✅ Mock price prediction model created for development.")

# Input schema for request body
class CropPriceData(BaseModel):
    month: str
    commodity_name: str
    avg_min_price: float
    avg_max_price: float
    state_name: str
    district_name: str
    calculationType: str
    change: float

@router.get("/")
def price_prediction_status():
    """Get price prediction service status"""
    return {
        "status": "active",
        "service": "Crop Price Prediction",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "model_type": model_loaded if model_loaded else "none",
        "note": "Using mock model for demonstration" if model_loaded == "mock" else "Production model loaded" if model_loaded else "No model available"
    }

@router.post("/predict")
def predict_price(data: CropPriceData):
    """Predict crop price based on input data"""
    if model is None:
        return {"error": "Price prediction model not loaded"}
    
    try:
        # Convert input to DataFrame (model expects same features as training)
        df = pd.DataFrame([data.dict()])
        
        # Predict
        pred = model.predict(df)[0]
        
        return {
            "predicted_price": float(pred),
            "status": "success",
            "input_data": data.dict()
        }
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}",
            "status": "error"
        }

@router.get("/commodities")
def get_supported_commodities():
    """Get list of supported commodities"""
    # Common commodities that the model might support
    commodities = [
        "Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Groundnut",
        "Soybean", "Turmeric", "Coriander", "Chili", "Onion", "Potato",
        "Tomato", "Banana", "Mango", "Orange", "Apple", "Grapes",
        "Tea", "Coffee", "Rubber", "Coconut", "Areca nut", "Cardamom",
        "Black pepper", "Ginger", "Garlic", "Lemon", "Jowar", "Bajra",
        "Ragi", "Barley", "Gram", "Tur", "Moong", "Urad", "Linseed",
        "Castor seed", "Sesamum", "Safflower", "Nigerseed", "Sunflower"
    ]
    
    return {
        "commodities": sorted(commodities),
        "count": len(commodities),
        "status": "success"
    }

@router.get("/states")
def get_supported_states():
    """Get list of supported Indian states"""
    states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal", "Delhi", "Chandigarh", "Dadra and Nagar Haveli",
        "Daman and Diu", "Lakshadweep", "Puducherry"
    ]
    
    return {
        "states": sorted(states),
        "count": len(states),
        "status": "success"
    }
