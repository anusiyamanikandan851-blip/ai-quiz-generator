import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { generateQuiz } from "../services/aiService";
import { saveQuiz } from "../utils/storage";
import type { Difficulty, QuestionType, Quiz } from "../types/quiz";

export default function GenerateQuiz() {
  const [topic,setTopic]=useState("Java OOP"), [material,setMaterial]=useState(""), [count,setCount]=useState(5);
  const [difficulty,setDifficulty]=useState<Difficulty>("Medium"), [type,setType]=useState<QuestionType>("Multiple Choice"), [language,setLanguage]=useState("English");
  const [timer,setTimer]=useState(0), [loading,setLoading]=useState(false), [error,setError]=useState("");
  async function submit(e:any) {
    e.preventDefault(); if(!topic.trim()){setError("Please enter a topic.");return}
    setLoading(true); setError("");
    try {
      const questions=await generateQuiz(topic,difficulty,count,type,language,material);
      const quiz:Quiz={id:crypto.randomUUID(),title:`${topic} Quiz`,topic,difficulty,questionCount:questions.length,questionType:type,language,timerSeconds:timer,questions,createdAt:new Date().toISOString()};
      saveQuiz(quiz); location.hash=`#/quiz/${quiz.id}`;
    } catch(err){setError("Unable to generate the quiz right now. Check your AI configuration or try again.");}
    finally{setLoading(false)}
  }
  return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><div className="mb-8"><p className="font-semibold text-brand-600">Quiz Builder</p><h1 className="mt-2 text-4xl font-black dark:text-white">Create your AI quiz</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Choose your settings and let QuizGen AI prepare the questions.</p></div>
    <form onSubmit={submit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <label className="block"><span className="font-semibold dark:text-white">Topic</span><input value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-slate-700" placeholder="e.g. Machine Learning"/></label>
      <label className="block"><span className="font-semibold dark:text-white">Optional study material</span><textarea value={material} onChange={e=>setMaterial(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-brand-500 dark:border-slate-700" placeholder="Paste notes here if you want the quiz grounded in your material..."/></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="font-semibold dark:text-white">Questions</span><select value={count} onChange={e=>setCount(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700">{[5,10,15,20].map(n=><option key={n}>{n}</option>)}</select></label>
        <label><span className="font-semibold dark:text-white">Difficulty</span><select value={difficulty} onChange={e=>setDifficulty(e.target.value as Difficulty)} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700">{["Easy","Medium","Hard"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span className="font-semibold dark:text-white">Question type</span><select value={type} onChange={e=>setType(e.target.value as QuestionType)} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700">{["Multiple Choice","True / False","Mixed"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span className="font-semibold dark:text-white">Language</span><select value={language} onChange={e=>setLanguage(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700">{["English","Tamil","Hindi"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="sm:col-span-2"><span className="font-semibold dark:text-white">Timer</span><select value={timer} onChange={e=>setTimer(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700"><option value={0}>No Timer</option><option value={300}>5 minutes</option><option value={600}>10 minutes</option><option value={1200}>20 minutes</option><option value={1800}>30 minutes</option></select></label>
      </div>
      {error&&<div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60">{loading?<><LoaderCircle className="animate-spin" size={18}/> Generating...</>:<><Sparkles size={18}/> Generate Quiz with AI</>}</button>
      <p className="text-center text-xs text-slate-400">If no AI provider is configured, the included starter demo generator can still be used for testing.</p>
    </form>
  </main>
}