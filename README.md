
# IndiFarm

IndiFarm is a full-stack web application that connects farmers and consumers. Farmers can list products, manage orders, and communicate with buyers. Consumers can browse products, place orders, rate farmers, and message sellers. Admins oversee users, categories, orders, and newsletter subscribers.

## 🛠️ Tech Stack

**Frontend:**
- React 18 (hooks, functional components)
- Redux Toolkit (state management)
- Tailwind CSS (responsive styling)
- React Router (routing)
- Vite (development/build)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentication)
- Bcrypt (password hashing)
- Cloudinary (image uploads)
- SendGrid (emails)

**Deployment:**
- Render (single-host, API serves built client)
- MongoDB Atlas

## � Features

- Role-based authentication: consumer, farmer, admin
- Product management: farmers can add/edit/delete products with images
- Order management: consumers place orders, farmers/admins update status
- Rating system: consumers rate farmers after completed orders
- Cart validation: quantity checked against inventory
- Inventory management: deducted and deactivated on order completion
- Messaging: order-based conversations
- Newsletter: subscribe/unsubscribe, admin broadcast
- Admin dashboard: manage users, orders, categories, newsletter

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Git

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/indifarm.git
   cd indifarm
   ```
2. Backend setup:
   ```bash
   cd api
   npm install
   # Add .env (see below)
   npm run dev
   ```
3. Frontend setup:
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Database:
   - Ensure MongoDB is running
   - Collections: users, products, orders, categories

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_ORIGIN=http://localhost:5173
CLIENT_BASE_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=verified_sender@yourdomain.com
EMAIL_FROM_NAME=IndiFarm
FEATURE_EMAIL_NEW_PRODUCT=false
```

**Frontend (.env):**
```
VITE_API_URL=/api
```

## 📁 Project Structure

```
indifarm/
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── assets/
│   └── index.html
└── README.md
```

## 🔧 API Endpoints (Highlights)

**Auth:**
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

**Users:**
- `GET /api/users` — All users (admin)
- `GET /api/users/farmers` — All farmers
- `PUT /api/users/profile` — Update profile

**Products:**
- `GET /api/products` — All products
- `POST /api/products` — Add product (farmer)
- `PUT /api/products/:id` — Update
- `DELETE /api/products/:id` — Delete

**Orders:**
- `POST /api/orders` — Create order
- `GET /api/orders/consumer` — Consumer orders
- `GET /api/orders/farmer` — Farmer orders
- `GET /api/orders/:id` — Order detail

**Newsletter:**
- `POST /api/newsletter/subscribe` — Subscribe
- `POST /api/newsletter/unsubscribe` — Unsubscribe
- `GET /api/newsletter/count` — Count
- `GET /api/newsletter/subscribers` — Admin only

**Categories:**
- `GET /api/categories` — All categories
- `POST /api/categories` — Add (admin)

## 📝 Recent Improvements

- Added consumer rating system for farmers
- Rating modal on completed orders
- Ratings visible on farmer detail page
- Improved order header and rating button UI
- Cart quantity validation against inventory
- Inventory deduction and product deactivation on order completion
- Role-based UI: hide "Rate Farmer" button and "Orders" link for farmers

## 🎯 Production Deploy (Render)

- Build: `npm --prefix api ci && npm --prefix client ci && npm --prefix client run build`
- Start: `node api/index.js`
- Node: v20
- Health check: `/`
- Set all backend envs in Render dashboard

## ✅ Post-Deploy Checklist

- Home, Products, Product Detail load
- Login/Register, Profile load
- Farmer creates product with images
- Place order, view order detail (all roles)
- Newsletter subscribe, welcome email
- Product broadcast email (if enabled)

## 🚀 Future Enhancements

- Payments, delivery tracking, analytics
- Mobile apps, AI recommendations
- Email preferences, unsubscribe links

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit PR

## 📄 License

MIT License — see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- Open Source Community
- Farmers for inspiration

## 📞 Contact

**IndiFarm** — Connecting Farmers and Consumers, One Harvest at a Time! 🌾
