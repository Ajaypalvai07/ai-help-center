from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from beanie import init_beanie
import sys
import os

# Add the parent directory to Python path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.category import Category
from core.config import settings

async def init_categories():
    print("Connecting to MongoDB...")
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Initialize beanie with the Category model
    await init_beanie(
        database=db,
        document_models=[Category]
    )
    
    # Define categories that match the frontend defaults
    categories = [
        {
            "name": "Maps Integration",
            "icon": "map",
            "description": "Issues with map rendering or location services",
            "order": 1,
            "is_active": True
        },
        {
            "name": "Database Issues",
            "icon": "database",
            "description": "Data persistence and query problems",
            "order": 2,
            "is_active": True
        },
        {
            "name": "Network Problems",
            "icon": "network",
            "description": "API connectivity and request issues",
            "order": 3,
            "is_active": True
        },
        {
            "name": "Authentication",
            "icon": "lock",
            "description": "Login, signup, and access control",
            "order": 4,
            "is_active": True
        },
        {
            "name": "Backend Services",
            "icon": "server",
            "description": "Server-side application issues",
            "order": 5,
            "is_active": True
        },
        {
            "name": "Frontend Issues",
            "icon": "code",
            "description": "UI/UX and client-side problems",
            "order": 6,
            "is_active": True
        },
        {
            "name": "Cloud Services",
            "icon": "cloud",
            "description": "AWS, Azure, or GCP related issues",
            "order": 7,
            "is_active": True
        },
        {
            "name": "Mobile Apps",
            "icon": "smartphone",
            "description": "iOS and Android specific problems",
            "order": 8,
            "is_active": True
        },
        {
            "name": "Configuration",
            "icon": "settings",
            "description": "Setup and environment issues",
            "order": 9,
            "is_active": True
        },
        {
            "name": "Other Issues",
            "icon": "help",
            "description": "General technical support",
            "order": 10,
            "is_active": True
        }
    ]
    
    print("Creating categories...")
    # Clear existing categories
    await Category.delete_all()
    
    # Create new categories
    for category_data in categories:
        category = Category(**category_data)
        await category.save()
        print(f"Created category: {category.name}")

if __name__ == "__main__":
    print("Starting category initialization...")
    asyncio.run(init_categories())
    print("Category initialization complete!") 