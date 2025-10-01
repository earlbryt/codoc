from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import json
import os

app = FastAPI(title="Cocoa Leaf Health Inference API")

# CORS - adjust origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", "models/model.tflite")
LABELS_PATH = os.getenv("LABELS_PATH", "labels.json")

# Load labels if provided
LABELS = None
if os.path.exists(LABELS_PATH):
    try:
        with open(LABELS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Accept {"labels": [...]} or a plain list
            if isinstance(data, dict) and "labels" in data:
                LABELS = data["labels"]
            elif isinstance(data, list):
                LABELS = data
    except Exception:
        LABELS = None

# Initialize TFLite interpreter
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
except Exception as e:
    raise RuntimeError(f"Failed to load model at {MODEL_PATH}: {e}")


def preprocess_image(image_bytes: bytes, size: int = 224) -> np.ndarray:
    """Preprocess image for TFLite model: resize to 224x224 and normalize to [0,1]."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((size, size), Image.BILINEAR)
    arr = np.array(img).astype("float32") / 255.0  # YOLOv11 uses 0-1 normalization
    arr = np.expand_dims(arr, axis=0).astype("float32")  # Add batch dimension
    return arr


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        inp = preprocess_image(contents, size=224)
        
        # Run TFLite inference
        interpreter.set_tensor(input_details[0]['index'], inp)
        interpreter.invoke()
        output = interpreter.get_tensor(output_details[0]['index'])
        
        # Get predicted class
        idx = int(np.argmax(output[0]))
        confidence = float(output[0][idx])
        label = LABELS[idx] if LABELS and idx < len(LABELS) else f"class_{idx}"

        # Check if healthy
        is_healthy = None
        if LABELS:
            for healthy_key in ["healthy", "normal"]:
                candidates = [i for i, l in enumerate(LABELS) if healthy_key in l.lower()]
                if candidates:
                    is_healthy = (idx in candidates)
                    break

        return {
            "className": label,
            "confidence": round(confidence, 4),
            "index": idx,
            "topK": [
                {"className": (LABELS[i] if LABELS and i < len(LABELS) else f"class_{i}"), "confidence": float(output[0][i])}
                for i in np.argsort(-output[0])[:5].tolist()
            ],
            **({"isHealthy": is_healthy} if is_healthy is not None else {}),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
