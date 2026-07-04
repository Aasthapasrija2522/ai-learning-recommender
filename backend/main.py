from quiz_data import QUIZ_QUESTIONS
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from recommendation_engine import generate_recommendations
from datetime import datetime

import models
import schemas
import auth
from database import engine, get_db
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

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
@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload.get("sub")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user

@app.get("/me", response_model=schemas.UserResponse)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user
@app.post("/profile", response_model=schemas.ProfileResponse)
def create_profile(
    profile: schemas.ProfileCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    new_profile = models.Profile(
        user_id=current_user.id,
        interests=profile.interests,
        career_goal=profile.career_goal,
        current_skills=profile.current_skills,
        daily_study_minutes=profile.daily_study_minutes
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@app.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile
@app.get("/quiz/questions")
def get_quiz_questions():
    questions_only = [
        {"id": q["id"], "question": q["question"], "options": q["options"]}
        for q in QUIZ_QUESTIONS
    ]
    return {"questions": questions_only}


@app.post("/quiz/submit", response_model=schemas.QuizResult)
def submit_quiz(
    submission: schemas.QuizSubmission,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    score = 0
    for question in QUIZ_QUESTIONS:
        user_answer = submission.answers.get(question["id"])
        if user_answer == question["correct"]:
            score += 1

    new_attempt = models.QuizAttempt(
        user_id=current_user.id,
        score=score,
        total_questions=len(QUIZ_QUESTIONS),
        answers=submission.answers
    )

    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return new_attempt
@app.post("/roadmap/generate", response_model=schemas.RoadmapResponse)
def generate_roadmap(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Please complete your profile before generating a roadmap")

    latest_quiz = (
        db.query(models.QuizAttempt)
        .filter(models.QuizAttempt.user_id == current_user.id)
        .order_by(models.QuizAttempt.created_at.desc())
        .first()
    )
    if not latest_quiz:
        raise HTTPException(status_code=400, detail="Please complete the skill assessment quiz first")

    result = generate_recommendations(
        career_goal=profile.career_goal,
        current_skills=profile.current_skills,
        score=latest_quiz.score,
        total_questions=latest_quiz.total_questions
    )

    new_roadmap = models.Roadmap(
        user_id=current_user.id,
        skill_level=result["skill_level"],
        recommendations=result["recommendations"]
    )

    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    return new_roadmap


@app.get("/roadmap/latest", response_model=schemas.RoadmapResponse)
def get_latest_roadmap(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = (
        db.query(models.Roadmap)
        .filter(models.Roadmap.user_id == current_user.id)
        .order_by(models.Roadmap.created_at.desc())
        .first()
    )
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")

    return roadmap
@app.post("/progress", response_model=schemas.TopicProgressResponse)
def update_progress(
    update: schemas.TopicProgressUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = (
        db.query(models.TopicProgress)
        .filter(
            models.TopicProgress.user_id == current_user.id,
            models.TopicProgress.topic_id == update.topic_id
        )
        .first()
    )

    if existing:
        existing.completed = update.completed
        existing.completed_at = datetime.utcnow() if update.completed else None
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_progress = models.TopicProgress(
            user_id=current_user.id,
            topic_id=update.topic_id,
            completed=update.completed,
            completed_at=datetime.utcnow() if update.completed else None
        )
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return new_progress


@app.get("/progress/summary", response_model=schemas.ProgressSummary)
def get_progress_summary(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    latest_roadmap = (
        db.query(models.Roadmap)
        .filter(models.Roadmap.user_id == current_user.id)
        .order_by(models.Roadmap.created_at.desc())
        .first()
    )
    if not latest_roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")

    roadmap_topic_ids = [rec["topic_id"] for rec in latest_roadmap.recommendations]

    progress_rows = (
        db.query(models.TopicProgress)
        .filter(
            models.TopicProgress.user_id == current_user.id,
            models.TopicProgress.topic_id.in_(roadmap_topic_ids)
        )
        .all()
    )

    progress_by_topic = {p.topic_id: p for p in progress_rows}

    topics_status = []
    completed_count = 0
    for topic_id in roadmap_topic_ids:
        progress = progress_by_topic.get(topic_id)
        is_completed = progress.completed if progress else False
        completed_at = progress.completed_at if progress else None

        if is_completed:
            completed_count += 1

        topics_status.append({
            "topic_id": topic_id,
            "completed": is_completed,
            "completed_at": completed_at
        })

    total = len(roadmap_topic_ids)
    percentage = round((completed_count / total) * 100, 1) if total > 0 else 0.0

    return {
        "total_topics": total,
        "completed_topics": completed_count,
        "percentage": percentage,
        "topics": topics_status
    }