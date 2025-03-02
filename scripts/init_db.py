from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from beanie import init_beanie
import sys
import os

# Add the parent directory to Python path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.category import Category
from models.user import User
from core.config import settings

async def init_database():
    print("Connecting to MongoDB...")
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Drop existing collections
    print("Dropping existing collections...")
    await db.users.drop()
    await db.categories.drop()
    
    print("Initializing Beanie...")
    # Initialize beanie with the models
    await init_beanie(
        database=db,
        document_models=[Category, User]
    )
    
    # Initialize default admin user
    print("Creating admin user...")
    try:
        await User.create_user(
            email="admin@example.com",
            password="admin123",  # Change this in production
            name="Admin User",
            role="admin"
        )
        print("Created admin user successfully")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    
    # Define default categories
    print("Creating default categories...")
    default_categories = [
        {
            "name": "Authentication",
            "icon": "lock",
            "description": "Login, registration, and password issues",
            "order": 1
        },
        {
            "name": "Performance",
            "icon": "zap",
            "description": "System performance and optimization",
            "order": 2
        },
        {
            "name": "Security",
            "icon": "shield",
            "description": "Security concerns and issues",
            "order": 3
        },
        {
            "name": "API",
            "icon": "code",
            "description": "API integration and usage",
            "order": 4
        },
        {
            "name": "Database",
            "icon": "database",
            "description": "Database related issues and queries",
            "order": 5
        },
        {
            "name": "Frontend",
            "icon": "layout",
            "description": "UI/UX and frontend related issues",
            "order": 6
        },
        {
            "name": "Backend",
            "icon": "server",
            "description": "Backend and server-side issues",
            "order": 7
        },
        {
            "name": "Deployment",
            "icon": "cloud",
            "description": "Deployment and hosting issues",
            "order": 8
        },
        {
            "name": "Mobile",
            "icon": "smartphone",
            "description": "Mobile app related issues",
            "order": 9
        },
        {
            "name": "Other",
            "icon": "help-circle",
            "description": "Other technical issues",
            "order": 10
        }
    ]
    
    # Insert new categories
    for category_data in default_categories:
        try:
            category = Category(**category_data)
            await category.save()
            print(f"Created category: {category.name}")
        except Exception as e:
            print(f"Error creating category {category_data['name']}: {e}")

if __name__ == "__main__":
    print("Starting database initialization...")
    asyncio.run(init_database())
    print("Database initialization complete!") 