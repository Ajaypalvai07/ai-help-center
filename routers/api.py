from fastapi import APIRouter, HTTPException, Depends, Body, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import jwt
from core.config import settings
from services.ai_service import AIService
from models.category import Category
from models.user import User
from models.message import Message
from routers.categories import router as categories_router
from beanie import PydanticObjectId

router = APIRouter()
ai_service = AIService()

router.include_router(categories_router, prefix="/categories", tags=["categories"])

# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

# Message Models
class MessageRequest(BaseModel):
    content: str
    category: str
    context: Dict[str, Any] = {}

class SimilarCase(BaseModel):
    id: str
    title: str
    similarity: float

class Solution(BaseModel):
    answer: str
    steps: List[str]
    references: List[str]

class MessageResponse(BaseModel):
    solution: Solution
    confidence: float
    similar_cases: List[SimilarCase]

# Auth Endpoints
@router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = await User.find_one({"email": request.email})
    if not user or not user.verify_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode(
        {"user_id": str(user.id), "exp": datetime.utcnow() + settings.JWT_EXPIRES},
        settings.JWT_SECRET
    )
    
    return LoginResponse(
        token=token,
        user=user.dict(exclude={"password"})
    )

# Chat Endpoints
@router.post("/chat/analyze", response_model=MessageResponse)
async def analyze_message(request: MessageRequest):
    try:
        ai_response = await ai_service.generate_solution(
            request.content,
            request.category,
            request.context
        )
        
        # Save message to database
        message = Message(
            content=request.content,
            category=request.category,
            solution=ai_response,
            context=request.context
        )
        await message.save()
        
        # Return the response directly since it matches our model structure
        return MessageResponse(
            solution=Solution(**ai_response["solution"]),
            confidence=float(ai_response["confidence"]),
            similar_cases=[SimilarCase(**case) for case in ai_response["similar_cases"]]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Feedback Endpoints
@router.post("/chat/feedback/{message_id}")
async def submit_feedback(message_id: str, feedback: Dict[str, Any] = Body(...)):
    message = await Message.find_one({"_id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.feedback = feedback
    await message.save()
    return {"status": "success"}

# Admin Endpoints
@router.get("/admin/metrics")
async def get_admin_metrics():
    total_users = await User.count()
    total_messages = await Message.count()
    resolved_issues = await Message.count({"status": "resolved"})
    
    return {
        "total_users": total_users,
        "total_messages": total_messages,
        "resolved_issues": resolved_issues,
        "resolution_rate": resolved_issues / total_messages if total_messages > 0 else 0
    }

@router.get("/admin/users")
async def get_admin_users():
    users = await User.find_all().to_list()
    return [user.dict(exclude={"password"}) for user in users]

@router.get("/admin/roles")
async def get_admin_roles():
    return [
        {"id": "admin", "name": "Administrator"},
        {"id": "user", "name": "User"},
        {"id": "support", "name": "Support Agent"}
    ] 