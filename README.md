# Automated Onboarding Checklist Generator

Final Year Individual Full-Stack Project

## Problem Statement
**Problem 7 – Automated Onboarding Checklist Generator**

### Feature Set A
- Enter employee details
- Department-based checklist
- Generate checklist
- Task status
- Checklist history

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Styling: CSS

## Features
1. Enter employee name, employee ID, email, joining date and department.
2. Department-specific onboarding tasks are generated automatically.
3. Each generated checklist is stored in MongoDB.
4. Task status can be changed between Pending, In Progress and Completed.
5. Previous checklists can be viewed from Checklist History.

## Project Structure
```text
automated-onboarding-checklist/
├── backend/
│   ├── models/
│   │   └── Checklist.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## How to Run

### 1. Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then:
```bash
npm run dev
```

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:
`http://localhost:5173`

## Department Templates
The project includes different default tasks for:
- IT
- HR
- Finance
- Marketing
- Sales

You can add more departments/tasks in `backend/server.js`.

## API Endpoints
- `POST /api/checklists` – generate and save a checklist
- `GET /api/checklists` – get checklist history
- `GET /api/checklists/:id` – get one checklist
- `PATCH /api/checklists/:id/tasks/:taskId` – update task status
- `GET /api/health` – backend health check

## Screenshots
After running the application, take screenshots of:
1. Employee details form
2. Generated checklist
3. Task status update
4. Checklist history

Place them in a `screenshots` folder and add them to this README before submission.

## GitHub Upload
```bash
git init
git add .
git commit -m "Initial full-stack onboarding checklist project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
