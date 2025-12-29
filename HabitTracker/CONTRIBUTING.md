# Contributing to Habit Tracker

We welcome contributions! This guide will help you set up your development environment and understand the project structure.

## Development Setup

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

### 1. Backend Setup

The backend handles API requests and database interactions.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in `backend/`:
    ```env
    DATABASE_URL="postgres://user:password@localhost:5432/habit_tracker"
    PORT=3000
    ```

4.  Initialize Database:
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

5.  Seed Data (Optional):
    Populate the DB with a test user and habits:
    ```bash
    npm run seed
    ```
    *Note: The seed script prints the generated User ID. You may need this for testing.*

6.  Start the Server:
    ```bash
    npm run dev
    ```
    The API will run at `http://localhost:3000`.

### 2. Frontend Setup

The frontend is a React application built with Vite.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    Open the link shown (usually `http://localhost:5173`).

    *Note: If you are using a specific User ID from the seed, ensure it matches what is hardcoded in `App.tsx` (TEMPORARY) or implement authentication.*

## Project Structure

### Backend (`/backend`)

-   `src/index.ts`: Entry point. Defines Express app and API routes.
-   `src/db/`: Database configuration and schema.
    -   `schema.ts`: Drizzle ORM schema definitions (Users, Habits, Logs).
    -   `index.ts`: DB connection setup.
-   `src/seed.ts`: Script to populate initial data.

### Frontend (`/frontend`)

-   `src/App.tsx`: Main dashboard component.
-   `src/components/`: Reusable UI components (e.g., `HabitRow.tsx`).
-   `src/lib/`:
    -   `api.ts`: Axios client and API functions.
    -   `utils.ts`: Helper functions (clsx/tailwind-merge).

## API Documentation

### Habits

-   **GET** `/api/habits?userId={uuid}`
    -   Returns a list of habits for the user.
-   **POST** `/api/logs`
    -   Body: `{ habitId: number, date: "YYYY-MM-DD" }`
    -   Toggles the completion status of a habit for that date.

### Progress

-   **GET** `/api/progress?userId={uuid}&startDate={date}&endDate={date}`
    -   Returns total completion count for the period.
