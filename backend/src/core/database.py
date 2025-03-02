from motor.motor_asyncio import AsyncIOMotorClient
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

async def get_database():
    """Return database instance"""
    return Database.db

async def init_db():
    """Initialize database connection"""
    try:
        logger.info("Connecting to MongoDB...")
        Database.client = AsyncIOMotorClient(settings.MONGODB_URL)
        Database.db = Database.client[settings.MONGODB_DB_NAME]
        
        # Verify connection
        await Database.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create collections if they don't exist
        collections = await Database.db.list_collection_names()
        
        # Initialize users collection
        if 'users' in collections:
            # Drop all existing indexes to ensure clean state
            await Database.db.users.drop_indexes()
            logger.info("Dropped existing user indexes")
        else:
            await Database.db.create_collection('users')
            logger.info("Created users collection")
        
        # Create only the email index
        await Database.db.users.create_index(
            [("email", 1)],
            unique=True,
            name="email_unique"
        )
        logger.info("Created email unique index for users")
            
        # Initialize categories collection
        if 'categories' in collections:
            await Database.db.categories.drop_indexes()
        else:
            await Database.db.create_collection('categories')
        
        await Database.db.categories.create_index(
            [("name", 1)],
            unique=True,
            name="name_unique"
        )
        await Database.db.categories.create_index(
            [("order", 1)],
            name="order_index"
        )
        logger.info("Set up categories collection and indexes")
            
        # Initialize messages collection
        if 'messages' in collections:
            await Database.db.messages.drop_indexes()
        else:
            await Database.db.create_collection('messages')
        
        await Database.db.messages.create_index(
            [("user_id", 1), ("created_at", -1)],
            name="user_messages_timestamp"
        )
        logger.info("Set up messages collection and indexes")
            
        return Database.db
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise

async def close_db():
    """Close database connection"""
    if Database.client:
        Database.client.close()
        logger.info("Closed MongoDB connection") 