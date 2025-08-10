from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict
import os
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

# Database instance
db = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db.database = db.client[os.environ['DB_NAME']]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("verification_code")
        
        # Products collection indexes
        await db.database.products.create_index([("name", "text"), ("description", "text")])
        await db.database.products.create_index("category")
        await db.database.products.create_index("featured")
        await db.database.products.create_index("on_sale")
        await db.database.products.create_index("price")
        
        # Cart collection indexes
        await db.database.cart_items.create_index([("user_id", 1), ("product_id", 1)])
        
        # Wishlist collection indexes
        await db.database.wishlist_items.create_index([("user_id", 1), ("product_id", 1)], unique=True)
        
        # Orders collection indexes
        await db.database.orders.create_index("user_id")
        await db.database.orders.create_index("status")
        await db.database.orders.create_index("created_at")
        
        # Reviews collection indexes
        await db.database.reviews.create_index([("product_id", 1), ("user_id", 1)], unique=True)
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

# Helper functions for database operations
def get_collection(collection_name: str):
    """Get a database collection"""
    return db.database[collection_name]

async def insert_one(collection_name: str, document: dict) -> str:
    """Insert a single document and return its ID"""
    collection = get_collection(collection_name)
    result = await collection.insert_one(document)
    return str(result.inserted_id)

async def find_one(collection_name: str, filter_dict: dict) -> dict:
    """Find a single document"""
    collection = get_collection(collection_name)
    document = await collection.find_one(filter_dict)
    if document:
        document['id'] = str(document['_id'])
        del document['_id']
    return document

async def find_many(collection_name: str, filter_dict: dict = None, sort_dict: dict = None, skip: int = 0, limit: int = 0) -> List[dict]:
    """Find multiple documents"""
    collection = get_collection(collection_name)
    cursor = collection.find(filter_dict or {})
    
    if sort_dict:
        cursor = cursor.sort(list(sort_dict.items()))
    if skip > 0:
        cursor = cursor.skip(skip)
    if limit > 0:
        cursor = cursor.limit(limit)
    
    documents = await cursor.to_list(length=None)
    
    # Convert _id to id for all documents
    for doc in documents:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    
    return documents

async def update_one(collection_name: str, filter_dict: dict, update_dict: dict) -> bool:
    """Update a single document"""
    collection = get_collection(collection_name)
    update_dict['updated_at'] = datetime.utcnow()
    result = await collection.update_one(filter_dict, {"$set": update_dict})
    return result.modified_count > 0

async def delete_one(collection_name: str, filter_dict: dict) -> bool:
    """Delete a single document"""
    collection = get_collection(collection_name)
    result = await collection.delete_one(filter_dict)
    return result.deleted_count > 0

async def delete_many(collection_name: str, filter_dict: dict) -> int:
    """Delete multiple documents and return count"""
    collection = get_collection(collection_name)
    result = await collection.delete_many(filter_dict)
    return result.deleted_count

async def count_documents(collection_name: str, filter_dict: dict = None) -> int:
    """Count documents matching filter"""
    collection = get_collection(collection_name)
    return await collection.count_documents(filter_dict or {})