# Photo Studio Project

A highly visual, modern, and premium photography studio website. 

This repository contains:
1. **Frontend**: Next.js (JavaScript, Tailwind CSS, shadcn/ui, GSAP, Framer Motion)
2. **Backend**: Express.js (Node.js, MongoDB/Mongoose)

---

## Project Structure

```text
photo-studio/
├── frontend/             # Next.js App Router (JS, Tailwind, shadcn/ui)
│   ├── app/              # Main App routing and entry points
│   ├── components/       # Custom components
│   ├── components/ui/    # shadcn/ui base elements
│   ├── lib/              # Frontend utilities and configs
│   ├── public/           # Static assets
│   └── .env.example      # Frontend environment template
│
├── backend/              # Node + Express API
│   ├── src/
│   │   ├── config/       # Configuration scripts
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── middleware/   # Express middlewares
│   │   └── server.js     # Server entry point
│   ├── .env.example      # Backend environment template
│   └── package.json      # Dependencies and scripts
│
├── .gitignore            # Shared Git ignore configurations
└── README.md             # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v18.x or higher recommended)
- npm (v9.x or higher)

### Installation

1. Clone the repository.
2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Install dependencies for the backend:
   ```bash
   cd ../backend
   npm install
   ```

### Running the Services

You can run both projects independently:

#### Running the Frontend (Next.js)
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`.

#### Running the Backend (Express)
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000` (or the port defined in `.env`).

---

## Environment Variables

Copy the `.env.example` file to `.env` in both folders and fill in the values:

- **Frontend**: [frontend/.env.example](file:///d:/code/programs/Photo_Studio/frontend/.env.example) -> `frontend/.env`
- **Backend**: [backend/.env.example](file:///d:/code/programs/Photo_Studio/backend/.env.example) -> `backend/.env`
