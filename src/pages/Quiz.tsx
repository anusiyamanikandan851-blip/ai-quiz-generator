import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { getQuizzes, saveAttempt } from "../utils/storage";
import { scoreQuiz } from "../utils/scoring";
import type { Quiz as QuizType } from "../types/quiz";

export default function QuizPage({id}:{id:string}) {
  const quiz=getQuizzes().find(q=>q.id===id) as QuizType|undefined;
  const [index,setIndex]=useState(0), [answers,setAnswers]=useState<Record<string,string>>({}), [seconds,setSeconds]=useState(quiz?.timerSeconds||0);
  const [confirm,setConfirm]=useState(false);
  const q=quiz?.questions[index];

  useEffect(()=>{
    if (!quiz || !quiz.timerSeconds) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz]);

  useEffect(()=>{
    if (quiz && quiz.timerSeconds && seconds === 0) {
      submit();
    }
  }, [seconds, quiz]);

  if(!quiz||!q)return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Quiz not found</h1><a className="mt-4 inline-block text-brand-600" href="#/generate">Create a quiz</a></div>;
  function choose(a:string){setAnswers(x=>({...x,[q!.id]:a}))}
  function submit(){if(!quiz)return; const attempt=scoreQuiz(quiz,answers);saveAttempt(attempt);location.hash=`#/results/${quiz.id}`}
  const mins=Math.floor(seconds/60).toString().padStart(2,"0"), secs=(seconds%60).toString().padStart(2,"0");
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between"><div><p className="text-sm font-semibold text-brand-600">{quiz.topic} · {quiz.difficulty}</p><h1 className="text-2xl font-black dark:text-white">{quiz.title}</h1></div>{quiz.timerSeconds>0&&<div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 font-bold dark:bg-slate-800"><Clock3 size={17}/>{mins}:{secs}</div>}</div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full bg-brand-600 transition-all" style={{width:`${((index+1)/quiz.questions.length)*100}%`}}/></div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex justify-between text-sm text-slate-500"><span>Question {index+1} of {quiz.questions.length}</span><span>{q.topic}</span></div>
          <h2 className="mt-5 text-xl font-bold leading-8 dark:text-white">{q.question}</h2>
          <div className="mt-7 grid gap-3">{q.options.map((opt,i)=><button key={opt} onClick={()=>choose(opt)} className={`w-full rounded-2xl border p-4 text-left transition ${answers[q.id]===opt?"border-brand-500 bg-indigo-50 text-brand-700 dark:bg-indigo-950/40 dark:text-indigo-200":"border-slate-200 hover:border-brand-300 dark:border-slate-700 dark:hover:border-slate-600"}`}><span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">{String.fromCharCode(65+i)}</span>{opt}</button>)}</div>
        </div>
        <div className="mt-5 flex justify-between"><button disabled={index===0} onClick={()=>setIndex(i=>i-1)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 disabled:opacity-40 dark:border-slate-700"><ArrowLeft size={17}/> Previous</button>{index===quiz.questions.length-1?<button onClick={()=>setConfirm(true)} className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white">Submit Quiz</button>:<button onClick={()=>setIndex(i=>i+1)} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white">Next <ArrowRight size={17}/></button>}</div>
      </main>
      {confirm&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900"><h3 className="text-lg font-bold dark:text-white">Submit quiz?</h3><p className="mt-2 text-sm text-slate-500">You can review your answers before submitting.</p><div className="mt-5 flex gap-2"><button onClick={()=>setConfirm(false)} className="flex-1 rounded-xl border px-4 py-3 dark:border-slate-700">Cancel</button><button onClick={submit} className="flex-1 rounded-xl bg-brand-600 px-4 py-3 font-bold text-white">Submit</button></div></div></div>}
    </>
  );
}