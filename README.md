# QuizGen AI

QuizGen AI is a lightweight React + TypeScript AI quiz generator designed for an MCA project/demo.

## Features

- Topic-based quiz generation
- Optional study material
- Easy / Medium / Hard difficulty
- Multiple Choice, True/False and Mixed modes
- 5/10/15/20 questions
- Optional timer
- Automatic scoring
- Question explanations
- Performance analysis
- Quiz history
- Analytics
- Dark mode
- LocalStorage persistence
- Mobile responsive UI
- Optional external AI provider integration

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Local setup

Requirements:
- Node.js 18+ recommended

Install dependencies and create your local environment file:

```bash
npm install
```

In PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` to configure an AI provider, then start the frontend and Express server together:

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

Without an AI provider configured, the app uses its built-in demo questions. To enable AI generation, set these variables in the project-root `.env` file:

- `AI_API_KEY`: provider key, read only by the Express server.
- `AI_API_URL`: provider endpoint. It must accept a JSON body containing `model` and `prompt`, and return generated text in `text`, `output`, or `choices[0].message.content`.
- `AI_MODEL`: optional model name; defaults to `gemini-2.0-flash`.
- `VITE_API_BASE_URL`: frontend API base URL; defaults to `http://localhost:5000`. This URL is public and must never contain a secret.
- `PORT` and `FRONTEND_URL`: optional server settings; default to `5000` and `http://localhost:5173`.

Never put an AI provider key in a `VITE_*` variable. Vite variables are included in the browser build.

Quizzes and history are stored in browser local storage. MongoDB is not required.

## Deployment

The Netlify and Vercel configuration in this repository builds and serves the static frontend only. Deploy the Express server (`npm start`) to a Node.js host separately, then:

1. Set `AI_API_KEY` and `AI_API_URL` in the backend host's environment settings. Set `AI_MODEL` if needed.
2. Set `FRONTEND_URL` on the backend to the deployed frontend's origin.
3. Set `VITE_API_BASE_URL` to the backend's public base URL when building the frontend.
4. Keep all provider credentials in the backend host's environment settings, never in frontend build variables.

The app can still generate demo quizzes without provider credentials, but real AI generation requires the backend to be deployed and configured.

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```
