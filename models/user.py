from typing import Optional, List, Dict, Any
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, ConfigDict
import bcrypt

class User(Document):
    email: EmailStr = Field(..., index=True, unique=True, description="User's email address")
    password: str = Field(..., description="Hashed password")
    name: str = Field(..., description="User's full name")
    role: str = Field(default="user", index=True, description="User's role (user, admin, support)")
    is_active: bool = Field(default=True, description="Whether the user account is active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    preferences: dict = Field(default_factory=dict)

    class Settings:
        name = "users"
        use_revision = True

    def verify_password(self, password: str) -> bool:
        try:
            return bcrypt.checkpw(
                password.encode('utf-8'),
                self.password.encode('utf-8')
            )
        except Exception:
            return False

    @classmethod
    async def create_user(cls, email: str, password: str, name: str, role: str = "user"):
        try:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
            user = cls(
                email=email,
                password=hashed.decode('utf-8'),
                name=name,
                role=role
            )
            await user.save()
            return user
        except Exception as e:
            raise ValueError(f"Error creating user: {str(e)}")

    def dict(self, *args, **kwargs) -> Dict[str, Any]:
        # Convert to dict and handle ObjectId serialization
        d = super().dict(*args, **kwargs)
        if "_id" in d:
            d["_id"] = str(d["_id"])
        if "id" in d:
            d["id"] = str(d["id"])
        return d

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "role": "user",
                "is_active": True
            }
        },
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            PydanticObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    } 