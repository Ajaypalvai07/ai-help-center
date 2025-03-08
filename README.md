# AI Help Center

A modern AI-powered help center built with React, FastAPI, and MongoDB.

## Project Structure

```
ai-help-center/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Public assets
│   └── package.json   # Frontend dependencies
│
└── backend/           # FastAPI backend application
    ├── src/          # Source code
    ├── requirements.txt  # Backend dependencies
    └── main.py       # Main application entry point
```

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management

### Backend
- FastAPI (Python)
- MongoDB for database
- JWT for authentication
- WebSocket for real-time features

## Features

- 🤖 AI-powered chat assistance
- 🔐 User authentication and authorization
- 👥 Admin dashboard with analytics
- 📊 Real-time data visualization
- 🎨 Modern, responsive UI with dark mode
- 🔍 Context-aware responses
- 💾 MongoDB database integration
- 🚀 Real-time feedback system

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/ai-help-center.git
cd ai-help-center
```

2. Install dependencies
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt
```

3. Set up environment variables
```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env
```

4. Start development servers
```bash
# Terminal 1: Start backend
cd backend
uvicorn main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas
- Cache: Redis Cloud

## Contributing

This is a personal project but suggestions and feedback are welcome!

## License

MIT License

## Developer

Developed by **Ajay Palvai** as a learning project.

## Features

- 🤖 AI-powered chat assistance
- 🔐 User authentication and authorization
- 👥 Admin dashboard with analytics
- 📊 Real-time data visualization
- 🎨 Modern, responsive UI with dark mode
- 🔍 Context-aware responses
- 📱 Multimedia support (voice and image)
- 💾 MongoDB database integration
- 🚀 Real-time feedback system

## Deployment Instructions

### Backend (Render)

1. Push your code to GitHub
2. Go to render.com and create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn wsgi:application --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - Root Directory: `backend`
5. Add environment variables:
   - `MONGODB_URL`
   - `MONGODB_DB_NAME`
   - `SECRET_KEY`
   - `CORS_ORIGINS`

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to vercel.com and create a new project
3. Connect your GitHub repository
4. Configure the project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/ai-help-center.git
cd ai-help-center
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend
```bash
cd frontend
npm install
```

4. Create environment files
```bash
# In backend directory
cp .env.example .env

# In frontend directory
cp .env.example .env.local
```

5. Start development servers
```bash
# Terminal 1 - Backend
cd backend
uvicorn src.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Contact

- LinkedIn: [Ajay Palvai](https://www.linkedin.com/in/ajay-palvai-384750210/)
- Email: palvaiajay4730@gmail.com
- GitHub: [Ajaypalvai07](https://github.com/Ajaypalvai07)

## Acknowledgments

Special thanks to the open-source community and all the amazing libraries and tools that made this project possible.

