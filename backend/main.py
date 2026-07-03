from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"message": "Welcome to your AI Learning Recommender API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user