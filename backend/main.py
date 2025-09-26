from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as ort
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

MODEL_PATH = os.getenv("MODEL_PATH", "models/yolov11-cls.onnx")
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

# Initialize ONNX Runtime session
try:
    session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"]) 
    input_name = session.get_inputs()[0].name
    input_shape = session.get_inputs()[0].shape  # e.g., [1, 3, 224, 224]
except Exception as e:
    raise RuntimeError(f"Failed to load model at {MODEL_PATH}: {e}")


def preprocess_image(image_bytes: bytes, size: int = 224) -> np.ndarray:
    """Preprocess image to NCHW float32 [0,1] normalized as common for classification models."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((size, size), Image.BILINEAR)
    arr = np.array(img).astype("float32") / 255.0  # HWC, [0,1]
    arr = np.transpose(arr, (2, 0, 1))  # CHW
    arr = np.expand_dims(arr, 0)  # NCHW
    return arr


def softmax(x: np.ndarray) -> np.ndarray:
    x = x - np.max(x, axis=1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=1, keepdims=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        inp = preprocess_image(contents, size=224)
        outputs = session.run(None, {input_name: inp})
        logits = outputs[0]  # shape [1, num_classes]
        probs = softmax(logits)
        idx = int(np.argmax(probs, axis=1)[0])
        confidence = float(probs[0, idx])
        label = LABELS[idx] if LABELS and idx < len(LABELS) else f"class_{idx}"

        # Optional heuristic for healthy flag if labels include 'healthy'
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
                {"className": (LABELS[i] if LABELS and i < len(LABELS) else f"class_{i}"), "confidence": float(probs[0, i])}
                for i in np.argsort(-probs[0])[:5].tolist()
            ],
            **({"isHealthy": is_healthy} if is_healthy is not None else {}),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
