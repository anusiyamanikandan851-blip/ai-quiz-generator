import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://*.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.some((entry) => {
        if (entry.includes('*')) {
          const regex = new RegExp('^' + entry.replace(/\*/g, '.*') + '$');
          return regex.test(origin);
        }
        return entry === origin;
      })) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

const requireApiKey = (req, res, next) => {
  const configuredKey = process.env.API_KEY;
  if (!configuredKey) {
    next();
    return;
  }

  const providedKey = req.headers['x-api-key'];
  if (providedKey === configuredKey) {
    next();
    return;
  }

  res.status(401).json({ message: 'Unauthorized' });
};

const fallbackTopics = {
  java: [
    { id: 'j1', question: 'Which concept allows a Java class to acquire properties and methods from another class?', type: 'mcq', options: ['Encapsulation', 'Inheritance', 'Compilation', 'Casting'], correctAnswer: 'Inheritance', explanation: 'Inheritance allows a subclass to acquire accessible members of a superclass.', topic: 'Inheritance', difficulty: 'Medium' },
    { id: 'j2', question: 'Which keyword is used to create an object in Java?', type: 'mcq', options: ['class', 'new', 'this', 'object'], correctAnswer: 'new', explanation: 'The new keyword creates an object and allocates memory for it.', topic: 'Objects', difficulty: 'Easy' },
    { id: 'j3', question: 'Method overloading means defining methods with the same name but different parameter lists.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Overloading is compile-time polymorphism and requires different parameter lists.', topic: 'Polymorphism', difficulty: 'Medium' },
    { id: 'j4', question: 'Which access modifier gives the widest access within Java?', type: 'mcq', options: ['private', 'protected', 'public', 'default'], correctAnswer: 'public', explanation: 'A public member can be accessed wherever the class is accessible.', topic: 'Access Modifiers', difficulty: 'Easy' },
    { id: 'j5', question: 'Which keyword prevents a class from being inherited?', type: 'mcq', options: ['static', 'final', 'private', 'sealed'], correctAnswer: 'final', explanation: 'A final class cannot be extended by another class.', topic: 'Inheritance', difficulty: 'Medium' },
  ],
  dbms: [
    { id: 'd1', question: 'What is the primary goal of database normalization?', type: 'mcq', options: ['Increase redundancy', 'Reduce redundancy', 'Remove indexes', 'Increase duplication'], correctAnswer: 'Reduce redundancy', explanation: 'Normalization organizes data to reduce unnecessary redundancy and update anomalies.', topic: 'Normalization', difficulty: 'Easy' },
    { id: 'd2', question: 'A primary key uniquely identifies each row in a relation.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'A primary key must uniquely identify tuples and cannot contain null values.', topic: 'Keys', difficulty: 'Easy' },
    { id: 'd3', question: 'Which SQL command is used to retrieve data?', type: 'mcq', options: ['SELECT', 'UPDATE', 'DELETE', 'INSERT'], correctAnswer: 'SELECT', explanation: 'SELECT retrieves rows and columns from one or more tables.', topic: 'SQL', difficulty: 'Easy' },
    { id: 'd4', question: 'Which normal form removes partial dependency?', type: 'mcq', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '2NF', explanation: 'Second normal form removes partial dependencies on a composite candidate key.', topic: 'Normalization', difficulty: 'Medium' },
    { id: 'd5', question: 'Which property of a transaction means it is all-or-nothing?', type: 'mcq', options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'], correctAnswer: 'Atomicity', explanation: 'Atomicity ensures that all operations in a transaction succeed or none are applied.', topic: 'Transactions', difficulty: 'Medium' },
  ],
};

function localQuestions(topic, difficulty, count, type) {
  const key = String(topic || '').toLowerCase().includes('dbms') || String(topic || '').toLowerCase().includes('database') ? 'dbms' : 'java';
  const base = fallbackTopics[key].map((q) => ({ ...q, difficulty }));
  const questions = [];

  for (let i = 0; i < count; i += 1) {
    const source = base[i % base.length];
    const isTrueFalse = type === 'True / False' || (type === 'Mixed' && i % 3 === 2);
    questions.push({
      id: `${Date.now()}-${i}`,
      question: source.question,
      type: isTrueFalse ? 'true_false' : 'mcq',
      options: isTrueFalse ? ['True', 'False'] : source.options,
      correctAnswer: source.correctAnswer,
      explanation: source.explanation,
      topic: source.topic,
      difficulty,
    });
  }

  return questions;
}

function sanitizeQuestion(q, topic, difficulty) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    question: String(q.question || 'Question unavailable'),
    type: q.type === 'true_false' ? 'true_false' : 'mcq',
    options: Array.isArray(q.options) ? q.options.map(String) : ['True', 'False'],
    correctAnswer: String(q.correctAnswer || q.options?.[0] || 'True'),
    explanation: String(q.explanation || 'Review the concept and compare it with the correct answer.'),
    topic: String(q.topic || topic),
    difficulty: q.difficulty || difficulty,
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'QuizGen AI backend is running',
    mongo: Boolean(process.env.MONGODB_URI),
  });
});

app.post('/api/quiz/generate', requireApiKey, async (req, res) => {
  try {
    const { topic = 'Java OOP', difficulty = 'Medium', count = 5, type = 'Multiple Choice', language = 'English', material = '' } = req.body || {};

    const aiKey = process.env.AI_API_KEY;
    const aiUrl = process.env.AI_API_URL;
    const aiModel = process.env.AI_MODEL || 'gemini-2.0-flash';

    if (!aiKey || !aiUrl) {
      return res.json({ questions: localQuestions(topic, difficulty, Number(count), type) });
    }

    const prompt = `Generate exactly ${Number(count)} educational questions about "${topic}". Difficulty: ${difficulty}. Type: ${type}. Language: ${language}. ${material ? `Use this material as the source: ${material}` : ''} Return only valid JSON: {"questions":[{"question":"...","type":"mcq|true_false","options":["..."],"correctAnswer":"...","explanation":"...","topic":"...","difficulty":"..."}]}.`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiKey}`,
      },
      body: JSON.stringify({ model: aiModel, prompt }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      return res.json({ questions: localQuestions(topic, difficulty, Number(count), type) });
    }

    const data = await response.json();
    const raw = data.text || data.output || data.choices?.[0]?.message?.content;

    if (!raw) {
      return res.json({ questions: localQuestions(topic, difficulty, Number(count), type) });
    }

    const cleaned = String(raw).replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return res.json({ questions: localQuestions(topic, difficulty, Number(count), type) });
    }

    const questions = parsed.questions.slice(0, Number(count)).map((q) => sanitizeQuestion(q, topic, difficulty));
    return res.json({ questions });
  } catch (error) {
    const { topic = 'Java OOP', difficulty = 'Medium', count = 5, type = 'Multiple Choice' } = req.body || {};
    return res.json({ questions: localQuestions(topic, difficulty, Number(count), type) });
  }
});

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error.message));
} else {
  console.log('MongoDB not configured. Set MONGODB_URI to enable database persistence.');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`QuizGen backend running on http://localhost:${PORT}`);
});
