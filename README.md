# Leave Management System

A full-stack leave management application with user roles, leave requests, and admin dashboard.

---

## Features

- User authentication with JWT
- Role-based access control (employee, manager, admin)
- Apply for leaves, view leave requests with filtering & pagination
- Admin can approve/reject leaves
- User profile management
- Responsive React frontend with Tailwind CSS
- Express backend with Prisma ORM and PostgreSQL

---

## Technologies Used

- Frontend: React, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, Prisma, PostgreSQL, JWT Authentication
- Deployment suggestions: Vercel/Netlify (frontend), Railway/Render (backend)

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Yarn or npm
- Prisma CLI (`npm install -g prisma`)

---

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourname/Team-Scheduler-Leave-Management-System.git
cd teamscheduler
```

2. Configure environment variables
```bash
# Backend
cd team-scheduler-backend
npm install

# Frontend
cd ../team-scheduler-frontend
npm install
```

3. Configure environment variables
``bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Setup Prisma and database
``bash
cd ../team-scheduler-backend
npx prisma migrate dev --name init
npx prisma generate
```

5. Run backend server
```bash
npx nodemon
```

6. Run frontend
```bash
cd ../team-scheduler-frontend
npm run dev
```

---

## API Endpoints

| Method | Endpoint          | Description                          | Auth Required | Roles                  |
| ------ | ----------------- | ---------------------------------- | ------------- | ---------------------- |
| GET    | `/api/leaves`     | Get all leaves for user/role       | Yes           | employee/manager/admin |
| POST   | `/api/leaves`     | Create new leave request            | Yes           | employee               |
| PATCH  | `/api/leaves/:id` | Update leave status (approve/reject) | Yes         | admin                  |
| GET    | `/api/profile`    | Get user profile                   | Yes           | all                    |
| POST   | `/api/profile`    | Update user profile                | Yes           | all                    |
| POST   | `/api/login`      | Login user                        | No            | all                    |
| POST   | `/api/register`   | Register new user                  | No            | all                    |

## Project Structure

```bash
/team-scheduler-backend
  /controllers
  /middlewares
  /routes
  prisma.schema
  server.ts

/team-scheduler-frontend
  /src
    /api
    /components
    /pages
    App.tsx
    index.tsx
```

## Contact

For questions or suggestions, reach out at shauryamsingh9@gmail.com