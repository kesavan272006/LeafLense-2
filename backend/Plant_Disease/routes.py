import os
import numpy as np
import tensorflow as tf
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
from huggingface_hub import hf_hub_download
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

router = APIRouter(prefix="/disease", tags=["Plant Disease"])

class_names = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

model = None
model_type = None

try:
    # Use absolutely correct absolute path for the model:
    keras_path = os.path.abspath("D:/LeafLense-2/LeafLense-2/backend/models/trained_model.keras")
    print(f"[INFO] Current working directory: {os.getcwd()}")
    print(f"[INFO] Trying to load model from absolute path: {keras_path}")

    # Verify file exists
    if not os.path.exists(keras_path):
        raise FileNotFoundError(f"Local model file not found at: {keras_path}")

    # Try loading as Keras model first
    try:
        model = tf.keras.models.load_model(keras_path)
        model_type = "keras_model"
        print("✓ Model loaded successfully as Keras model from local file")
    except Exception as e:
        print(f"Keras load failed: {e}, trying TFSMLayer...")
        model = tf.keras.layers.TFSMLayer(keras_path, call_endpoint='serving_default')
        model_type = "tfsm_layer"
        print("✓ Model loaded successfully as TFSMLayer from local file")
except Exception as e:
    print(f"Local model loading failed: {e}, trying Hugging Face download...")

    try:
        keras_path = hf_hub_download(
            repo_id="adityaarun1010/my-new-models",
            filename="trained_model.keras"
        )
        try:
            model = tf.keras.models.load_model(keras_path)
            model_type = "keras_model"
            print("✓ Model loaded successfully from Hugging Face")
        except Exception as e2:
            print(f"Hugging Face model load failed: {e2}, trying TFSMLayer...")
            model = tf.keras.layers.TFSMLayer(keras_path, call_endpoint='serving_default')
            model_type = "tfsm_layer"
            print("✓ Model loaded successfully as TFSMLayer from Hugging Face")
    except Exception as e3:
        print(f"All model loading failed: {e3}, using mock model...")
        class MockModel:
            def __init__(self):
                self.num_classes = len(class_names)
            def predict(self, input_arr):
                np.random.seed(42)
                predictions = np.random.dirichlet(np.ones(self.num_classes) * 0.1, size=1)
                max_idx = np.random.randint(0, self.num_classes)
                predictions[0][max_idx] *= 5
                predictions = predictions / np.sum(predictions, axis=1, keepdims=True)
                return predictions
        model = MockModel()
        model_type = "mock"
        print("✓ Using mock model for development")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    model_kwargs={}
)
parser = StrOutputParser()

prompt1 = PromptTemplate(
    template="""
        You are an agriculture expert. 
        A farmer's plant or leaf has the disease: {disease}.
        Suggest:
        1. Short description of the disease
        2. Organic remedies
        3. Chemical remedies (if available)
        4. Preventive measures
        Return the answer in simple and matured and respected language and answer should be within 100 words.
        You should return the answer in such a manner:
        ### Disease Name
        ---
        ### Cause
        ---
        ### Symptoms
        ---
        ### Organic Remedies
        ---
        ### Chemical Remedies
        ---
        ### Prevention
        ---
    """,
    input_variables=["disease"]
)
chain1 = None

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return JSONResponse(content={"error": "Model not loaded."}, status_code=500)
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image = image.resize((128, 128))
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        input_arr = input_arr / 255.0
        input_arr = np.expand_dims(input_arr, axis=0)

        if model_type == "mock":
            prediction = model.predict(input_arr)
        elif model_type == "saved_model":
            infer = model.signatures.get("serving_default") or list(model.signatures.values())[0]
            input_key = list(infer.structured_input_signature[1].keys())[0]
            prediction_dict = infer(**{input_key: tf.constant(input_arr, dtype=tf.float32)})
            output_key = list(prediction_dict.keys())[0]
            prediction = prediction_dict[output_key].numpy()
        elif model_type == "tfsm_layer":
            prediction = model(input_arr)
            if isinstance(prediction, dict):
                prediction = list(prediction.values())[0].numpy()
            else:
                prediction = prediction.numpy()
        else:
            prediction = model.predict(input_arr)

        result_index = np.argmax(prediction, axis=1)[0]
        confidence = float(prediction[0][result_index])

        if confidence < 0.5:
            result = "Unknown Disease (Low confidence)"
            disease_advice = "The confidence level is not enough to make a reliable prediction. Please ensure the image is clear, well-lit, and shows visible disease symptoms on the plant leaf."
        else:
            result = class_names[result_index]
            if "healthy" in result.lower():
                disease_advice = "Good news! Your plant appears to be healthy. Continue with regular care and monitoring."
            elif "unknown" in result.lower():
                disease_advice = "Unable to identify the specific disease. Please consult with a local agricultural expert for proper diagnosis."
            else:
                disease_advice = f"Disease detected: {result}. Please consult with a local agricultural expert for specific treatment recommendations."

        ai_response = disease_advice
        if model_type == "mock":
            ai_response += "\n\n⚠️ Note: This prediction is from a mock model for development testing. For real disease detection, please provide a properly trained model."

        return {
            "class": result,
            "confidence": round(confidence * 100, 2),
            "advice": ai_response,
            "model_type": model_type,
            "status": "success",
            "all_predictions": prediction[0].tolist()[:10]
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(content={
            "error": f"Prediction failed: {str(e)}",
            "status": "error"
        }, status_code=500)
