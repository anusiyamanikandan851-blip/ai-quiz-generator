import { Moon, Sun, Sparkles } from "lucide-react";
import { getTheme, setTheme } from "../utils/storage";
import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(getTheme() === "dark");
  const toggle = () => {
    const next = !dark;
    setDark(next); setTheme(next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };
  return <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <a href="#/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
        <span className="rounded-xl bg-brand-600 p-2 text-white"><Sparkles size={18}/></span> QuizGen AI
      </a>
      <nav className="hidden gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
        <a href="#/" className="hover:text-brand-600">Home</a><a href="#/generate" className="hover:text-brand-600">Generate Quiz</a><a href="#/history" className="hover:text-brand-600">History</a><a href="#/analytics" className="hover:text-brand-600">Analytics</a>
      </nav>
      <button onClick={toggle} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700" aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
    </div>
  </header>
}