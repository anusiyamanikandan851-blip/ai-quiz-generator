export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "Multiple Choice" | "True / False" | "Mixed";

export interface QuizQuestion {
  id: string;
  question: string;
  type: "mcq" | "true_false";
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  questionType: QuestionType;
  language: string;
  timerSeconds: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  quizId: string;
  answers: Record<string, string>;
  score: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  completedAt: string;
}
