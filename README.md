# IndiFarm

IndiFarm is a full‑stack web app that connects farmers and consumers. Farmers list products with images, manage orders, and message buyers. Consumers browse, order, and contact farmers. Admins manage users, categories, orders, and newsletter subscribers.

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks and functional components
- **Redux Toolkit** for state management
- **Tailwind CSS** for responsive, utility-first styling
- **React Router** for client-side routing
- **Vite** for fast development and building

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for secure authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image storage (with local fallback in development)
- **SendGrid** for transactional emails (welcome + optional product broadcasts)
- **CORS** configured via environment (`FRONTEND_ORIGIN`) for production

### Deployment
- Single‑host on Render (API serves built client)
- MongoDB Atlas for database

## 📱 Core Modules

- Auth & Profiles: roles (consumer/farmer/admin), protected routes
- Products: CRUD for farmers, categories, flags (featured/organic), multiple images
- Orders: checkout, detail pages (all roles), status updates (farmer/admin)
- Messaging: conversations per order/user
- Newsletter: subscribe/unsubscribe, welcome email, optional broadcast
- Admin: users, orders, categories, dashboard stats, newsletter export CSV

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/indifarm.git
   cd indifarm
   ```

2. **Backend (API)**
   ```bash
   cd api
   npm install
   # Create .env with your keys (see below)
   npm run dev
   ```

3. **Frontend (Client)**
   ```bash
   cd client
   npm install
   # For local dev you can omit VITE_API_URL (proxy /api is used)
   npm run dev
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Create necessary collections (users, products, orders, categories)
   - Set up indexes for optimal performance

## ⚙️ Environment Variables

#### Backend (.env)
```env
# Core
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# CORS / URLs
FRONTEND_ORIGIN=http://localhost:5173          # dev; set to your prod URL on Render
CLIENT_BASE_URL=http://localhost:5173           # used in emails for links

# Cloudinary (images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid (emails)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=verified_sender@yourdomain.com
EMAIL_FROM_NAME=IndiFarm

# Features
FEATURE_EMAIL_NEW_PRODUCT=false  # set true in prod to email subscribers on new product
```

Notes:
- If Cloudinary vars are missing, uploads fall back to local `api/uploads/` and are served at `/uploads/*`.
- If SendGrid vars are missing, emails are skipped (app still works).

#### Frontend (.env)
```env
# For single-host prod, the client can call the same origin with /api
VITE_API_URL=/api
```

## 📁 Project Structure

```
indifarm/
├── api/                    # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions (auth, cloudinary, email)
│   └── index.js           # Server entry point
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   └── assets/        # Static assets
│   └── index.html         # HTML template
└── README.md              # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/farmers` - Get all farmers
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe (Public)
- `POST /api/newsletter/unsubscribe` - Unsubscribe (Public)
- `GET /api/newsletter/count` - Public count
- `GET /api/newsletter/subscribers` - Admin only

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/consumer` - Get consumer orders
- `GET /api/orders/farmer` - Get farmer orders
- `GET /api/orders/:id` - Get order detail (authorized roles)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

## 🎯 Production Deploy (Single Host on Render)

- Build command:
  - `npm --prefix api ci && npm --prefix client ci && npm --prefix client run build`
- Start command:
  - `node api/index.js`
- Node version: 20
- Health check: `/`
- Set all backend envs above in Render (especially `MONGO_URI`, `JWT_SECRET`, Cloudinary, SendGrid)

## 📋 Post‑Deploy Test Checklist
- Home, Products, Product Detail load
- Login/Register, Profile load (`/api/auth/me` works)
- Farmer creates product with images → images show (Cloudinary URLs)
- Place an order → order detail page works for consumer/farmer/admin
- Subscribe in footer → welcome email received
- If `FEATURE_EMAIL_NEW_PRODUCT=true` → create product → broadcast email received

## 🎯 Future Enhancements
- Payments, delivery tracking, analytics dashboards
- Mobile apps, AI recommendations, weather integration
- Email preferences + unsubscribe links; queued email jobs

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Open Source Community for the tools and libraries
- Farmers for inspiring this solution

## 📞 Contact

**IndiFarm** - Connecting Farmers and Consumers, One Harvest at a Time! 🌾
