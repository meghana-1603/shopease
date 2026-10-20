# ShopEase — E-Commerce Web Application

ShopEase is a full-stack e-commerce web application developed as an internship project. It allows users to browse products, add items to a cart, place orders, and track their purchases. Administrators can manage products and view customer orders.

## Features

- Product catalog with product details and pricing
- Shopping cart and checkout functionality
- User registration and login
- JWT-based authentication
- Role-based access for Admin and User
- Admin dashboard for adding, editing, and deleting products
- Order placement and order history
- Admin order management
- MongoDB database integration

## Tech Stack

**Frontend**
- React.js
- Vite
- CSS
- Lucide React

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB
- Mongoose

**Authentication**
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Project Structure

```text
shopease-complete/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or another MongoDB instance
- Git

### 1. Configure the Backend

Open a terminal in the project directory and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_PASSWORD=your_strong_admin_password
```

Replace the example values with your own configuration. Never upload real credentials to GitHub.

### 2. Start the Backend

From the `backend` directory, run:

```bash
npm start
```

If the `start` script is not defined in `package.json`, run:

```bash
node server.js
```

### 3. Seed Sample Data

After configuring the environment, run the backend seed script if sample data is needed:

```bash
node seed.js
```

### 4. Configure the Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` as its default backend API URL.

To override it, create a `frontend/.env` file containing:

```env
VITE_API_URL=http://localhost:5000/api
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the current user |
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/:id` | Retrieve a product |
| POST | `/api/products` | Add a product (Admin) |
| PATCH | `/api/products/:id` | Update a product (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin) |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/mine` | View personal orders |
| GET | `/api/orders` | View all orders (Admin) |

## Security

- Passwords are hashed before storage.
- Protected routes require authentication.
- Administrative operations require admin authorization.
- Database credentials, JWT secrets, and passwords must remain private.
- Environment files must not be committed to version control.

## Project Status

The application has been tested locally for user authentication, product display and management, shopping cart, checkout, order viewing, and key authorization checks.
