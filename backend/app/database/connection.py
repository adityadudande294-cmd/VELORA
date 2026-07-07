import os
import json
from typing import Dict, List, Any, Optional
from app.config.settings import settings

# Import Motor client safely; fallback to mock database if motor is missing or fails
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    HAS_MOTOR = True
except ImportError:
    HAS_MOTOR = False

class MockCollection:
    def __init__(self, name: str, db_dir: str):
        self.name = name
        self.file_path = os.path.join(db_dir, f"{name}.json")
        
    def _load(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.file_path):
            return []
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading mock table {self.name}: {e}")
            return []
            
    def _save(self, data: List[Dict[str, Any]]):
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving mock table {self.name}: {e}")
            
    async def find(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        data = self._load()
        if not query:
            return data
        results = []
        for item in data:
            match = True
            for k, v in query.items():
                # Query nested values or list elements if needed, or exact match
                if k.startswith("$") or item.get(k) != v:
                    if not k.startswith("$"):
                        match = False
                        break
            if match:
                results.append(item)
        return results

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data = self._load()
        for item in data:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    async def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        data = self._load()
        data.append(document)
        self._save(data)
        return {"inserted_id": document.get("id", document.get("_id", "unknown"))}

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> Any:
        data = self._load()
        set_data = update.get("$set", {})
        updated = False
        
        for item in data:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                item.update(set_data)
                updated = True
                break
                
        if not updated and upsert:
            new_doc = query.copy()
            new_doc.update(set_data)
            data.append(new_doc)
            self._save(data)
            return True
            
        self._save(data)
        return updated

    async def delete_one(self, query: Dict[str, Any]) -> bool:
        data = self._load()
        original_len = len(data)
        data = [item for item in data if not all(item.get(k) == v for k, v in query.items())]
        self._save(data)
        return len(data) < original_len

    async def create_index(self, name: str, unique: bool = False):
        # Dummy index placeholder for local JSON collections compatibility
        return name


class MockDatabase:
    def __init__(self, db_dir: str):
        self.db_dir = db_dir
        os.makedirs(db_dir, exist_ok=True)
        self.collections = {}

    def __getitem__(self, name: str) -> MockCollection:
        if name not in self.collections:
            self.collections[name] = MockCollection(name, self.db_dir)
        return self.collections[name]

# Active DB Globals
db_client = None
db = None
is_mock_db = True

async def init_db():
    global db_client, db, is_mock_db
    
    if HAS_MOTOR and settings.MONGODB_URI:
        try:
            print("Connecting to MongoDB Atlas Cluster with connection pooling...")
            # Configure Connection Pooling parameters
            db_client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                maxPoolSize=100,
                minPoolSize=10
            )
            db = db_client[settings.DATABASE_NAME]
            # Simple ping to verify connection
            await db_client.admin.command('ping')
            is_mock_db = False
            
            # Setup database indexes for performance
            print("Creating database search indexes...")
            await db["stories"].create_index("id", unique=True)
            await db["users"].create_index("email", unique=True)
            await db["categories"].create_index("slug", unique=True)
            
            print("Successfully connected to MongoDB Atlas and created indexes.")
            return
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}. Falling back to Local Mock JSON Database...")
            
    # Fallback to local json mock DB
    print(f"Using Local Mock JSON Database (Storage: {settings.LOCAL_DB_DIR}/*.json)")
    db = MockDatabase(settings.LOCAL_DB_DIR)
    is_mock_db = True

async def close_db():
    global db_client, db
    if db_client:
        db_client.close()
        print("Database connections closed.")
    db = None

def get_db():
    global db
    if db is None:
        # Lazy load mock database if not initialized
        db = MockDatabase(settings.LOCAL_DB_DIR)
    return db
