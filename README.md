# Room Sharing App

A full-stack room sharing platform where users can list, discover, and request rooms. Built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

---

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router v7 |
| Backend  | Node.js, Express 5, MongoDB (Mongoose)          |
| Auth     | JWT, HTTP-only cookies                          |
| Storage  | Cloudinary (image uploads)                      |
| Email    | Nodemailer (Gmail)                              |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled (for email)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/musaraf0101/room_sharing.git
cd room_sharing
```

---

## Backend Setup

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `backend/.env` and set each variable:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/room_sharing

JWT_SECRET=your_random_secret_string

NODE_ENV=development

CORS_ORIGIN=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
```

> **Note:** `EMAIL_PASS` must be a Gmail **App Password**, not your regular Gmail password. Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

### 4. Start the backend server

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The backend runs on **http://localhost:3000**

---

## Frontend Setup

### 5. Install dependencies

Open a new terminal from the project root:

```bash
cd frontend
npm install
```

### 6. Start the frontend dev server

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## Running Both Servers

You need two terminal windows running simultaneously:

| Terminal | Command                      | URL                   |
| -------- | ---------------------------- | --------------------- |
| 1        | `cd backend && npm run dev`  | http://localhost:3000 |
| 2        | `cd frontend && npm run dev` | http://localhost:5173 |

Open **http://localhost:5173** in your browser to use the app.

---

## Project Structure

```
room_sharing/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Logger, helpers
│   │   ├── validation/   # Joi schemas
│   │   └── server.js     # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/      # React context (auth, theme)
    │   ├── pages/        # Page components
    │   ├── utils/        # Axios instance, helpers
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## API Overview

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login and receive cookie |
| POST   | `/api/auth/logout`   | Logout                   |
| GET    | `/api/room`          | List all rooms           |
| POST   | `/api/room`          | Create a room listing    |
| GET    | `/api/room/:id`      | Get a single room        |
| POST   | `/api/request`       | Send a room request      |
| GET    | `/api/user/profile`  | Get current user profile |
| GET    | `/api/statistics`    | Admin statistics         |

---

## Build for Production

```bash
# Build the frontend
cd frontend
npm run build
```

The output is in `frontend/dist/` and can be served by any static host (Vercel, Netlify, etc.).

For the backend, deploy to any Node.js host (Railway, Render, etc.) and set the environment variables in the host's dashboard.
