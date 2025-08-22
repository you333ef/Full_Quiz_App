'use client'
import React, { useEffect, useState } from "react";

interface MappedQuestion {
  id: string | number | null;
  title: string;
  description?: string;
  choices: string[];
  correctIndex: number;
  difficulty: string;
  type: string;
}

interface QuestionConfirmationDialogProps {
  question: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const mapIncomingToQuestion = (incoming: any): MappedQuestion | null => {
  if (!incoming) return null;

  let data = incoming;
  if (typeof incoming === "object" && incoming !== null) {
    if ("data" in incoming) data = incoming.data;
    if ("response" in incoming && incoming.response && "data" in incoming.response) data = incoming.response.data;
  }

  if (!data) return null;

  const id = data._id ?? data.id ?? null;
  const title = data.title ?? data.name ?? "بدون عنوان";
  const description = data.description ?? "";
  let choices: string[] = [];
  const opts = data.options ?? data.choices ?? data.optionsList ?? null;

  if (Array.isArray(opts)) {
    if (opts.length && typeof opts[0] === "string") choices = opts;
    else if (opts.length && typeof opts[0] === "object") {
      choices = opts.map((o: any) => {
        if (typeof o === "string") return o;
        if ("text" in o) return o.text;
        if ("value" in o) return o.value;
        if ("label" in o) return o.label;
        return JSON.stringify(o);
      });
    }
  } else if (opts && typeof opts === "object") {
    const arr: string[] = [];
    for (let i = 0; i < letters.length; i++) {
      const key = letters[i];
      if (Object.prototype.hasOwnProperty.call(opts, key)) {
        const v = (opts as any)[key];
        if (typeof v === "string") arr.push(v);
        else if (typeof v === "object") {
          if ("text" in v) arr.push(v.text);
          else if ("value" in v) arr.push(v.value);
          else arr.push(JSON.stringify(v));
        } else arr.push(String(v));
      }
    }
    if (arr.length) choices = arr;
    else {
      for (const k of Object.keys(opts)) {
        if (k === "_id") continue;
        const v = (opts as any)[k];
        if (typeof v === "string") choices.push(v);
        else if (typeof v === "object") {
          if ("text" in v) choices.push(v.text);
          else if ("value" in v) choices.push(v.value);
          else choices.push(JSON.stringify(v));
        } else choices.push(String(v));
      }
    }
  }

  if (!choices.length && data.answerChoices && Array.isArray(data.answerChoices)) choices = data.answerChoices;

  let correctIndex = -1;
  const ans = data.answer ?? data.correctAnswer ?? data.correctOption ?? data.answerKey ?? null;

  if (typeof ans === "number") correctIndex = ans;
  else if (typeof ans === "string") {
    const trimmed = ans.trim();
    if (trimmed.length === 1 && /[A-Za-z]/.test(trimmed)) {
      const idx = letters.indexOf(trimmed.toUpperCase());
      if (idx >= 0) correctIndex = idx;
    } else {
      const found = choices.findIndex(c => String(c).trim() === trimmed);
      if (found >= 0) correctIndex = found;
      else {
        const parsed = parseInt(trimmed, 10);
        if (!isNaN(parsed)) correctIndex = parsed;
      }
    }
  }

  const difficulty = data.difficulty ?? data.level ?? "medium";
  const type = data.type ?? data.questionType ?? data.category ?? "BE";

  return {
    id,
    title,
    description,
    choices,
    correctIndex,
    difficulty,
    type,
  };
};

const getDifficultyColor = (difficulty: string) => {
  switch (String(difficulty).toLowerCase()) {
    case "easy":
      return "bg-green-600 text-white";
    case "medium":
      return "bg-yellow-600 text-white";
    case "hard":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const getTypeColor = (type: string) => {
  const t = String(type).toUpperCase();
  switch (t) {
    case "FE":
      return "bg-blue-600 text-white";
    case "BE":
      return "bg-purple-600 text-white";
    case "FS":
      return "bg-indigo-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const QuestionConfirmationDialog: React.FC<QuestionConfirmationDialogProps> = ({ question, open, onOpenChange }) => {
  const [mapped, setMapped] = useState<MappedQuestion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const mq = mapIncomingToQuestion(question);
    setMapped(mq);
    setLoading(false);
  }, [open, question]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const close = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog" dir="rtl">
      <div className="absolute inset-0 bg-black/70" onClick={close} aria-hidden="true" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6" style={{ backgroundColor: "#fff", color: "#000" }}>
        <div className="flex items-start justify-between mb-4">
        
          <button onClick={close} aria-label="close" className="p-1 rounded hover:bg-white/10" style={{ color: "#000" }}>✕</button>
        </div>

        {loading && <p className="text-center text-gray-400">جارِ تحميل البيانات...</p>}
        {!mapped && !loading && <p className="text-center text-red-500">لا توجد بيانات للسؤال</p>}

        {mapped && !loading && (
          <div className="space-y-6">
            <div className="space-y-4">
            
              <h3 className="text-lg font-semibold text-center leading-relaxed" style={{ color: "#000" }}>{mapped.title}</h3>

            </div>

            <div className="space-y-3">
           
              <div className="space-y-2">
                {mapped.choices.map((choice, index) => {
                  const isCorrect = index === mapped.correctIndex;
                  return (
                    <div key={index} className="transition-all duration-300 border-2 rounded-lg" style={{ backgroundColor: isCorrect ? "#000" : "#fff", borderColor: "rgba(0,0,0,0.2)", color: "#fff" }}>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCorrect && (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                                <path d="M7.5 12.5l2.25 2.25L16.5 8.0" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>

                            </>
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <span className="text-sm font-medium" style={{ color: isCorrect? "#fff":'#000' }}>{String.fromCharCode(65 + index)}){" "}</span>
                          <span className="mr-2" style={{ color: isCorrect ? "#fff" : "#000" }}>{choice}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg hidden sm-block p-4 space-y-2" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-right">
                  <span className="font-medium" style={{ color: "#fff" }}>Type: </span>
                  <span style={{ color: "#ccc" }}>{mapped.description}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium" style={{ color: "#fff" }}>Type: </span>
                  <span style={{ color: "#ccc" }}>{mapped.type}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium" style={{ color: "#fff" }}>Difficulty rating: </span>
                  <span style={{ color: "#ccc" }}>{mapped.difficulty === "easy" ? 'Easy': mapped.difficulty === "medium" ? "Medium" : "Defficult"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionConfirmationDialog;
