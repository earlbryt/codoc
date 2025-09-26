# Cocoa Leaf Health API (FastAPI + ONNX Runtime)

This is a minimal FastAPI backend that loads an ONNX classification model and exposes a `/predict` endpoint.

## Features
- Loads ONNX model once at startup (fast inference)
- Preprocess: resize to 224x224, RGB, normalize to [0,1], NCHW
- Runs inference with onnxruntime and returns class name + confidence
- CORS enabled for easy frontend integration

## Project Structure
```
backend/
├─ main.py              # FastAPI app
├─ requirements.txt     # Python dependencies
├─ labels.json          # Optional label names for your classes
└─ models/
   └─ yolov11-cls.onnx  # Your ONNX model (copied here)
```

## Setup
1. Create a virtual environment and install deps
```
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

2. Ensure your model exists at `backend/models/yolov11-cls.onnx`.

3. (Optional) Update `labels.json` with your exact class names (order must match model training).

4. Run the server
```
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## API
- `GET /health` → `{ "status": "ok" }`
- `POST /predict` (multipart/form-data) with `file` field containing an image.
  - Response example:
```
{
  "className": "Healthy Leaf",
  "confidence": 0.9532,
  "index": 0,
  "topK": [ {"className": "Healthy Leaf", "confidence": 0.95}, ... ],
  "isHealthy": true
}
```

## Deploy
You can deploy to services like Render, Railway, Fly.io, or a VM.
- Make sure to serve with `uvicorn` and expose port 8000
- Set environment variables if you want custom paths:
  - `MODEL_PATH` (default `models/yolov11-cls.onnx`)
  - `LABELS_PATH` (default `labels.json`)

Update your frontend `src/config.ts` with your deployed API base URL.
