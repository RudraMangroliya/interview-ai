# Interview AI 🤖💬

An AI-powered interview preparation platform designed to help candidates practice mock interviews, analyze resumes, and receive real-time feedback using Google Gemini AI.

---

## 🚀 Features

- 📝 **Resume Parsing & Analysis**: Upload resumes (PDF format) for tailored interview preparation.
- 🎯 **AI-Generated Mock Interviews**: Dynamic interview questions tailored to specific job roles and candidate profiles.
- ⚡ **Real-Time Feedback & Scoring**: Instant evaluations on user responses using Google Gemini AI models.
- 🔐 **User Authentication**: Secure signup/login flow powered by JWT and bcrypt.
- 🎨 **Modern & Responsive UI**: Clean interface built with React, Vite, and custom SCSS styling.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: React Router v7
- **Styling**: SCSS (Sass)
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose ORM
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File & PDF Processing**: Multer & PDF-Parse
- **Validation**: Zod

---

## 📂 Project Structure

```text
interview-ai-yt/
├── Backend/
│   ├── src/
│   │   ├── config/      # Database & app config
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express routes
│   │   └── services/    # Gemini AI integration & logic
│   ├── server.js        # Backend entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/  # Shared components
│   │   ├── features/    # Auth & Interview features
│   │   └── style/       # SCSS styles
│   └── package.json
│
├── vercel.json          # Deployment configuration
└── README.md            # Project documentation
```

---

## 📦 Getting Started

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

---

### **1. Setup Backend**

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend server:

```bash
npm run dev
```

---

### **2. Setup Frontend**

```bash
cd Frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📜 License

This project is licensed under the ISC License.
