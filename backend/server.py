from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
import os
import logging
from pathlib import Path
from datetime import datetime, timedelta
import random

# Import models and services
from models import *
from database import *
from auth import auth_service
from email_service import send_order_confirmation_email

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await seed_initial_data()
    yield
    # Shutdown
    await close_mongo_connection()

# Create the main app
app = FastAPI(title="LuxuryLine E-commerce API", lifespan=lifespan)

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================
# AUTHENTICATION ENDPOINTS
# ========================================

@api_router.post("/auth/signup", response_model=SuccessResponse)
async def signup(user_create: UserCreate):
    """Register a new user and send verification email"""
    try:
        user = await auth_service.create_user(user_create)
        return SuccessResponse(
            message="Account created successfully! Please check your email for verification code.",
            data={"email": user.email, "verification_required": True}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/auth/verify-email", response_model=SuccessResponse)
async def verify_email(verification: EmailVerification):
    """Verify user email with verification code"""
    try:
        await auth_service.verify_email(verification)
        return SuccessResponse(message="Email verified successfully! You can now login.")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Email verification error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/auth/login")
async def login(user_login: UserLogin):
    """Login user and return access token"""
    try:
        user = await auth_service.authenticate_user(user_login.email, user_login.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Please verify your email address before logging in"
            )
        
        access_token = auth_service.create_access_token(data={"sub": user.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=user.id,
                email=user.email,
                is_verified=user.is_verified,
                profile=user.profile,
                created_at=user.created_at
            )
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(auth_service.get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_verified=current_user.is_verified,
        profile=current_user.profile,
        created_at=current_user.created_at
    )

# ========================================
# PRODUCT ENDPOINTS
# ========================================

@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    colors: Optional[str] = None,
    sizes: Optional[str] = None,
    materials: Optional[str] = None,
    on_sale: Optional[bool] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "name",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get products with filtering, sorting, and pagination"""
    try:
        # Build filter
        filter_dict = {}
        
        if category:
            filter_dict["category"] = category
        if min_price is not None:
            filter_dict.setdefault("price", {})["$gte"] = min_price
        if max_price is not None:
            filter_dict.setdefault("price", {})["$lte"] = max_price
        if colors:
            color_list = [c.strip() for c in colors.split(",")]
            filter_dict["colors"] = {"$in": color_list}
        if sizes:
            size_list = [s.strip() for s in sizes.split(",")]
            filter_dict["sizes"] = {"$in": size_list}
        if materials:
            material_list = [m.strip() for m in materials.split(",")]
            filter_dict["materials"] = {"$in": material_list}
        if on_sale is not None:
            filter_dict["on_sale"] = on_sale
        if featured is not None:
            filter_dict["featured"] = featured
        if search:
            filter_dict["$text"] = {"$search": search}

        # Build sort
        sort_dict = {}
        if sort_by == "price-low":
            sort_dict["price"] = 1
        elif sort_by == "price-high":
            sort_dict["price"] = -1
        elif sort_by == "rating":
            sort_dict["rating"] = -1
        elif sort_by == "newest":
            sort_dict["created_at"] = -1
        else:
            sort_dict["name"] = 1

        # Calculate skip
        skip = (page - 1) * limit

        # Get products
        products = await find_many("products", filter_dict, sort_dict, skip, limit)
        total_count = await count_documents("products", filter_dict)

        return {
            "products": products,
            "total": total_count,
            "page": page,
            "limit": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    except Exception as e:
        logger.error(f"Get products error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        product = await find_one("products", {"_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return product
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get product error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/products/{product_id}/recommendations")
async def get_product_recommendations(product_id: str, limit: int = 4):
    """Get recommended products based on current product"""
    try:
        # Get current product to find similar items
        current_product = await find_one("products", {"_id": product_id})
        if not current_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Find products in same category, excluding current product
        filter_dict = {
            "category": current_product["category"],
            "_id": {"$ne": product_id}
        }
        
        recommendations = await find_many("products", filter_dict, {"rating": -1}, 0, limit)
        return {"recommendations": recommendations}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get recommendations error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/categories")
async def get_categories():
    """Get all product categories"""
    try:
        # Get categories with product counts
        pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        
        collection = get_collection("products")
        result = await collection.aggregate(pipeline).to_list(length=None)
        
        categories = []
        for item in result:
            category_name = item["_id"]
            categories.append({
                "name": category_name.title(),
                "slug": category_name,
                "product_count": item["count"]
            })
        
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Get categories error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ========================================
# CART ENDPOINTS
# ========================================

@api_router.get("/cart", response_model=CartResponse)
async def get_cart(current_user: User = Depends(auth_service.get_current_user)):
    """Get user's cart items"""
    try:
        # Get cart items with product details
        pipeline = [
            {"$match": {"user_id": current_user.id}},
            {"$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }},
            {"$unwind": "$product"},
            {"$sort": {"added_at": -1}}
        ]
        
        collection = get_collection("cart_items")
        cart_items = await collection.aggregate(pipeline).to_list(length=None)
        
        # Process cart items and calculate totals
        items = []
        total_items = 0
        subtotal = 0.0
        
        for item in cart_items:
            product = item["product"]
            cart_item = {
                "id": str(item["_id"]),
                "product_id": str(product["_id"]),
                "name": product["name"],
                "price": product["price"],
                "image": product["images"][0] if product["images"] else "",
                "quantity": item["quantity"],
                "selected_size": item.get("selected_size"),
                "selected_color": item.get("selected_color"),
                "subtotal": product["price"] * item["quantity"]
            }
            items.append(cart_item)
            total_items += item["quantity"]
            subtotal += cart_item["subtotal"]
        
        return CartResponse(items=items, total_items=total_items, subtotal=subtotal)
        
    except Exception as e:
        logger.error(f"Get cart error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/cart/items", response_model=SuccessResponse)
async def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Add item to cart"""
    try:
        # Check if product exists
        product = await find_one("products", {"_id": item.product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if item already exists in cart
        existing_item = await find_one("cart_items", {
            "user_id": current_user.id,
            "product_id": item.product_id,
            "selected_size": item.selected_size,
            "selected_color": item.selected_color
        })
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item["quantity"] + item.quantity
            await update_one("cart_items", {"_id": existing_item["id"]}, {
                "quantity": new_quantity
            })
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=current_user.id,
                product_id=item.product_id,
                quantity=item.quantity,
                selected_size=item.selected_size,
                selected_color=item.selected_color
            )
            cart_dict = cart_item.dict()
            cart_dict.pop('id', None)
            await insert_one("cart_items", cart_dict)
        
        return SuccessResponse(message="Item added to cart successfully")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Add to cart error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/cart/items/{item_id}", response_model=SuccessResponse)
async def update_cart_item(
    item_id: str,
    update_data: CartItemUpdate,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Update cart item quantity"""
    try:
        # Check if item exists and belongs to user
        item = await find_one("cart_items", {"_id": item_id, "user_id": current_user.id})
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        # Update quantity
        await update_one("cart_items", {"_id": item_id}, {"quantity": update_data.quantity})
        
        return SuccessResponse(message="Cart item updated successfully")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Update cart item error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/cart/items/{item_id}", response_model=SuccessResponse)
async def remove_from_cart(
    item_id: str,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Remove item from cart"""
    try:
        # Check if item exists and belongs to user
        item = await find_one("cart_items", {"_id": item_id, "user_id": current_user.id})
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        # Delete item
        await delete_one("cart_items", {"_id": item_id})
        
        return SuccessResponse(message="Item removed from cart successfully")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Remove from cart error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/cart", response_model=SuccessResponse)
async def clear_cart(current_user: User = Depends(auth_service.get_current_user)):
    """Clear all items from cart"""
    try:
        deleted_count = await delete_many("cart_items", {"user_id": current_user.id})
        return SuccessResponse(message=f"Cart cleared successfully. {deleted_count} items removed.")
        
    except Exception as e:
        logger.error(f"Clear cart error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ========================================
# WISHLIST ENDPOINTS  
# ========================================

@api_router.get("/wishlist")
async def get_wishlist(current_user: User = Depends(auth_service.get_current_user)):
    """Get user's wishlist items"""
    try:
        # Get wishlist items with product details
        pipeline = [
            {"$match": {"user_id": current_user.id}},
            {"$lookup": {
                "from": "products", 
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }},
            {"$unwind": "$product"},
            {"$sort": {"added_at": -1}}
        ]
        
        collection = get_collection("wishlist_items")
        wishlist_items = await collection.aggregate(pipeline).to_list(length=None)
        
        items = []
        for item in wishlist_items:
            product = item["product"]
            wishlist_item = {
                "id": str(item["_id"]),
                "product": {
                    "id": str(product["_id"]),
                    "name": product["name"],
                    "price": product["price"],
                    "original_price": product.get("original_price"),
                    "image": product["images"][0] if product["images"] else "",
                    "on_sale": product.get("on_sale", False),
                    "rating": product.get("rating", 0),
                    "category": product["category"]
                },
                "added_at": item["added_at"]
            }
            items.append(wishlist_item)
        
        return {"wishlist": items, "total": len(items)}
        
    except Exception as e:
        logger.error(f"Get wishlist error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/wishlist", response_model=SuccessResponse)
async def add_to_wishlist(
    item: WishlistCreate,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Add item to wishlist"""
    try:
        # Check if product exists
        product = await find_one("products", {"_id": item.product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if already in wishlist
        existing_item = await find_one("wishlist_items", {
            "user_id": current_user.id,
            "product_id": item.product_id
        })
        
        if existing_item:
            raise HTTPException(status_code=400, detail="Item already in wishlist")
        
        # Add to wishlist
        wishlist_item = WishlistItem(
            user_id=current_user.id,
            product_id=item.product_id
        )
        wishlist_dict = wishlist_item.dict()
        wishlist_dict.pop('id', None)
        await insert_one("wishlist_items", wishlist_dict)
        
        return SuccessResponse(message="Item added to wishlist successfully")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Add to wishlist error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/wishlist/{product_id}", response_model=SuccessResponse)
async def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Remove item from wishlist"""
    try:
        # Check if item exists
        item = await find_one("wishlist_items", {
            "user_id": current_user.id,
            "product_id": product_id
        })
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found in wishlist")
        
        # Delete item
        await delete_one("wishlist_items", {"_id": item["id"]})
        
        return SuccessResponse(message="Item removed from wishlist successfully")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Remove from wishlist error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ========================================
# ORDER ENDPOINTS
# ========================================

@api_router.post("/orders", response_model=SuccessResponse)
async def create_order(
    order_create: OrderCreate,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Create a new order from cart items"""
    try:
        # Get cart items
        cart_response = await get_cart(current_user)
        if not cart_response.items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Create order items
        order_items = []
        for cart_item in cart_response.items:
            order_item = OrderItem(
                product_id=cart_item["product_id"],
                product_name=cart_item["name"],
                product_image=cart_item["image"],
                quantity=cart_item["quantity"],
                price=cart_item["price"],
                selected_size=cart_item.get("selected_size"),
                selected_color=cart_item.get("selected_color")
            )
            order_items.append(order_item)
        
        # Calculate totals
        subtotal = cart_response.subtotal
        shipping_cost = 15.0 if subtotal < 200 else 0.0
        tax = subtotal * 0.08
        total = subtotal + shipping_cost + tax
        
        # Create order
        order = Order(
            user_id=current_user.id,
            items=order_items,
            shipping_address=order_create.shipping_address,
            billing_address=order_create.billing_address or order_create.shipping_address,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total=total,
            payment_method=order_create.payment_method
        )
        
        # Save order
        order_dict = order.dict()
        order_dict.pop('id', None)
        # Convert OrderItem objects to dicts
        order_dict['items'] = [item.dict() for item in order_dict['items']]
        order_id = await insert_one("orders", order_dict)
        
        # Clear cart after successful order
        await clear_cart(current_user)
        
        # Send order confirmation email
        try:
            await send_order_confirmation_email(current_user.email, order_id, total)
        except Exception as e:
            logger.error(f"Failed to send order confirmation email: {e}")
        
        return SuccessResponse(
            message="Order placed successfully!",
            data={"order_id": order_id, "total": total}
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Create order error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/orders")
async def get_user_orders(current_user: User = Depends(auth_service.get_current_user)):
    """Get user's order history"""
    try:
        orders = await find_many("orders", {"user_id": current_user.id}, {"created_at": -1})
        return {"orders": orders}
        
    except Exception as e:
        logger.error(f"Get orders error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get specific order details"""
    try:
        order = await find_one("orders", {"_id": order_id, "user_id": current_user.id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"order": order}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get order error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ========================================
# SEED DATA FUNCTION
# ========================================

async def seed_initial_data():
    """Seed database with initial product data"""
    try:
        # Check if products already exist
        existing_products = await count_documents("products")
        if existing_products > 0:
            logger.info("Products already exist, skipping seed")
            return
        
        # Import mock data from frontend
        mock_products = [
            {
                "name": "Elite High-Top Sneakers",
                "category": "sneakers",
                "price": 350.0,
                "original_price": 450.0,
                "description": "Premium leather high-top sneakers with gold accents and superior comfort technology.",
                "images": [
                    "https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85",
                    "https://images.unsplash.com/photo-1596936273467-b3af0c82af7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85"
                ],
                "sizes": ["US 7", "US 8", "US 9", "US 10", "US 11"],
                "colors": ["White", "Black", "Gold"],
                "featured": True,
                "on_sale": True,
                "rating": 4.8,
                "reviews_count": 127,
                "stock_quantity": 50
            },
            {
                "name": "Urban Luxury Sneakers", 
                "category": "sneakers",
                "price": 280.0,
                "description": "Contemporary design meets comfort in these premium urban sneakers.",
                "images": [
                    "https://images.pexels.com/photos/8764560/pexels-photo-8764560.jpeg",
                    "https://images.unsplash.com/photo-1710472171182-ada20c1c21c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
                ],
                "sizes": ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
                "colors": ["White", "Black"],
                "featured": False,
                "on_sale": False,
                "rating": 4.6,
                "reviews_count": 89,
                "stock_quantity": 30
            },
            {
                "name": "Executive Gold Series",
                "category": "sneakers", 
                "price": 420.0,
                "description": "Limited edition sneakers with 24k gold detailing for the discerning collector.",
                "images": [
                    "https://images.unsplash.com/photo-1710472171087-1cdec8a3b162?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85",
                    "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg"
                ],
                "sizes": ["US 8", "US 9", "US 10", "US 11"],
                "colors": ["Black", "Gold"],
                "featured": True,
                "on_sale": False,
                "rating": 4.9,
                "reviews_count": 203,
                "stock_quantity": 15
            },
            {
                "name": "Minimalist Court Classic",
                "category": "sneakers",
                "price": 295.0,
                "description": "Clean lines and premium materials define this timeless court-inspired design.",
                "images": [
                    "https://images.unsplash.com/photo-1695459590088-d6fd3cc97cfa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
                ],
                "sizes": ["US 7", "US 8", "US 9", "US 10", "US 11"],
                "colors": ["White", "Black"],
                "featured": False,
                "on_sale": False,
                "rating": 4.5,
                "reviews_count": 76,
                "stock_quantity": 25
            },
            {
                "name": "Street Luxury Runner",
                "category": "sneakers",
                "price": 380.0,
                "original_price": 450.0,
                "description": "Performance meets luxury in these premium running-inspired sneakers.",
                "images": [
                    "https://images.unsplash.com/photo-1710317959021-36dfca8a9abd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
                ],
                "sizes": ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
                "colors": ["Black", "Red"],
                "featured": False,
                "on_sale": True,
                "rating": 4.7,
                "reviews_count": 142,
                "stock_quantity": 20
            },
            # Crockery items
            {
                "name": "Midnight Ceramic Cup Set",
                "category": "crockery",
                "price": 120.0,
                "description": "Elegant black ceramic cups with gold rim detailing, perfect for luxury dining.",
                "images": [
                    "https://images.unsplash.com/photo-1551713161-57985fb35b99?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjcm9ja2VyeXxlbnwwfHx8fDE3NTQ4MjIwMzF8MA&ixlib=rb-4.1.0&q=85"
                ],
                "materials": ["Ceramic", "Gold Rim"],
                "colors": ["Black", "Gold"],
                "featured": True,
                "on_sale": False,
                "rating": 4.8,
                "reviews_count": 94,
                "set_size": "Set of 2",
                "stock_quantity": 40
            },
            {
                "name": "Premium Serving Tray",
                "category": "crockery",
                "price": 185.0,
                "description": "Minimalist black serving tray crafted from premium materials for sophisticated entertaining.",
                "images": [
                    "https://images.unsplash.com/photo-1559847844-1ff4d5bcd3b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjcm9ja2VyeXxlbnwwfHx8fDE3NTQ4MjIwMzF8MA&ixlib=rb-4.1.0&q=85"
                ],
                "materials": ["Bamboo", "Matte Finish"],
                "colors": ["Black"],
                "featured": False,
                "on_sale": False,
                "rating": 4.6,
                "reviews_count": 67,
                "stock_quantity": 25
            },
            {
                "name": "Pure Porcelain Tea Set",
                "category": "crockery",
                "price": 245.0,
                "original_price": 320.0,
                "description": "Handcrafted porcelain tea set with delicate gold accents for refined tea ceremonies.",
                "images": [
                    "https://images.pexels.com/photos/6739708/pexels-photo-6739708.jpeg"
                ],
                "materials": ["Fine Porcelain", "Gold Accent"],
                "colors": ["White", "Gold"],
                "featured": True,
                "on_sale": True,
                "rating": 4.9,
                "reviews_count": 156,
                "set_size": "Set of 4",
                "stock_quantity": 18
            },
            {
                "name": "Vintage Crystal Collection",
                "category": "crockery",
                "price": 380.0,
                "description": "Exquisite vintage-inspired crystal teacups with ornate gold detailing.",
                "images": [
                    "https://images.pexels.com/photos/3268625/pexels-photo-3268625.jpeg"
                ],
                "materials": ["Crystal", "Gold Plating"],
                "colors": ["Crystal Clear", "Gold"],
                "featured": False,
                "on_sale": False,
                "rating": 4.7,
                "reviews_count": 89,
                "set_size": "Set of 6",
                "stock_quantity": 12
            },
            {
                "name": "Executive Dinner Plates",
                "category": "crockery",
                "price": 295.0,
                "description": "Premium white dinner plates with subtle gold rim for elegant dining experiences.",
                "images": [
                    "https://images.unsplash.com/photo-1714579340610-88f3a5ce6a18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdGFibGV3YXJlfGVufDB8fHx8MTc1NDgyMjAzN3ww&ixlib=rb-4.1.0&q=85"
                ],
                "materials": ["Fine Bone China", "Gold Rim"],
                "colors": ["White", "Gold"],
                "featured": False,
                "on_sale": False,
                "rating": 4.8,
                "reviews_count": 123,
                "set_size": "Set of 8",
                "stock_quantity": 22
            }
        ]
        
        # Insert all products
        for product_data in mock_products:
            await insert_one("products", product_data)
        
        logger.info(f"Seeded {len(mock_products)} products successfully")
        
    except Exception as e:
        logger.error(f"Error seeding data: {e}")

# Include API router
app.include_router(api_router)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "LuxuryLine E-commerce API is running", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)