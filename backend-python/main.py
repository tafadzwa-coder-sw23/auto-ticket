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