import type { Quiz, QuizAttempt } from "../types/quiz";

const QUIZZES = "quizgen_quizzes";
const ATTEMPTS = "quizgen_attempts";
const SAVED = "quizgen_saved";
const THEME = "quizgen_theme";

export function getQuizzes(): Quiz[] {
  return JSON.parse(localStorage.getItem(QUIZZES) || "[]");
}
export function saveQuiz(quiz: Quiz) {
  localStorage.setItem(QUIZZES, JSON.stringify([quiz, ...getQuizzes()].slice(0, 100)));
}
export function deleteQuiz(id: string) {
  localStorage.setItem(QUIZZES, JSON.stringify(getQuizzes().filter(q => q.id !== id)));
  const attempts = getAttempts().filter(a => a.quizId !== id);
  localStorage.setItem(ATTEMPTS, JSON.stringify(attempts));
}
export function getAttempts(): QuizAttempt[] {
  return JSON.parse(localStorage.getItem(ATTEMPTS) || "[]");
}
export function saveAttempt(attempt: QuizAttempt) {
  const others = getAttempts().filter(a => a.quizId !== attempt.quizId);
  localStorage.setItem(ATTEMPTS, JSON.stringify([attempt, ...others]));
}
export function getAttempt(id: string) {
  return getAttempts().find(a => a.quizId === id);
}
export function getSaved(): string[] {
  return JSON.parse(localStorage.getItem(SAVED) || "[]");
}
export function toggleSaved(id: string) {
  const current = getSaved();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  localStorage.setItem(SAVED, JSON.stringify(next));
  return next;
}
export function getTheme() {
  return localStorage.getItem(THEME) || "light";
}
export function setTheme(theme: string) {
  localStorage.setItem(THEME, theme);
}
export function clearAllHistory() {
  localStorage.removeItem(QUIZZES);
  localStorage.removeItem(ATTEMPTS);
}
