🌳 UrbanClean - Waste Management Platform

Welcome to UrbanClean! This is a modern web application designed to streamline urban waste management. It provides a direct line of communication between citizens and municipal staff to report, track, and resolve waste-related issues, helping to create cleaner and greener cities.

This guide will walk you through setting up and running the entire project on your local computer.

Features

Role-Based Access: The app has two distinct roles:

Citizen: Can register, log in, submit new waste reports (with an interactive map), and view the status of all their past reports.

Staff: Can register, log in, view a dashboard of all submitted reports from all citizens, update the status of a report (e.g., "In Progress," "Resolved"), and see who reported the issue.

Interactive Map Reporting: Citizens can click on a map to drop a pin, capturing the exact coordinates of the issue.

Detailed Modals: View all details of a report, including the photo and map location, in a clean pop-up.

Dashboards with Stats: Both portals feature summary cards (e.g., "Total Reports," "Pending") for a real-app feel.

Modern UI: A clean, professional, green-and-white themed layout.

Technology Used

Frontend (The UI): React (Vite)

Backend (The Server "Brain"): Node.js & Express

Database (The "Storage"): MongoDB

Containerization (The "Magic Box"): Docker & Docker Compose

Don't worry if this looks complex! We use Docker to run the backend and database in a "magic box" so you do not need to install MongoDB or configure the server manually.

🛠️ Software You Need (Prerequisites)

Before you begin, you must install these three free tools.

Node.js: This lets you run the frontend user interface and install project packages.

Download: https://nodejs.org (Download the "LTS" version).

Docker Desktop: This is the most important tool. It runs the "magic box" (containers) for our database and backend server.

Download: https://www.docker.com/products/docker-desktop

A Code Editor: This is how you will view the project files and run commands. We strongly recommend VS Code.

Download: https://code.visualstudio.com

🚀 Local Setup Instructions (Step-by-Step)

Follow these steps exactly to get the project running.

Step 1: Get the Project Code

Download the project files. If you have a .zip file, unzip it to a folder you can easily find, like your Desktop. The main folder should be named UrbanClean.

Step 2: Open the Project & Start Docker

Open VS Code.

Go to File > Open Folder and select the UrbanClean folder you just unzipped.

Start Docker Desktop. (You must open the application). Wait for it to show a green light in the corner, which means it's running.

Step 3: Open Two Terminals

You need to run two separate commands at the same time. The easiest way is using two terminals inside VS Code.

In VS Code, go to the top menu and click Terminal > New Terminal.

You will see a command-line window appear at the bottom.

Click the + icon in the terminal window (or go to Terminal > New Terminal again) to open a second terminal.

You should now have two terminals, probably labeled "1" and "2".

Step 4: Run the Backend (Server + Database)

In your first terminal:

Type the following command and press Enter. This starts the database and the server. The --build command might take a minute the first time.

docker-compose up --build

You will see a lot of log messages. If it's successful, you'll see messages like MongoDB Connected and Server running on port 5000.

Leave this terminal running. Don't close it. It's now your server.

Step 5: Run the Frontend (User Interface)

In your second terminal:

First, move into the client folder.

cd client

Next, install all the frontend code (this may take a minute).

npm install

Finally, run the app.

npm run dev

Wait for it to compile. When it's ready, you will see a message like this:

> Local: http://localhost:5173/
> Network: use --host to expose

Step 6: You're Live!

Your project is now fully running!

Your Backend is at http://localhost:5001

Your Frontend is at http://localhost:5173

Open your web browser (like Chrome) and go to http://localhost:5173. You should see the UrbanClean website.

💡 How to Use the App

Open http://localhost:5173. You will be on the landing page.

Click "Register".

Create your first user. Select the role "Citizen" and sign up.

You will be taken to the Citizen Portal. Click "Submit New Report" to try the map form.

When you're done, click "Logout" (in the top header).

You will be back on the landing page. Click "Register" again.

This time, create a second user with the role "Staff" (use a different email).

You will now be logged into the Staff Portal. You can see the report you just submitted as a citizen and change its status.
