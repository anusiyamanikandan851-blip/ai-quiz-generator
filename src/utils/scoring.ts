import type { Quiz, QuizAttempt } from "../types/quiz";

export function scoreQuiz(quiz: Quiz, answers: Record<string, string>): QuizAttempt {
  let correct = 0;
  let unanswered = 0;
  quiz.questions.forEach(q => {
    const answer = answers[q.id];
    if (!answer) unanswered++;
    else if (answer === q.correctAnswer) correct++;
  });
  const incorrect = quiz.questions.length - correct - unanswered;
  const percentage = quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0;
  return {
    quizId: quiz.id, answers, score: correct, percentage, correct, incorrect, unanswered,
    completedAt: new Date().toISOString()
  };
}
