# Project Repository

This repository contains the backend service for an online shopping application and associated assets.

## shopping_backend

Express-based REST API that provides:
- User authentication (register/login)
- Product catalogue (CRUD)
- Shopping cart operations
- Order checkout and history
- Swagger docs at /docs

### Environment

Copy .env.example to .env and set values:
- PORT, HOST
- JWT_SECRET
- DATABASE_URL (preferred), or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL

The backend uses PostgreSQL via the pg driver.

### Run

- Install dependencies: npm install
- Start dev server: npm run dev
- Start prod server: npm start

### API Docs

After starting the server, visit /docs for interactive Swagger UI.