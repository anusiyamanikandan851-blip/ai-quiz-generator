import type { Difficulty, QuestionType, QuizQuestion } from "../types/quiz";

const fallbackTopics: Record<string, QuizQuestion[]> = {
  java: [
    { id:"j1", question:"Which concept allows a Java class to acquire properties and methods from another class?", type:"mcq", options:["Encapsulation","Inheritance","Compilation","Casting"], correctAnswer:"Inheritance", explanation:"Inheritance allows a subclass to acquire accessible members of a superclass.", topic:"Inheritance", difficulty:"Medium" },
    { id:"j2", question:"Which keyword is used to create an object in Java?", type:"mcq", options:["class","new","this","object"], correctAnswer:"new", explanation:"The new keyword creates an object and allocates memory for it.", topic:"Objects", difficulty:"Easy" },
    { id:"j3", question:"Method overloading means defining methods with the same name but different parameter lists.", type:"true_false", options:["True","False"], correctAnswer:"True", explanation:"Overloading is compile-time polymorphism and requires different parameter lists.", topic:"Polymorphism", difficulty:"Medium" },
    { id:"j4", question:"Which access modifier gives the widest access within Java?", type:"mcq", options:["private","protected","public","default"], correctAnswer:"public", explanation:"A public member can be accessed wherever the class is accessible.", topic:"Access Modifiers", difficulty:"Easy" },
    { id:"j5", question:"Which keyword prevents a class from being inherited?", type:"mcq", options:["static","final","private","sealed"], correctAnswer:"final", explanation:"A final class cannot be extended by another class.", topic:"Inheritance", difficulty:"Medium" }
  ],
  dbms: [
    { id:"d1", question:"What is the primary goal of database normalization?", type:"mcq", options:["Increase redundancy","Reduce redundancy","Remove indexes","Increase duplication"], correctAnswer:"Reduce redundancy", explanation:"Normalization organizes data to reduce unnecessary redundancy and update anomalies.", topic:"Normalization", difficulty:"Easy" },
    { id:"d2", question:"A primary key uniquely identifies each row in a relation.", type:"true_false", options:["True","False"], correctAnswer:"True", explanation:"A primary key must uniquely identify tuples and cannot contain null values.", topic:"Keys", difficulty:"Easy" },
    { id:"d3", question:"Which SQL command is used to retrieve data?", type:"mcq", options:["SELECT","UPDATE","DELETE","INSERT"], correctAnswer:"SELECT", explanation:"SELECT retrieves rows and columns from one or more tables.", topic:"SQL", difficulty:"Easy" },
    { id:"d4", question:"Which normal form removes partial dependency?", type:"mcq", options:["1NF","2NF","3NF","BCNF"], correctAnswer:"2NF", explanation:"Second normal form removes partial dependencies on a composite candidate key.", topic:"Normalization", difficulty:"Medium" },
    { id:"d5", question:"Which property of a transaction means it is all-or-nothing?", type:"mcq", options:["Consistency","Isolation","Atomicity","Durability"], correctAnswer:"Atomicity", explanation:"Atomicity ensures that all operations in a transaction succeed or none are applied.", topic:"Transactions", difficulty:"Medium" }
  ]
};

function localQuestions(topic: string, difficulty: Difficulty, count: number, type: QuestionType): QuizQuestion[] {
  const key = topic.toLowerCase().includes("java") ? "java" : topic.toLowerCase().includes("dbms") || topic.toLowerCase().includes("database") ? "dbms" : "java";
  const base = fallbackTopics[key].map(q => ({...q, difficulty}));
  const result: QuizQuestion[] = [];
  for (let i=0; i<count; i++) {
    const source = base[i % base.length];
    const isTF = type === "True / False" || (type === "Mixed" && i % 3 === 2);
    result.push({...source, id:`${Date.now()}-${i}`, type:isTF ? "true_false" : "mcq", options:isTF ? ["True","False"] : source.options});
  }
  return result;
}

export async function generateQuiz(
  topic: string, difficulty: Difficulty, count: number, type: QuestionType,
  language: string, material = ""
): Promise<QuizQuestion[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  try {
    const response = await fetch(`${baseUrl}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count, type, language, material }),
    });

    if (!response.ok) {
      return localQuestions(topic, difficulty, count, type);
    }

    const data = await response.json();
    if (Array.isArray(data.questions) && data.questions.length > 0) {
      return data.questions;
    }

    return localQuestions(topic, difficulty, count, type);
  } catch (error) {
    return localQuestions(topic, difficulty, count, type);
  }
}

export async function analyzePerformance(topic: string, score: number, total: number, wrongTopics: string[]) {
  const pct = total ? Math.round(score/total*100) : 0;
  const strengths = pct >= 75 ? `You showed a good understanding of ${topic}.` : `You have a starting understanding of ${topic}, but need more practice.`;
  const weak = wrongTopics.length ? `Focus on: ${Array.from(new Set(wrongTopics)).join(", ")}.` : "No major weak areas were detected in this attempt.";
  return {
    overall: `You scored ${score}/${total} (${pct}%). ${strengths}`,
    strengths: pct >= 75 ? ["Core concepts", "Applying basic knowledge"] : ["Identifying familiar concepts"],
    weakAreas: wrongTopics.length ? Array.from(new Set(wrongTopics)) : ["Continue practicing advanced applications"],
    recommendations: [weak, "Review the explanations for incorrect answers.", "Try a similar quiz and then increase the difficulty."]
  };
}
