from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from models.category import Category
from models.user import User
from beanie import PydanticObjectId

router = APIRouter()

@router.get("/", response_model=List[Category])
async def get_categories(
    active_only: bool = Query(True, description="Only return active categories"),
    parent_id: Optional[str] = Query(None, description="Filter by parent category ID")
):
    """Get all categories"""
    query = {}
    if active_only:
        query["is_active"] = True
    if parent_id:
        try:
            query["parent_id"] = PydanticObjectId(parent_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid parent_id format")
        
    categories = await Category.find(query).sort("order").to_list()
    return categories

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: str):
    """Get a specific category by ID"""
    try:
        category = await Category.get(PydanticObjectId(category_id))
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category ID format")

@router.post("/", response_model=Category)
async def create_category(category: Category):
    """Create a new category"""
    await category.save()
    return category

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: str, category_update: Category):
    """Update a category"""
    try:
        category = await Category.get(PydanticObjectId(category_id))
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        for field, value in category_update.dict(exclude_unset=True).items():
            setattr(category, field, value)
        
        await category.save_with_timestamp()
        return category
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category ID format")

@router.delete("/{category_id}")
async def delete_category(category_id: str):
    """Delete a category"""
    try:
        category = await Category.get(PydanticObjectId(category_id))
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        await category.delete()
        return {"message": "Category deleted successfully"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category ID format") 