import { clearAllHistory, getTheme, setTheme } from "../utils/storage";
import { useState } from "react";

export default function Settings(){
 const [theme,setT]=useState(getTheme());
 function change(v:string){setT(v);setTheme(v);document.documentElement.classList.toggle("dark",v==="dark")}
 return <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6"><h1 className="text-4xl font-black dark:text-white">Settings</h1><div className="mt-8 space-y-5"><section className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold dark:text-white">Appearance</h2><select value={theme} onChange={e=>change(e.target.value)} className="mt-3 w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-900"><option value="light">Light</option><option value="dark">Dark</option></select></section><section className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold dark:text-white">Data</h2><p className="mt-2 text-sm text-slate-500">Quiz history is stored locally in your browser.</p><button onClick={()=>{if(confirm("Clear all quiz history?")){clearAllHistory();location.reload()}}} className="mt-4 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white">Clear Quiz History</button></section></div></main>
}