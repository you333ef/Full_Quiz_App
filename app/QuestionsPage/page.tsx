"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/* استخدمت imports عادية للأيقونات بدل dynamic to prevent double-mount issues */
import { FiClock } from "react-icons/fi";
import { FaTrophy, FaRocket } from "react-icons/fa";
import { AiOutlineFileText, AiOutlineCheckCircle } from "react-icons/ai";
import { GiPartyPopper } from "react-icons/gi";

interface QuizOption { A?: string; B?: string; C?: string; D?: string; [key: string]: any; _id?: string; }
interface Question { _id: string; title: string; options: QuizOption; }
interface QuizData {
  _id: string; code: string; title: string; description: string; status: string;
  questions_number: number; questions: Question[]; duration: number; score_per_question: number;
}

const PAGE_STYLE: React.CSSProperties = { backgroundColor: "#ffffff" };
const CENTER_BG_STYLE: React.CSSProperties = { background: "linear-gradient(135deg, #ffffff, #fafbfc)" };
const CARD_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #ffffff, #fafbfc)",
  boxShadow: "0 4px 6px -1px rgba(30, 41, 59, 0.1), 0 2px 4px -1px rgba(30, 41, 59, 0.06)",
  border: "1px solid #e2e8f0"
};
const BADGE_STYLE: React.CSSProperties = { background: "linear-gradient(135deg, #1e293b, #242933)", color: "#ffffff" };
const SELECTED_GRADIENT = "linear-gradient(135deg, #1e293b, #242933)";
const UNSELECTED_GRADIENT = "linear-gradient(135deg, #ffffff, #fafbfc)";
const QUESTION_CARD_STYLE: React.CSSProperties = {
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 6px -1px rgba(30, 41, 59, 0.1), 0 2px 4px -1px rgba(30, 41, 59, 0.06)",
  border: "1px solid #e2e8f0"
};

type QuestionCardProps = {
  question: Question; idx: number;
  control: ReturnType<typeof useForm>['control'];
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, idx, control }) => {
  return (
    <div key={question._id} className="w-full p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl" style={QUESTION_CARD_STYLE}>
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm sm:text-base lg:text-lg font-bold"
             style={{ background: "linear-gradient(135deg, #1e293b, #242933)", color: "#ffffff" }}>
          {idx + 1}
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold leading-tight flex-1 lg:text-center reserve-h2"
            style={{ color: "#2a2524" }}>
          {question.title}
        </h2>
      </div>

      <div className="w-full space-y-2 sm:space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        <Controller
          control={control}
          name={question._id}
          defaultValue={""}
          render={({ field }) => {
            // field.value, field.onChange
            return (
              <>
                {Object.entries(question.options).filter(([key]) => key !== "_id").map(([key, value]) => {
                  const selected = field.value === key;
                  const inputId = `${question._id}_${key}`;
                  return (
                    <label
                      key={key}
                      htmlFor={inputId}
                      className="w-full flex items-center p-3 sm:p-4 lg:p-5 rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                      style={{
                        background: selected ? SELECTED_GRADIENT : UNSELECTED_GRADIENT,
                        border: `2px solid ${selected ? "#1e293b" : "#e2e8f0"}`,
                        boxShadow: selected ? "0 10px 15px -3px rgba(30,41,59,0.2), 0 4px 6px -2px rgba(30,41,59,0.1)" : "0 4px 6px -1px rgba(30,41,59,0.1), 0 2px 4px -1px rgba(30,41,59,0.06)"
                      }}
                      onClick={(e) => {
                        // ensure click sets value (useful for nested clickable children)
                        e.preventDefault();
                        field.onChange(key);
                      }}
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0"
                           style={{ borderColor: selected ? "#ffffff" : "#1e293b", backgroundColor: selected ? "#ffffff" : "transparent" }}>
                        {selected && <div className="w-2 h-2 rounded-full" style={{ background: SELECTED_GRADIENT }} />}
                      </div>

                      {/* make input accessible but not display:none to avoid label click issues */}
                      <input
                        id={inputId}
                        type="radio"
                        value={key}
                        checked={selected}
                        onChange={() => field.onChange(key)}
                        className="sr-only"
                        aria-hidden
                      />

                      <div className="flex-1 text-left">
                        <span className="font-bold mr-2 sm:mr-3 text-sm sm:text-base" style={{ color: selected ? "#ffffff" : "#2a2524" }}>{key}.</span>
                        <span className="text-sm sm:text-base lg:text-lg leading-relaxed" style={{ color: selected ? "#ffffff" : "#2a2524" }}>{value}</span>
                      </div>
                    </label>
                  );
                })}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

const ResponsiveQuiz: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(5);

  const { control, handleSubmit, reset } = useForm<Record<string, string>>({ defaultValues: {} });
  const router = useRouter();

  useEffect(() => {
    const cachedHeader = (typeof window !== "undefined") ? sessionStorage.getItem("quiz_header_cache") : null;
    if (cachedHeader) {
      try {
        const parsed = JSON.parse(cachedHeader);
        setQuizData((prev) => prev ?? {
          _id: parsed._id || "",
          code: parsed.code || "",
          title: parsed.title || "",
          description: parsed.description || "",
          status: parsed.status || "published",
          questions_number: parsed.questions_number || 0,
          questions: parsed.questions || [],
          duration: parsed.duration || 0,
          score_per_question: parsed.score_per_question || 1
        } as QuizData);
      } catch (e) { /* ignore */ }
    }

    const storedQuizID = localStorage.getItem("DataQuiz");
    const tokenn = localStorage.getItem("token");
    let controller: AbortController | null = null;

    const Get_Questions_Without_Results = async () => {
      try {
        setLoading(true);
        if (!storedQuizID || !tokenn) {
          setQuizData(null);
          setLoading(false);
          return;
        }

        controller = new AbortController();
        const response = await axios.get(
          `https://upskilling-egypt.com:3005/api/quiz/without-answers/${storedQuizID}`,
          { headers: { Authorization: `Bearer ${tokenn}` }, signal: controller.signal }
        );

        if (response?.data?.data) {
          setQuizData(response.data.data as QuizData);

          try {
            const headerCache = {
              _id: response.data.data._id,
              title: response.data.data.title,
              description: response.data.data.description,
              questions_number: response.data.data.questions_number,
              duration: response.data.data.duration,
              score_per_question: response.data.data.score_per_question,
              code: response.data.data.code,
            };
            sessionStorage.setItem("quiz_header_cache", JSON.stringify(headerCache));
          } catch (e) { /* ignore */ }

          const defaults: Record<string, string> = {};
          (response.data.data.questions || []).forEach((q: Question) => { defaults[q._id] = ""; });
          reset(defaults);

          const total = (response.data.data.questions || []).length;
          if (total <= 5) setVisibleCount(total);
        } else {
          setQuizData(null);
        }
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching quiz:", error?.response?.data?.message || error.message || error);
          setQuizData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    Get_Questions_Without_Results();

    const idle = (cb: () => void, timeout = 100) => {
      if (typeof (window as any).requestIdleCallback === "function") {
        (window as any).requestIdleCallback(cb, { timeout });
      } else {
        setTimeout(cb, 300);
      }
    };

    idle(() => {
      setVisibleCount(9999);
    }, 200);

    return () => {
      if (controller) controller.abort();
    };
  }, [reset]);

  const totalPossibleScore = useMemo(() => {
    if (!quizData) return 0;
    const qn = Number(quizData.questions_number || 0);
    const sp = Number(quizData.score_per_question || 0);
    return qn * sp;
  }, [quizData]);

  const onSubmit = useCallback(async (data: Record<string, string>) => {
    const storedQuizID = localStorage.getItem("DataQuiz");
    const tokenn = localStorage.getItem("token");
    try {
      const formattedData = { answers: Object.entries(data).map(([questionId, answer]) => ({ question: questionId, answer })) };
      const response = await axios.post(
        `https://upskilling-egypt.com:3005/api/quiz/submit/${storedQuizID}`,
        formattedData,
        { headers: { Authorization: `Bearer ${tokenn}` } }
      );
      setScore(response?.data?.data?.score ?? null);
      setShowModal(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || String(error));
    }
  }, []);

  const closeModal = useCallback(() => { setShowModal(false); router.push('/learner/quizzes'); }, [router]);

  if (loading && !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={CENTER_BG_STYLE}>
        <div className="text-lg font-medium" style={{ color: "#2a2524" }}>Loading...</div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={PAGE_STYLE}>
        <div className="text-lg font-medium" style={{ color: "#2a2524" }}>No quiz data found</div>
      </div>
    );
  }

  const questionsToRender = (quizData.questions || []).slice(0, Math.min(visibleCount, (quizData.questions || []).length));

  return (
    <div className="min-h-screen" style={PAGE_STYLE}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full mb-6 sm:mb-8">
          <div className="w-full p-6 sm:p-8 lg:p-10 text-center rounded-lg sm:rounded-xl" style={CARD_STYLE}>
            <div className="inline-block px-4 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wide" style={BADGE_STYLE}>Quiz Assessment</div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight reserve-h1" style={{ color: "#2a2524" }}>
              {quizData.title || " "}
            </h1>

            <p className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto reserve-desc" style={{ color: "#6b7280" }}>
              {quizData.description || " "}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border w-full sm:w-auto justify-center" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <FiClock className="text-lg sm:text-xl" style={{ color: "#2a2524" }} />
                <span className="font-semibold text-sm sm:text-base" style={{ color: "#2a2524" }}>{quizData.duration} minutes</span>
              </div>

              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border w-full sm:w-auto justify-center" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <FaTrophy className="text-lg sm:text-xl" style={{ color: "#2a2524" }} />
                <span className="font-semibold text-sm sm:text-base" style={{ color: "#2a2524" }}>{quizData.score_per_question} points each</span>
              </div>

              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border w-full sm:w-auto justify-center" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
                <AiOutlineFileText className="text-lg sm:text-xl" style={{ color: "#2a2524" }} />
                <span className="font-semibold text-sm sm:text-base" style={{ color: "#2a2524" }}>{quizData.questions_number} questions</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {questionsToRender.map((question, idx) => (
              <QuestionCard key={question._id} question={question} idx={idx} control={control} />
            ))}

            {(quizData.questions || []).length > questionsToRender.length && (
              <div className="text-center py-4" style={{ color: "#6b7280" }}>Loading remaining questions…</div>
            )}
          </div>

          <div className="w-full text-center mb-6 sm:mb-8">
            <button type="submit" className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-none"
                    style={{ background: "linear-gradient(135deg, #1e293b, #242933)", color: "#ffffff", boxShadow: "0 10px 15px -3px rgba(30,41,59,0.2), 0 4px 6px -2px rgba(30,41,59,0.1)" }}>
              Submit <FaRocket className="inline-block ml-2 -translate-y-[1px]" />
            </button>
          </div>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease-out" }}>
            <div className="w-full max-w-md p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center transform scale-100 transition-all duration-300" style={{ backgroundColor: "#ffffff", boxShadow: "0 10px 15px -3px rgba(30,41,59,0.1), 0 4px 6px -2px rgba(30,41,59,0.05)", border: "1px solid #e2e8f0" }} onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 sm:mb-6" style={{ background: "linear-gradient(135deg, #1e293b, #242933)", color: "#ffffff" }}>
                <AiOutlineCheckCircle />
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: "#2a2524" }}>Quiz Submitted Successfully!</h2>

              <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
                You scored <span className="font-semibold text-black">{score ?? "—"}</span> out of <span className="font-semibold text-black">{totalPossibleScore}</span>. Well done 👏
              </p>

              <button onClick={closeModal} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 border-none" style={{ background: "linear-gradient(135deg, #1e293b, #242933)", color: "#ffffff" }}>
                Continue <GiPartyPopper className="inline-block ml-2 -translate-y-[1px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.9);} to { opacity:1; transform:scale(1);} }
        @media (max-width: 640px) { .min-h-screen { padding:0 !important; } }

        .reserve-h1 { min-height: 3.2rem; }
        .reserve-h2 { min-height: 2.2rem; }
        .reserve-desc { min-height: 3.2rem; }

        @media (min-width: 768px) {
          .reserve-h1 { min-height: 4.2rem; }
          .reserve-desc { min-height: 4.8rem; }
          .reserve-h2 { min-height: 2.8rem; }
        }

        @media (hover: hover) {
          label:hover { transform: translateY(-2px); }
          button:hover { filter: brightness(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveQuiz;
