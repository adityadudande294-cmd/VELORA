# 📖 VELORA User Guide

Welcome to **VELORA** – A Cinematic AI-Powered Storytelling Platform.

This guide will help you install, run, and use the project.

---

# 🚀 Part 1: How to Run VELORA

## Step 1: Extract the Project

Extract the project folder.

Open it in **Visual Studio Code**.

---

## Step 2: Start the Frontend

Open Terminal.

Run:

```bash
npm install
```

After installation:

```bash
npm run dev
```

The frontend will start.

Open:

http://localhost:3000

---

## Step 3: Start the Backend

Open a new terminal.

Go to the backend folder.

```bash
cd backend
```

Install Python packages.

```bash
pip install -r requirements.txt
```

Start FastAPI.

```bash
uvicorn app.main:app --reload
```

Backend URL:

http://localhost:8000

API Documentation:

http://localhost:8000/docs

---

## Step 4: Verify Everything

Make sure:

✅ Frontend is running

✅ Backend is running

✅ Database is connected

Now open:

http://localhost:3000

Enjoy VELORA.

---

# 📚 Part 2: How to Use VELORA

## Home Page

After opening the website, you will see the cinematic welcome screen.

Wait for the intro to finish or skip it.

You will enter the Dashboard.

---

## Dashboard

The Dashboard contains:

• Featured Stories

• Categories

• Search

• AI Assistant

• User Profile

• Settings

Choose any story to begin reading.

---

## Reading a Story

Click on any story.

Inside the reader you can:

• Read the story

• Listen using AI Narration

• Highlight important text

• Add Notes

• Bookmark the story

• View Timeline

• Read References

---

## AI Assistant

Open the AI Chat.

You can ask questions like:

• Summarize this story

• Explain in Hindi

• Explain in Marathi

• Give Key Points

• Recommend similar stories

---

## Search

Use the Search Bar.

Search by:

• Story Name

• Category

• Keywords

• Historical Place

---

## Bookmarks

Click the Bookmark icon.

Saved stories can be opened later.

---

## Notes

Highlight text.

Create personal notes.

Notes are automatically saved.

---

## Settings

Open Settings.

You can change:

• Theme

• Language

• Narration

• Reading Preferences

---

## Admin Panel

Open:

http://localhost:3000/admin

Login:

Username:

aditya

Password:

2005

Admin Features:

• Create Story

• Edit Story

• Delete Story

• Manage Categories

• Manage Users

• View Analytics

---

# 🎵 Features

VELORA includes:

✅ Cinematic Intro

✅ AI Story Reader

✅ AI Narration

✅ Search

✅ Bookmarks

✅ Notes

✅ Story Timeline

✅ AI Assistant

✅ Multi-language Support

✅ Admin Dashboard

---

# ❓ Troubleshooting

### Frontend Not Opening

Run:

```bash
npm install
npm run dev
```

---

### Backend Not Opening

Run:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### API Not Working

Check:

http://localhost:8000/docs

---

### Database Error

Verify MongoDB is connected.

Check environment variables.

---

# 📞 Support

Project Name:

VELORA

Version:

1.0

Thank you for using VELORA.

Happy Reading!