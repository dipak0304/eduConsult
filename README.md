# EduConsult Pro

A full-stack educational consultation platform with AI-powered grading capabilities.

**Repository:** https://github.com/dipak0304/eduConsult

## Features

- User authentication and authorization
- AI-powered assignment grading using Groq API
- Email notifications via EmailJS and Nodemailer
- Contact form integration
- MongoDB database integration
- Responsive React frontend with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- html2canvas

### Backend
- Node.js with TypeScript
- Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer (Gmail SMTP)
- EmailJS
- OpenAI SDK (for AI grading)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dipak0304/eduConsult
cd eduConsult
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd server
npm install
```

## Environment Setup

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/educonsult
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-this-in-production

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_SERVICE=gmail

# EmailJS Configuration for Contact Form
EMAILJS_SERVICE_ID=service_szn3uv8
EMAILJS_TEMPLATE_ID=template_5azpi4e
EMAILJS_PUBLIC_KEY=IGNAC4I10-7tdwi6X
EMAILJS_PRIVATE_KEY=your-private-key-here
ADMIN_EMAIL=info@educonsult.pro

# Groq API Key for AI Grading
AI_API_KEY=your_groq_api_key_here

# Teacher Email Credentials
TEACHER_EMAIL=teacher_email@example.com
TEACHER_PASS=teacher_password
```

### Important Notes

- **JWT_SECRET**: Generate a secure random string for production use
- **EMAIL_PASS**: Use an App Password from Gmail, not your regular password
- **EMAILJS credentials**: Obtain these from your EmailJS account
- **AI_API_KEY**: Get your Groq API key from [Groq Console](https://console.groq.com)

## Running the Application

### Development Mode

1. Start the MongoDB server (if using local MongoDB)

2. Start the backend server:
```bash
cd server
npm run dev
```

3. Start the frontend (in a new terminal):
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5001`

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
```

2. Build the backend:
```bash
cd server
npm run build
```

3. Start the backend server:
```bash
cd server
npm start
```

## Project Structure

```
eduConsult/
├── client/                 # React frontend
│   ├── src/               # Source files
│   ├── .env.example       # Environment variables template
│   ├── package.json       # Dependencies and scripts
│   └── vite.config.js     # Vite configuration
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── .env.example      # Environment variables template
│   ├── package.json      # Dependencies and scripts
│   └── server.ts         # Entry point
└── README.md             # This file
```

## API Endpoints

The API base URL is `http://localhost:5001/api`

- Authentication endpoints
- User management endpoints
- Assignment submission endpoints
- AI grading endpoints
- Contact form endpoints

## License

ISC
