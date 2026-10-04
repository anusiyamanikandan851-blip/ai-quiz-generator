import { ArrowRight, Brain, ChartNoAxesCombined, CircleCheck, FileQuestion, Lightbulb, Sparkles } from "lucide-react";

export default function Home() {
  return <div>
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300"><Sparkles size={16}/> AI-powered learning</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl dark:text-white">Turn any topic into an <span className="text-brand-600">AI-powered quiz.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Generate personalized questions, test your knowledge, understand your mistakes, and get practical study recommendations.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#/generate" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-soft hover:bg-brand-700">Generate Quiz <ArrowRight size={18}/></a><a href="#/generate?demo=1" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold dark:border-slate-700 dark:bg-slate-900">Try Demo</a></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-3xl font-bold dark:text-white">Everything you need to learn better</h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [Brain,"AI Question Generation","Create fresh questions for almost any subject."],
          [FileQuestion,"Custom Quizzes","Choose topic, difficulty, count and question type."],
          [CircleCheck,"Instant Evaluation","Get score, accuracy and answer explanations immediately."],
          [ChartNoAxesCombined,"Performance Analytics","Track your progress across quizzes."],
          [Lightbulb,"AI Study Advice","Identify weak areas and get targeted recommendations."],
          [Sparkles,"Mobile Friendly","Study comfortably on your phone, tablet or laptop."]
        ].map(([Icon,title,desc]:any)=><div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Icon className="text-brand-600" size={25}/><h3 className="mt-4 font-bold dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{desc}</p></div>)}
      </div>
    </section>
  </div>
}