# IndiFarm <img src="client/src/assets/placeholder.png" alt="Logo" width="60" height="60" align="top" />

**Connecting Farmers and Consumers, One Harvest at a Time!**

---

## 🚀 Why IndiFarm?

- Real-time chat between buyers and farmers
- Role-based dashboards for consumers, farmers, and admins
- Product management, order tracking, and ratings
- Clean, modern UI with Tailwind CSS
- Secure authentication and robust backend

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, SendGrid

---

## ✨ Key Features

- 🔒 Auth: Consumer, Farmer, Admin roles
- 🛒 Products: Add, edit, delete, image upload
- 📦 Orders: Place, track, update status
- 💬 Chat: Instant messaging (Socket.io)
- ⭐ Ratings: Rate farmers after orders
- 📰 Newsletter: Subscribe, broadcast
- 🧑‍💼 Admin: Manage users, orders, categories

---

## � Recent Highlights

- Real-time chat with instant updates
- No duplicate messages, clean UI
- Codebase cleaned for production

---

## 📦 Quick Start

```bash
git clone https://github.com/goutham80808/indifarm.git
cd indifarm
cd api && npm install && npm run dev
cd ../client && npm install && npm run dev
```

---

## ⚙️ Environment Setup

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
EMAIL_FROM_NAME=sender_name
FEATURE_EMAIL_NEW_PRODUCT=false
```

**Frontend (.env):**
```
VITE_API_URL=/api
```

---

## 📁 Structure

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

---


## 🔧 API Overview

**Authentication**
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

**Users**
- `GET /api/users` — List all users (admin)
- `GET /api/users/farmers` — List all farmers
- `PUT /api/users/profile` — Update user profile

**Products**
- `GET /api/products` — List all products
- `POST /api/products` — Add product (farmer)
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

**Orders**
- `POST /api/orders` — Create order
- `GET /api/orders/consumer` — Get consumer orders
- `GET /api/orders/farmer` — Get farmer orders
- `GET /api/orders/:id` — Get order details

**Newsletter**
- `POST /api/newsletter/subscribe` — Subscribe
- `POST /api/newsletter/unsubscribe` — Unsubscribe
- `GET /api/newsletter/count` — Subscriber count
- `GET /api/newsletter/subscribers` — List subscribers (admin)

**Categories**
- `GET /api/categories` — List all categories
- `POST /api/categories` — Add category (admin)

---

## 🎯 Deploy & Checklist

- Build: `npm --prefix api ci && npm --prefix client ci && npm --prefix client run build`
- Start: `node api/index.js`
- Node: v20
- Health check: `/`
- Set backend envs in Render dashboard

---

## 🚀 Next Steps

- Payments, delivery tracking, analytics
- Mobile apps, AI recommendations

---

## 🤝 Contribute

Fork, branch, code, test, PR!

---

## 📄 License

MIT — see [LICENSE](LICENSE)
