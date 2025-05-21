# Gemini Chatbot Application

A full-stack chatbot web application built with **Next.js**, **Supabase**, and the **Gemini API**, allowing users to upload PDF files, ask questions, and receive intelligent responses. Authenticated users can interact with the chatbot and their chat history is saved in a database.

## 🚀 Features

- ✅ User authentication (Register/Login/Logout)
- 📄 Upload and parse PDF documents
- 🤖 Chatbot powered by Gemini API
- 💬 Store and retrieve chat history
- 🌐 Responsive UI using React + Tailwind CSS
- 🗃️ PostgreSQL database integration
- 🔐 Secure routes for authenticated users
- 📦 Well-documented source code and API endpoints

---

## 🧰 Tech Stack

### Frontend:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend:
- [Next.js API Routes]
- [Supabase Auth & Database (PostgreSQL)]
- [Gemini API](https://ai.google.dev/)

### PDF Parsing:
- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) or `pdfjs-dist`

### Deployment (Optional for Bonus):
- [Vercel](https://vercel.com/) / [Heroku](https://www.heroku.com/) / [AWS](https://aws.amazon.com/)


---

## 🛠️ Setup Instructions

### 1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gemini-chatbot.git
cd gemini-chatbot
```

### 2. **install dependecies**

```bash
npm install
```

### 3. **set up environment variables**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. **database set-up**

- If you're using Supabase:

- Set up your project and create a table with fields:

- user_id, timestamp, user_query, bot_response

- Use SQL script provided in /database/schema.sql to initialize the table.

## 📧 Contact

- For any queries or support : 

- yashpatoliya14@gamil.com

