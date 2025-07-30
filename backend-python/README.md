# Backend Python Server for Ticket Scribe AI Portal

## Setup

1. Create and activate a virtual environment (optional but recommended):

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoint

- POST `/predict`

Request body example:

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

Response example:

```json
{
  "prediction": "setosa"
}
```

This backend uses a simple RandomForest model trained on the Iris dataset for demonstration purposes.
