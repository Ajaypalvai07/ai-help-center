from typing import Optional, Dict, Any
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field

class Message(Document):
    content: str = Field(..., description="Content of the message")
    category: str = Field(..., description="Category of the message")
    user_id: Optional[str] = None
    type: str = "user"  # "user" or "ai"
    solution: Optional[Dict[str, Any]] = Field(default=None, description="AI-generated solution")
    context: Dict[str, Any] = Field(default_factory=dict, description="Additional context")
    status: str = Field(default="sent", description="Status of the message")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    class Settings:
        name = "messages"
        use_revision = True

    async def save_with_timestamp(self) -> None:
        self.updated_at = datetime.utcnow()
        await self.save()

    def dict(self, *args, **kwargs) -> Dict[str, Any]:
        # Convert to dict and handle ObjectId serialization
        d = super().dict(*args, **kwargs)
        if "_id" in d:
            d["_id"] = str(d["_id"])
        if "id" in d:
            d["id"] = str(d["id"])
        if "user_id" in d and d["user_id"] is not None:
            d["user_id"] = str(d["user_id"])
        return d

    model_config = {
        "json_schema_extra": {
            "example": {
                "content": "How do I reset my password?",
                "category": "Authentication",
                "status": "sent"
            }
        },
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            PydanticObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    } 