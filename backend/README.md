# Backend for Medical Demo App

This directory contains the Python backend for the medical demo application. It's built with FastAPI and uses text files as a simple database.

## Running the Backend

1. **Install Dependencies:**
   Make sure you have Python 3.7+ installed. Then, install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server:**
   From the `backend` directory, run the following command to start the FastAPI server:
   ```bash
   python main.py
   ```
   The server will be running at `http://localhost:8000`.

## Running the Frontend

To run the frontend and connect it to this backend, follow these steps:

1. **Navigate to the root of the repository.**
2. **Install frontend dependencies:**
   ```bash
   npm install
   ```
3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` and will be configured to communicate with the backend at `http://localhost:8000`.