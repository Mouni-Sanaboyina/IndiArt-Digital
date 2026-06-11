# IndiArt — Digital Print Shop

A full-stack MERN e-commerce application for a digital print shop. Customers can browse print products, configure size/paper/finish options, add items to cart, upload artwork, and place orders. Admins manage products and update order statuses through a protected dashboard.

🌐 **Live Demo:** [indiart-digital.vercel.app](https://indiart-digital.vercel.app/)
📦 **Repository:** [github.com/Mouni-Sanaboyina/IndiArt-Digital](https://github.com/Mouni-Sanaboyina/IndiArt-Digital)

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
  - [Backend — Render](#backend--render)
  - [Frontend — Vercel](#frontend--vercel)
- [API Reference](#api-reference)
- [Scripts](#scripts)

---

## Live Demo

| | URL |
|---|---|
| **Frontend** | [https://indiart-digital.vercel.app](https://indiart-digital.vercel.app/) |
| **Backend API** | Hosted on Render |
| **Repository** | [github.com/Mouni-Sanaboyina/IndiArt-Digital](https://github.com/Mouni-Sanaboyina/IndiArt-Digital) |

### Demo Credentials

Use these to explore the app without registering:

**Admin**
| Field | Value |
|---|---|
| Email | `admin@indiart.com` |
| Password | `Admin@123` |

**Regular User** — register a new account via the [Register](https://indiart-digital.vercel.app/register) page, or use any existing seeded user account.

> ⚠️ These are demo credentials for a development/seeded database. Do not use real personal information when testing.

---

## Features

**Customer**
- Browse products by category (Business Cards, Flyers, Posters, T-Shirts, Stickers, Invitations)
- Configure print options — size (A2/A3/A4), paper type (matte/glossy), finish (standard/premium)
- Dynamic pricing matrix per product configuration
- Add to cart, adjust quantities, and checkout
- Upload custom artwork (JPG, PNG, WebP, PDF — up to 10 MB) with special instructions
- View order history and track order status

**Admin**
- Manage products — create, update, and soft-delete listings with up to 6 images per product
- View all orders with optional status filter
- Review order details including uploaded artwork files
- Advance order status: `pending → approved → printed` or `rejected` (rejection requires a reason)

**Auth**
- JWT-based authentication (7-day expiry)
- Role-based access (`user` / `admin`)
- Protected routes on both frontend and backend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS, Vite |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JSON Web Tokens, bcryptjs |
| File Storage | Cloudinary (products & artwork) |
| HTTP Client | Axios |

---

## Project Structure

```
indiart_MERN/
├── indiart-backend/
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── adminMiddleware.js     # Admin role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js             # Pricing matrix, sizes, paper types, finishes
│   │   ├── Cart.js
│   │   └── Order.js               # Order items, delivery details, artwork file, status history
│   ├── routes/
│   │   ├── auth.js                # POST /register, POST /login
│   │   ├── products.js            # CRUD products + Cloudinary image upload
│   │   ├── cart.js                # Cart management
│   │   └── orders.js              # Place order, view orders, admin status updates
│   ├── seed.js                    # Database seeder
│   ├── server.js
│   └── .env
│
└── indiart-frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance with base URL
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── OrderStatusBadge.jsx
    │   │   ├── ProtectedRoute.jsx  # Redirects unauthenticated users
    │   │   └── AdminRoute.jsx      # Redirects non-admin users
    │   ├── context/
    │   │   ├── AuthContext.jsx     # Auth state + token storage
    │   │   └── CartContext.jsx     # Cart state
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Services.jsx
    │       ├── Portfolio.jsx
    │       ├── Pricing.jsx
    │       ├── Contact.jsx
    │       ├── ProductDetail.jsx
    │       ├── Login.jsx / Register.jsx
    │       ├── Cart.jsx
    │       ├── Checkout.jsx        # Delivery form + artwork upload
    │       ├── OrderConfirmation.jsx
    │       ├── MyOrders.jsx
    │       └── admin/
    │           ├── AdminDashboard.jsx
    │           ├── AdminProducts.jsx
    │           ├── AdminOrders.jsx
    │           └── AdminOrderDetail.jsx
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (Atlas or local)
- A [Cloudinary](https://cloudinary.com/) account (free tier is sufficient)

### Backend Setup

```bash
cd indiart-backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

To seed the database with sample products:

```bash
npm run seed
```

### Frontend Setup

```bash
cd indiart-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

---

## Environment Variables

Create `indiart-backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/indiart
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Deployment

### Backend — Render

1. Push `indiart-backend/` to a GitHub repository (or use a monorepo root).
2. Create a new **Web Service** on [Render](https://render.com).
3. Set the following:
   - **Root Directory:** `indiart-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all [environment variables](#environment-variables) in the Render dashboard under **Environment**.
5. Set `CLIENT_URL` to your Vercel frontend URL (e.g. `https://indiart-digital.vercel.app`).
6. Deploy. Render will provide a URL like `https://indiart-backend.onrender.com`.

> **Note:** Free-tier Render services spin down after inactivity. The first request after idle may take 30–60 seconds.

### Frontend — Vercel

1. Push `indiart-frontend/` to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the following in **Project Settings → Environment Variables**:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL, e.g. `https://indiart-backend.onrender.com/api` |

4. Vercel auto-detects Vite — the default build settings work out of the box:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Deploy. Vercel will provide a URL like `https://indiart-digital.vercel.app`.

> Make sure `VITE_API_URL` is set before building — Vite inlines env variables at build time.

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | — | List all active products (optional `?category=`) |
| GET | `/products/:id` | — | Get a single product |
| POST | `/products` | Admin | Create product (multipart, up to 6 images) |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Soft-delete (sets `isActive: false`) |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | User | Get current cart |
| POST | `/cart` | User | Add item to cart |
| PATCH | `/cart/:itemId` | User | Update item quantity |
| DELETE | `/cart/:itemId` | User | Remove item from cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders` | User | Place order from cart (optional artwork file upload) |
| GET | `/orders/my` | User | List the current user's orders |
| GET | `/orders` | Admin | List all orders (optional `?status=`) |
| GET | `/orders/:id` | Admin | Get order details |
| PATCH | `/orders/:id/status` | Admin | Update status (`approved`, `rejected`, `printed`) |

**Order statuses:** `pending → approved → printed` or `pending → rejected`

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot-reload) |
| `npm start` | Start for production |
| `npm run seed` | Seed the database with sample products |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
