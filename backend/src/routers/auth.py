from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from ..core.database import get_database
from ..core.auth import verify_password, get_password_hash, create_access_token
from ..models.user import UserCreate, UserResponse, UserInDB, User
from ..middleware.auth import get_current_user, get_current_active_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/token", summary="Login to get access token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)):
    """Authenticate user and return access token."""
    user = await db.users.find_one({"email": form_data.username})

    if not user:
        logger.error(f"❌ User not found: {form_data.username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    logger.info(f"🔍 User found: {user}")  # Debugging log
    
    # Ensure password exists
    if "password" not in user:
        logger.error("❌ 'password' field is missing in user document!")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server error: Missing password field.")

    if not verify_password(form_data.password, user["password"]):
        logger.error("❌ Password verification failed!")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # Update last login timestamp
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.utcnow()}})
    access_token = create_access_token(data={"sub": user["email"]})

    # Convert to UserResponse to ensure proper serialization
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user["created_at"],
        last_login=user["last_login"],
        preferences=user.get("preferences", {})
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }


@router.post("/register", response_model=User, summary="Register a new user")
async def register(user_data: UserCreate, db=Depends(get_database)):
    """Register a new user."""
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Ensure the password is hashed before storing
    hashed_password = get_password_hash(user_data.password)

    user_dict = user_data.dict()
    user_dict["password"] = hashed_password  # Store hashed password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["last_login"] = None
    user_dict["preferences"] = {}
    user_dict["role"] = "user"

    result = await db.users.insert_one(user_dict)
    
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return User(**created_user)


@router.get("/verify", response_model=UserResponse, summary="Verify current token")
async def verify_token(current_user: UserInDB = Depends(get_current_active_user)):
    """Verify current user's token."""
    try:
        # Convert to UserResponse to ensure proper serialization
        return UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            role=current_user.role,
            is_active=current_user.is_active,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            preferences=current_user.preferences
        )
    except Exception as e:
        logger.error(f"Error in verify_token: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to verify token"
        )


@router.get("/me", response_model=UserResponse, summary="Get current user info")
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current user information."""
    try:
        return UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            name=current_user.name,
            role=current_user.role,
            is_active=current_user.is_active,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            preferences=current_user.preferences
        )
    except Exception as e:
        logger.error(f"Error in read_users_me: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get user info"
        )
