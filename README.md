# Luxora — Full-Stack E-Commerce Platform

A full-stack MERN e-commerce web application built for modern electronics retail, featuring a responsive customer storefront, cart & order management, Stripe payment integration, and a role-protected admin dashboard.

## Features

- **Customer Storefront:** Dynamic product catalog with live search, category filtering, multi-criteria sorting, image lightbox, and product detail pages.
- **Cart & Checkout:** Persistent shopping cart (`CartContext`), order tracking, and Stripe checkout integration.
- **Authentication & Role Protection:** JWT-based user registration/login and protected admin routes (`AdminRoute`).
- **Admin Dashboard:** Inventory and product management (`/admin`, `/admin/products`).

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Framer Motion, Lucide Icons, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Stripe API, CORS

## Project Structure

~~~text
my-ecom/
├── src/                 # React frontend (pages, components, contexts, router, api)
├── backend/             # Express API (controllers, models, routes, middleware)
├── .env.example         # Frontend environment template
└── backend/.env.example # Backend environment template
~~~

## Local Setup

1. Clone the repository:

~~~bash
git clone https://github.com/Adnan9025/my-ecom.git
cd my-ecom
~~~

2. Backend setup (copy `backend/.env.example` to `backend/.env` and add your `MONGO_URI`, `JWT_SECRET`, and `STRIPE_SECRET_KEY`):

~~~bash
cd backend
npm install
npm run dev
~~~

3. Frontend setup (from the project root, copy `.env.example` to `.env` if needed):

~~~bash
npm install
npm run dev
~~~

## Environment Variables

- **Frontend (`.env`):** `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api` locally; set to your deployed Render API URL in production)
- **Backend (`backend/.env`):** `PORT`, `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`
