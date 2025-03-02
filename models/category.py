from typing import Optional, Annotated, Dict, Any
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field, BeforeValidator
from datetime import datetime

class Category(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str = Field(..., description="Name of the category")
    icon: str = Field(..., description="Icon identifier for the category")
    description: str = Field(..., description="Description of the category")
    order: int = Field(default=0, index=True, description="Display order of the category")
    is_active: bool = Field(default=True, description="Whether the category is active")
    parent_id: Optional[PydanticObjectId] = Field(None, description="ID of parent category if any")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "categories"
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
        if "parent_id" in d and d["parent_id"] is not None:
            d["parent_id"] = str(d["parent_id"])
        return d

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Authentication",
                "icon": "lock",
                "description": "Login, registration, and password issues",
                "order": 1,
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