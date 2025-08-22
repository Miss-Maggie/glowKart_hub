## 🌟 GlowKart Hub

**GlowKart Hub** is a full-stack marketplace platform that helps **local businesses** reach digital customers. Shoppers can find fast, trustworthy nearby stores — supporting their community instead of global brands.

---

### 📌 Table of Contents

* [✨ Features](#-features)
* [📦 Tech Stack](#-tech-stack)
* [📁 Project Structure](#-project-structure)
* [⚙️ Backend Setup](#️-backend-setup)
* [🎨 Frontend Setup](#-frontend-setup)
* [🔐 Authentication](#-authentication)
* [🧪 Testing](#-testing)
* [🛣️ API Endpoints](#️-api-endpoints)
* [📸 Screenshots](#-screenshots)
* [📄 License](#-license)

---

## ✨ Features

#### 🛍️ For Shoppers

* Register/login
* Browse nearby products
* Place orders
* View order history

#### 🏪 For Store Owners

* Create and manage stores
* Add products
* View customer orders
* Update order status

#### 🔐 Auth & Security

* JWT-based login
* Protected routes
* Role-based access

#### 🧾 Orders

* Create, view, and update orders
* Automatically calculate totals

#### 💬 Coming Soon

* Product search/filter
* Favorites & reviews
* Admin dashboard

---

## 📦 Tech Stack

| Frontend            | Backend            | Dev Tools              |
| ------------------- | ------------------ | ---------------------- |
| React + Vite        | Express.js         | PNPM + TypeScript      |
| Tailwind CSS v4     | Node.js            | Nodemon / ts-node-dev  |
| TypeScript          | MongoDB + Mongoose | Dotenv, Morgan, CORS   |
| Axios, React-Router | JWT & Bcrypt       | Thunder Client/Postman |

---

## 📁 Project Structure

### 🔙 Backend `/glowkart-backend`

```
src/
│
├── controllers/     # Logic for users, stores, products, orders
├── models/          # Mongoose schemas
├── middleware/      # Auth & error middleware
├── routes/          # API route handlers
├── utils/           # Helper functions
├── config/          # DB connection, env config
├── server.ts        # Entry point
└── app.ts           # Express app setup
```

### 🎨 Frontend `/glowkart-client`

```
src/
│
├── components/      # Reusable UI components
├── pages/           # Route-based pages
├── hooks/           # Custom React hooks
├── context/         # Auth or Global Contexts
├── services/        # API functions via Axios
├── App.tsx          # Main app
└── main.tsx         # Entry file
```

---

## ⚙️ Backend Setup

1. **Clone repo**

   ```bash
   git clone https://github.com/Miss-Maggie/glowkart-local-connect.git
   cd glowkart-backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment variables**

   Create a `.env` file:

   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/glowkart
   JWT_SECRET=your-secret-key
   ```

4. **Run server**

   ```bash
   pnpm run dev
   ```

---

## 🎨 Frontend Setup

1. **Go to frontend folder**

   ```bash
   cd glowkart-client
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the app**

   ```bash
   pnpm dev
   ```

4. **Vite Config is already set up for:**

   * Tailwind v4
   * TypeScript
   * React Router
   * Absolute imports (via `tsconfig.json`)

---

## 🔐 Authentication

* JWT tokens stored in localStorage
* Protected routes using middleware
* Role-based access (shopper, store owner)

---

## 🧪 Testing Strategy

| Tool              | Purpose                      |
| ----------------- | ---------------------------- |
| Jest              | Unit tests for backend logic |
| Supertest         | API endpoint testing         |
| MongoDB Memory    | In-memory DB for tests       |
| React Testing Lib | Frontend component testing   |
| Cypress (opt.)    | E2E UI testing               |

> Tests are organized in `__tests__/` folders next to their modules.

---

## 🛣️ API Endpoints

Here are just a few:

### ✅ Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### 🏪 Store

* `POST /api/stores` (owner only)
* `GET /api/stores/:id`

### 🛍️ Products

* `POST /api/products`
* `GET /api/products?store=123`

### 📦 Orders

* `POST /api/orders`
* `GET /api/orders/mine` (user)
* `GET /api/orders/store/:storeId` (owner)
* `PUT /api/orders/:id/status`

> Full Swagger docs can be added using `swagger-ui-express` if needed.

---

## 📸 Screenshots (optional)

Include screenshots of:

* Landing page
* Store dashboard
* Product listing
* Order flow

---

## 📄 License

MIT © 2025 Magdaline Muthui (GlowKart Team)
