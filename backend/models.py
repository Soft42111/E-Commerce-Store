from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

# User Models
class UserProfile(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"
    is_default: bool = False

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    password_hash: str
    is_verified: bool = False
    verification_code: Optional[str] = None
    verification_code_expires: Optional[datetime] = None
    profile: UserProfile = UserProfile()
    addresses: List[Address] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailVerification(BaseModel):
    email: EmailStr
    verification_code: str

class UserResponse(BaseModel):
    id: str
    email: str
    is_verified: bool
    profile: UserProfile
    created_at: datetime

# Product Models
class Product(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    images: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    materials: List[str] = []
    stock_quantity: int = 0
    featured: bool = False
    on_sale: bool = False
    rating: float = 0.0
    reviews_count: int = 0
    set_size: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductFilters(BaseModel):
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    on_sale: Optional[bool] = None
    featured: Optional[bool] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "name"
    page: int = 1
    limit: int = 20

# Cart Models
class CartItem(BaseModel):
    id: Optional[str] = None
    user_id: str
    product_id: str
    quantity: int
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None
    added_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CartResponse(BaseModel):
    items: List[Dict]
    total_items: int
    subtotal: float

# Wishlist Models
class WishlistItem(BaseModel):
    id: Optional[str] = None
    user_id: str
    product_id: str
    added_at: datetime = Field(default_factory=datetime.utcnow)

class WishlistCreate(BaseModel):
    product_id: str

# Order Models
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed" 
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    product_image: str
    quantity: int
    price: float
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None

class Order(BaseModel):
    id: Optional[str] = None
    user_id: str
    items: List[OrderItem]
    shipping_address: Address
    billing_address: Optional[Address] = None
    subtotal: float
    shipping_cost: float = 0.0
    tax: float = 0.0
    total: float
    status: OrderStatus = OrderStatus.PENDING
    payment_method: str
    tracking_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    shipping_address: Address
    billing_address: Optional[Address] = None
    payment_method: str

# Review Models
class Review(BaseModel):
    id: Optional[str] = None
    user_id: str
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    title: str
    comment: str
    verified_purchase: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: str
    comment: str

class ReviewResponse(BaseModel):
    id: str
    user_name: str
    rating: int
    title: str
    comment: str
    verified_purchase: bool
    created_at: datetime

# Category Models
class Category(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    description: str
    image: str
    product_count: int = 0

# Response Models
class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    details: Optional[str] = None