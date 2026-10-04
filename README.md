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

## Run in VS Code

Requirements:
- Node.js 18+ recommended
- VS Code

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open the terminal.
4. Install dependencies:

```bash
npm install
```

5. Optional: copy `.env.example` to `.env` and configure your AI provider.

6. Start:

```bash
npm run dev
```

7. Open the URL shown by Vite.

## AI configuration

The starter app works without an external key using built-in demo question data for Java/DBMS. For a real AI integration, configure:

```env
VITE_AI_API_KEY=
VITE_AI_API_URL=
VITE_AI_MODEL=
```

The expected endpoint should accept JSON containing `model` and `prompt`, and return generated text in one of `text`, `output`, or `choices[0].message.content`.

For production, do not expose provider secrets in a browser application. Use a server-side proxy/API route and keep secrets on the server.

## Important

The included fallback generator is for local/demo testing. Replace it with a secure server-side AI integration before production deployment.

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```
