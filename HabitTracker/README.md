# Habit Tracker

A modern, full-stack habit tracking application built to help you build and maintain positive habits.

![Dashboard Preview](/Users/chaitanyakatore/.gemini/antigravity/brain/03b1a449-53e7-4784-bc70-35f6d396cb68/habit_checked_1767014746395.png)

## Features

-   **Track Daily Habits**: Simple interface to mark habits as completed.
-   **Weekly Progress**: Visualize your consistency over the last 7 days.
-   **Responsive Design**: Works on desktop and mobile.
-   **Dark Mode Support**: (Coming soon/Partially implemented via Tailwind).

## Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS (v4), Lucide React.
-   **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL.
-   **Tooling**: npm, ESLint.

## Quick Start

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development interactions.

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL

### Run Locally

1.  **Clone the repository**
2.  **Start the Backend**:
    ```bash
    cd backend
    npm install
    # Ensure .env is set up (see CONTRIBUTING.md)
    npm run db:push
    npm run seed
    npm run dev
    ```
3.  **Start the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
4.  Open `http://localhost:5173` (or the port shown in terminal).
