import os
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

# --- MongoDB connection setup ---
MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD")
if not MONGODB_PASSWORD:
    raise RuntimeError("MONGODB_PASSWORD environment variable not set.")
MONGODB_URI = f"mongodb+srv://ernesttafadzwa:{MONGODB_PASSWORD}@cluster0.mmcyuyx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGODB_URI)
db = client.get_default_database()  # Uses the default database from the URI, or specify db name if needed

# --- Password hashing context ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- JWT Config (ensure these are set in your main.py or .env) ---
SECRET_KEY = "supersecretkey"  # Replace with os.getenv("JWT_SECRET", ...) in production
ALGORITHM = "HS256"

# --- FastAPI app instance ---
app = FastAPI()

# --- Pydantic models ---
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    role: str = "customer"

class SignupResponse(BaseModel):
    email: EmailStr
    role: str
    access_token: str
    token_type: str = "bearer"

# --- ML Classification Models ---
class TicketClassifyRequest(BaseModel):
    subject: str
    description: str

class TicketClassifyResponse(BaseModel):
    department: str
    confidence: float  # 0-1

# --- Utility functions ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: int = 3600):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not any(c.isdigit() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one digit.")
    if not any(c.isalpha() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter.")

# --- Ensure unique index on email field at startup ---
@app.on_event("startup")
async def ensure_unique_email_index():
    await db.users.create_index("email", unique=True)

# --- Signup endpoint ---
@app.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED, summary="Sign up a new user")
async def signup(user: UserSignup):
    """
    Register a new user. Returns user info and JWT token.
    """
    normalized_email = user.email.strip().lower()

    # Check if user already exists
    existing = await db.users.find_one({"email": normalized_email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in instead.")

    # Password strength validation
    validate_password_strength(user.password)

    hashed_pw = hash_password(user.password)
    user_doc = {
        "email": normalized_email,
        "hashed_password": hashed_pw,
        "role": user.role,
        "created_at": datetime.utcnow(),
    }
    try:
        await db.users.insert_one(user_doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in instead.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create user: {str(e)}")
    access_token = create_access_token({"sub": normalized_email, "role": user.role})
    return SignupResponse(
        email=normalized_email,
        role=user.role,
        access_token=access_token,
        token_type="bearer"
    )

# --- ML Ticket Classification Endpoint ---
@app.post("/classify_ticket", response_model=TicketClassifyResponse)
def classify_ticket(req: TicketClassifyRequest):
    """
    Classify a ticket using a scoring system based on keyword matches.
    """
    text = (req.subject + " " + req.description).lower()
    department_keywords = {
        "Technical Support": ["login", "bug", "error", "issue", "crash", "system", "api", "fail", "problem", "reset", "password", "technical", "support", "access", "unable", "not working", "glitch", "slow", "performance", "timeout", "server", "database"],
        "Billing": ["billing", "payment", "charge", "invoice", "refund", "credit", "debit", "card", "subscription", "plan", "renew", "cancel", "overcharge", "price", "cost", "fee", "transaction", "receipt", "account", "statement"],
        "Sales": ["demo", "sales", "pricing", "quote", "purchase", "buy", "trial", "upgrade", "offer", "discount", "order", "product", "feature", "request", "information", "plan", "package", "deal", "contact", "salesperson"],
        "General Support": ["question", "help", "general", "info", "information", "how", "what", "where", "when", "why", "assist", "support", "customer", "service", "feedback", "suggestion", "other"]
    }
    # Tokenize text for robust matching
    import re
    words_in_text = set(re.findall(r"\b\w+\b", text))
    scores = {dept: 0 for dept in department_keywords}
    for dept, keywords in department_keywords.items():
        for word in keywords:
            # Only exact token match
            if word in words_in_text:
                scores[dept] += 1
    # Debug: print scores for each department
    print(f"[ML DEBUG] words_in_text={words_in_text}")
    print(f"[ML DEBUG] scores={scores}")
    # Pick department with highest score
    best_dept = max(scores, key=lambda k: scores[k])
    best_score = scores[best_dept]
    total_keywords = sum(scores.values())
    # Confidence: if no matches, set low confidence
    if best_score == 0:
        return TicketClassifyResponse(department="General Support", confidence=0.5)
    confidence = min(0.99, 0.7 + 0.3 * (best_score / (total_keywords or 1)))
    return TicketClassifyResponse(department=best_dept, confidence=confidence)
