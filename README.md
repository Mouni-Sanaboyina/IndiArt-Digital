# IndiArt — Digital Print Shop

A full-stack MERN e-commerce platform for a digital print shop that enables customers to browse customizable print products, upload artwork, place orders, and track order status. Administrators can manage products, review customer orders, and control the print approval workflow through a secure dashboard.

🌐 **Live Website:** https://indiart-digital.vercel.app

⚙️ **Backend API:** https://indiart-backend-h2esgvdnb7argwcp.centralindia-01.azurewebsites.net

📦 **Repository:** https://github.com/Mouni-Sanaboyina/IndiArt-Digital

---


# Table of Contents

* Overview
* Features
* Technology Stack
* System Architecture
* Project Structure
* Getting Started
* Environment Variables
* Deployment
* API Endpoints
* Demo Credentials
* Future Enhancements
* Author

---

# Overview

IndiArt is a modern print-on-demand platform built for digital printing businesses. Customers can browse products such as business cards, flyers, posters, stickers, invitations, brochures, and custom merchandise, upload design files, and place orders online.

The platform includes a complete administrative dashboard that allows shop owners to manage products, review orders, approve artwork submissions, and monitor the printing workflow.

---

# Features

## Customer Features

* User registration and login
* JWT-based authentication
* Browse products by category
* Product detail pages
* Dynamic pricing display
* Add products to cart
* Quantity management
* Upload custom artwork
* Checkout and order placement
* View order history
* Track order status

## Admin Features

* Secure admin dashboard
* Create products
* Edit products
* Delete products
* Upload multiple product images
* View all customer orders
* Review uploaded artwork
* Approve orders
* Reject orders with reason
* Mark orders as printed

## Security Features

* JWT authentication
* Password hashing using bcrypt
* Protected admin routes
* Role-based authorization
* CORS protection
* Environment variable configuration

---

# Technology Stack

## Frontend

* React 18
* React Router DOM
* Vite
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JSON Web Token (JWT)
* bcryptjs

## Cloud Services

* Cloudinary (Image Storage)
* Azure App Service (Backend Hosting)
* Vercel (Frontend Hosting)

---

# System Architecture

Frontend (React + Vite)

↓

Axios API Calls

↓

Azure App Service

↓

Express.js Backend

↓

MongoDB Atlas Database

↓

Cloudinary Image Storage

---

# Project Structure

```text
IndiArt-Digital
│
├── indiart-backend
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── indiart-frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── assets
│   │   └── App.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# Getting Started

## Prerequisites

* Node.js 18+
* MongoDB Atlas Account
* Cloudinary Account
* Git

---

## Clone Repository

```bash
git clone https://github.com/Mouni-Sanaboyina/IndiArt-Digital.git

cd IndiArt-Digital
```

---

# Backend Setup

```bash
cd indiart-backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

Run Backend

```bash
npm run dev
```

Production

```bash
npm start
```

---

# Frontend Setup

```bash
cd indiart-frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Start Development Server

```bash
npm run dev
```

Build Production Version

```bash
npm run build
```

---

# Deployment

## Frontend

Hosted on Vercel

Production URL:

https://indiart-digital.vercel.app

Environment Variable:

```env
VITE_API_URL=https://indiart-backend-h2esgvdnb7argwcp.centralindia-01.azurewebsites.net/api
```

---

## Backend

Hosted on Microsoft Azure App Service

Production URL:

https://indiart-backend-h2esgvdnb7argwcp.centralindia-01.azurewebsites.net

Environment Variables:

```env
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Deployment is automated using GitHub Actions.

---

# API Endpoints

## Authentication

POST `/api/auth/register`

POST `/api/auth/login`

---

## Products

GET `/api/products`

GET `/api/products/:id`

POST `/api/products`

PATCH `/api/products/:id`

DELETE `/api/products/:id`

---

## Cart

GET `/api/cart`

POST `/api/cart`

PATCH `/api/cart/:id`

DELETE `/api/cart/:id`

---

## Orders

POST `/api/orders`

GET `/api/orders/my`

GET `/api/orders`

PATCH `/api/orders/:id/status`

---

# Demo Credentials

## Admin

Email:

```text
admin@indiart.com
```

Password:

```text
Admin@123
```

## User

Create a new account using the Register page.

---

# Future Enhancements

* Razorpay payment integration
* Email notifications
* Order invoice generation
* Product search and filtering
* Wishlist functionality
* Customer reviews and ratings
* Analytics dashboard
* Multi-vendor support
* Inventory management
* Real-time order tracking

---

# Author

**Mounika Sanaboyina**

B.Tech – Computer Science (AI & Data Science)

GitHub:
https://github.com/Mouni-Sanaboyina

Project:
https://indiart-digital.vercel.app

---

If you found this project useful, consider giving the repository a ⭐ on GitHub.
