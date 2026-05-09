# 📚 Nashr — Library Management System

A full-stack books library platform built with React 18,Laravel 12, MySQL, and Laravel Sanctum.

![License](https://img.shields.io/badge/license-MIT-E8A020?style=flat-square)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

- **📚 Books Library** — Browse, search, and filter books by category with a clean modern UI.
- **❤️ Favorites & Saved** — Add books to favorites or save for later, synced to your account in real time.
- **🖼️ Profile Photo Upload** — Upload and update your avatar right after registration.
- **👤 User Dashboard** — View profile info, favorites, saved books, and change password.
- **🛡️ Admin Dashboard** — Full control panel to add/delete books and manage all users.
- **📱 Responsive Design** — Works seamlessly on mobile, tablet, and desktop.
- **🌐 REST API** — Fully documented API with Swagger / OpenAPI 3.0.
- **🔒 Role-Based Access** — User and Admin roles with protected routes on both frontend and backend.
- **🚫 CSRF-Free** — Stateless Bearer Token auth — no CSRF conflicts with React.

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Frontend      | React 18, React Router DOM v6     |
| Styling       | CSS Modules + CSS Variables       |
| State         | Context API (Auth, Books, Toast)  |
| HTTP Client   | Axios                             |
| Backend       | Laravel 12 (PHP 8.2+)            |
| Auth          | Laravel Sanctum (Bearer Token)    |
| Database      | MySQL 8.0                         |
| File Storage  | Laravel Storage (local disk)      |
| API Docs      | Swagger / OpenAPI 3.0             |
| API Testing   | Postman                           |


## 🚀 Getting Started

### Prerequisites

| Tool       | Version   |
|------------|-----------|
| PHP        | >= 8.2    |
| Composer   | >= 2.x    |
| MySQL      | >= 8.0    |
| Node.js    | >= 18.x   |
| npm        | >= 9.x    |

---

### 1️⃣ Backend Setup (Laravel)

```bash
# Navigate to backend
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed sample data
php artisan migrate --seed

# Create storage symlink for avatar uploads
php artisan storage:link

# Start the development server
php artisan serve
# → http://localhost:8000
```

---

### 2️⃣ Frontend Setup (React)

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm start
# → http://localhost:3000
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing.md](./Contributing.md) for more details on how to get started.


---

## 📜 License

This project is licensed under the MIT License. See the [License.md](./License.md) file for details.

---

Built with ❤️ by **Ibrahim Elsayed**
