import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GenerateQuiz from "./pages/GenerateQuiz";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function route(){
 const p=location.hash.replace(/^#/,"")||"/";
 return p;
}
export default function App(){
 const [path,setPath]=useState(route());
 useEffect(()=>{const f=()=>setPath(route());addEventListener("hashchange",f);return()=>removeEventListener("hashchange",f)},[]);
 useEffect(()=>{document.documentElement.classList.toggle("dark",localStorage.getItem("quizgen_theme")==="dark")},[]);
 let page:any;
 if(path==="/"||path==="") page=<Home/>;
 else if(path==="/generate"||path.startsWith("/generate?")) page=<GenerateQuiz/>;
 else if(path.startsWith("/quiz/")) page=<Quiz id={path.split("/")[2]}/>;
 else if(path.startsWith("/results/")) page=<Results id={path.split("/")[2]}/>;
 else if(path==="/history") page=<History/>;
 else if(path==="/analytics") page=<Analytics/>;
 else if(path==="/settings") page=<Settings/>;
 else page=<Home/>;
 return <><Navbar/><div className="min-h-[calc(100vh-73px)] bg-slate-50 dark:bg-slate-950">{page}</div><footer className="border-t bg-white py-8 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950">QuizGen AI · Learn Smarter. Quiz Better.</footer></>
}