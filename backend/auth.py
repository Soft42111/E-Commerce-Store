from datetime import datetime, timedelta
from typing import Optional, Dict
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import random
import string

from models import User, UserCreate, UserLogin, UserResponse, EmailVerification
from database import find_one, insert_one, update_one
from email_service import send_verification_email

# Security configurations
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

class AuthService:
    def __init__(self):
        pass
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    def generate_verification_code(self) -> str:
        """Generate a 6-digit verification code"""
        return ''.join(random.choices(string.digits, k=6))
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create a JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
            return {"user_id": user_id}
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password"""
        user_dict = await find_one("users", {"email": email})
        if not user_dict:
            return None
        
        user = User(**user_dict)
        if not self.verify_password(password, user.password_hash):
            return None
        
        return user
    
    async def create_user(self, user_create: UserCreate) -> User:
        """Create a new user account"""
        # Check if passwords match
        if user_create.password != user_create.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match"
            )
        
        # Check if user already exists
        existing_user = await find_one("users", {"email": user_create.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate verification code
        verification_code = self.generate_verification_code()
        verification_expires = datetime.utcnow() + timedelta(hours=24)  # Code expires in 24 hours
        
        # Create user
        user = User(
            email=user_create.email,
            password_hash=self.get_password_hash(user_create.password),
            verification_code=verification_code,
            verification_code_expires=verification_expires,
            is_verified=False
        )
        
        # Save to database
        user_dict = user.dict()
        user_dict.pop('id', None)  # Remove id field for insertion
        user_id = await insert_one("users", user_dict)
        user.id = user_id
        
        # Send verification email
        try:
            await send_verification_email(user.email, verification_code)
        except Exception as e:
            # Log the error but don't fail user creation
            print(f"Failed to send verification email: {e}")
        
        return user
    
    async def verify_email(self, verification: EmailVerification) -> bool:
        """Verify user email with verification code"""
        user_dict = await find_one("users", {"email": verification.email})
        if not user_dict:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = User(**user_dict)
        
        # Check if already verified
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already verified"
            )
        
        # Check verification code
        if user.verification_code != verification.verification_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )
        
        # Check if code is expired
        if user.verification_code_expires and user.verification_code_expires < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired"
            )
        
        # Update user as verified
        await update_one("users", {"email": verification.email}, {
            "is_verified": True,
            "verification_code": None,
            "verification_code_expires": None
        })
        
        return True
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
        """Get the current authenticated user"""
        token_data = self.verify_token(credentials.credentials)
        user_dict = await find_one("users", {"_id": token_data["user_id"]})
        
        if user_dict is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        
        user = User(**user_dict)
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Please verify your email address"
            )
        
        return user
    
    async def get_current_user_optional(self, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[User]:
        """Get the current user if authenticated, otherwise return None"""
        if not credentials:
            return None
        
        try:
            return await self.get_current_user(credentials)
        except HTTPException:
            return None

# Create service instance
auth_service = AuthService()