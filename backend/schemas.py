from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ProfileCreate(BaseModel):
    interests: list[str]
    career_goal: str
    current_skills: list[str]
    daily_study_minutes: int


class ProfileResponse(BaseModel):
    id: int
    interests: list[str]
    career_goal: str
    current_skills: list[str]
    daily_study_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True
class QuizSubmission(BaseModel):
    answers: dict[str, str]

class QuizResult(BaseModel):
    id: int
    score: int
    total_questions: int
    answers: dict
    created_at: datetime

    class Config:
        from_attributes = True