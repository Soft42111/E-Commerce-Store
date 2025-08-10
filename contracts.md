# LuxuryLine E-commerce API Contracts

## Authentication & User Management

### API Endpoints
- `POST /api/auth/signup` - User registration with email verification
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Data Models
```python
User: {
  id: ObjectId,
  email: str,
  password_hash: str,
  is_verified: bool,
  verification_code: str,
  created_at: datetime,
  profile: {
    first_name: str,
    last_name: str,
    phone: str,
    addresses: [Address]
  }
}
```

## Product Management

### API Endpoints  
- `GET /api/products` - List products with filtering/sorting
- `GET /api/products/{id}` - Get product details
- `GET /api/categories` - List categories
- `GET /api/products/search` - Search products
- `GET /api/products/recommendations/{id}` - Get related products

### Data Models
```python
Product: {
  id: ObjectId,
  name: str,
  description: str,
  price: float,
  original_price: float,
  category: str,
  images: [str],
  colors: [str],
  sizes: [str],
  materials: [str],
  stock_quantity: int,
  featured: bool,
  on_sale: bool,
  rating: float,
  reviews_count: int,
  created_at: datetime
}
```

## Shopping Cart & Wishlist

### API Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove from cart
- `DELETE /api/cart` - Clear cart
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/{product_id}` - Remove from wishlist

### Data Models
```python
CartItem: {
  user_id: ObjectId,
  product_id: ObjectId,
  quantity: int,
  selected_size: str,
  selected_color: str,
  added_at: datetime
}

WishlistItem: {
  user_id: ObjectId,
  product_id: ObjectId,
  added_at: datetime
}
```

## Orders & Checkout

### API Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

### Data Models
```python
Order: {
  id: ObjectId,
  user_id: ObjectId,
  items: [OrderItem],
  shipping_address: Address,
  billing_address: Address,
  subtotal: float,
  shipping_cost: float,
  tax: float,
  total: float,
  status: str, # pending, confirmed, shipped, delivered
  created_at: datetime
}
```

## Reviews & Ratings

### API Endpoints
- `GET /api/products/{id}/reviews` - Get product reviews
- `POST /api/products/{id}/reviews` - Add product review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

## Email Integration

### Email Types
- Signup verification code
- Password reset
- Order confirmation
- Shipping notifications

### Mock Data Integration Points

1. **Replace mockProducts array** in frontend components with API calls
2. **Remove localStorage** cart/wishlist persistence 
3. **Add authentication** state management
4. **Replace static categories** with dynamic data
5. **Add user sessions** and protected routes

## Frontend Integration Changes

### Authentication Context
```javascript
AuthContext: {
  user: User | null,
  login: (email, password) => Promise,
  signup: (email, password) => Promise,
  logout: () => void,
  verifyEmail: (code) => Promise,
  isAuthenticated: boolean
}
```

### API Service Layer
```javascript
// Replace mock data with real API calls
ProductService: {
  getProducts: (filters) => Promise,
  getProduct: (id) => Promise,
  searchProducts: (query) => Promise
}

CartService: {
  getCart: () => Promise,
  addToCart: (product, options) => Promise,
  updateQuantity: (itemId, quantity) => Promise
}
```

### Protected Routes
- Cart access requires authentication
- Checkout requires authentication  
- Order history requires authentication
- Wishlist requires authentication

### Email Verification Flow
1. User signs up with email/password
2. Backend sends verification email with 6-digit code
3. Frontend shows verification code input
4. User enters code to activate account
5. Account becomes active, user can login

## Technical Implementation Notes

### Security
- JWT tokens for authentication
- Password hashing with bcrypt
- Email verification required
- Rate limiting on auth endpoints

### Performance
- Product search with text indexing
- Caching for frequently accessed data
- Pagination for product lists
- Image optimization

### Email Templates
- Professional HTML templates
- Brand consistent design
- Mobile responsive emails
- Clear call-to-action buttons