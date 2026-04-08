import { c as createLucideIcon, r as reactExports, a as useCoinBalanceRefresh, j as jsxRuntimeExports, e as cn, b as addCoins } from "./index-Y4LrGIHA.js";
import { B as Button } from "./button-Bb61SGAo.js";
import { m as motion } from "./proxy-Ks2jyQth.js";
import { C as Clock } from "./clock-DpufE5RC.js";
import { A as AnimatePresence } from "./index-oMQZgODR.js";
import { C as CircleCheckBig } from "./circle-check-big-BwXOlOrx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
const QUIZ_STORAGE_KEY = "paisa_quiz_state";
const QUESTIONS = [
  {
    id: "q1",
    question: "India's currency is called?",
    options: ["Rupee", "Dollar", "Yen", "Euro"],
    correctIndex: 0,
    reward: 25
  },
  {
    id: "q2",
    question: "Which bank prints Indian currency?",
    options: ["SBI", "HDFC", "RBI", "ICICI"],
    correctIndex: 2,
    reward: 20
  },
  {
    id: "q3",
    question: "What does ATM stand for?",
    options: [
      "Auto Teller Money",
      "Automated Teller Machine",
      "Automatic Transfer Mode",
      "Account Transfer Machine"
    ],
    correctIndex: 1,
    reward: 15
  },
  {
    id: "q4",
    question: "Which symbol represents Indian Rupee?",
    options: ["$", "€", "₹", "¥"],
    correctIndex: 2,
    reward: 25
  },
  {
    id: "q5",
    question: "How many paise make one Rupee?",
    options: ["10", "50", "100", "1000"],
    correctIndex: 2,
    reward: 20
  },
  {
    id: "q6",
    question: "Which is India's largest bank?",
    options: ["HDFC", "ICICI", "SBI", "Axis"],
    correctIndex: 2,
    reward: 15
  },
  {
    id: "q7",
    question: "UPI stands for?",
    options: [
      "Unified Payment Interface",
      "Universal Pay India",
      "United Payment Instrument",
      "Unique Payment ID"
    ],
    correctIndex: 0,
    reward: 30
  },
  {
    id: "q8",
    question: "NEFT transfers are available?",
    options: ["Only weekdays", "24/7 always", "Only weekends", "Only mornings"],
    correctIndex: 1,
    reward: 20
  },
  {
    id: "q9",
    question: "GST full form?",
    options: [
      "General Sales Tax",
      "Goods and Services Tax",
      "Government Service Tax",
      "Gross State Tax"
    ],
    correctIndex: 1,
    reward: 25
  },
  {
    id: "q10",
    question: "Digital payment app by Google?",
    options: ["PhonePe", "Paytm", "Google Pay", "BHIM"],
    correctIndex: 2,
    reward: 20
  }
];
function loadQuizState() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) ?? "{}");
    const now = Date.now();
    if (!stored.lastReset || now - stored.lastReset > 864e5) {
      return { answeredIds: [], lastReset: now };
    }
    return stored;
  } catch {
    return { answeredIds: [], lastReset: Date.now() };
  }
}
function loadTodayQuestions(answeredIds) {
  const dayIndex = Math.floor(Date.now() / 864e5) % 10;
  const pool = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    pool.push(QUESTIONS[(dayIndex + i) % QUESTIONS.length]);
  }
  return pool.filter((q) => !answeredIds.includes(q.id)).slice(0, 5);
}
function QuizPage() {
  const initialState = loadQuizState();
  const [quizState, setQuizState] = reactExports.useState(initialState);
  const [questions] = reactExports.useState(
    () => loadTodayQuestions(initialState.answeredIds)
  );
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [selected, setSelected] = reactExports.useState(null);
  const [showResult, setShowResult] = reactExports.useState(false);
  const [totalEarned, setTotalEarned] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(20);
  const refreshBalance = useCoinBalanceRefresh();
  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  reactExports.useEffect(() => {
    if (showResult || isFinished || selected !== null || !currentQ) return;
    setTimeLeft(20);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setShowResult(true);
          setSelected(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [showResult, isFinished, selected, currentQ]);
  const handleAnswer = (optionIndex) => {
    if (selected !== null || showResult || !currentQ) return;
    setSelected(optionIndex);
    setShowResult(true);
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      addCoins(
        currentQ.reward,
        "quiz",
        `Quiz: ${currentQ.question.slice(0, 30)}`
      );
      refreshBalance();
      setTotalEarned((prev) => prev + currentQ.reward);
    }
    const newState = {
      ...quizState,
      answeredIds: [...quizState.answeredIds, currentQ.id]
    };
    setQuizState(newState);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(newState));
  };
  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setTimeLeft(20);
    setCurrentIndex((i) => i + 1);
  };
  if (questions.length === 0 || isFinished) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[70vh] px-4 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        className: "flex flex-col items-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "🏆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-gold text-center", children: totalEarned > 0 ? "Quiz Complete!" : "All Done for Today!" }),
          totalEarned > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-coin border border-primary/30 rounded-2xl px-8 py-4 text-center coin-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "You earned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-4xl text-gold", children: [
              "+",
              totalEarned
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "coins" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center", children: "Come back tomorrow for fresh questions!" })
        ]
      }
    ) });
  }
  const progress = currentIndex / questions.length * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col px-4 py-5 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-gold", children: "Daily Quiz" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Question ",
          currentIndex + 1,
          " of ",
          questions.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold transition-smooth",
            timeLeft <= 5 ? "border-destructive/50 text-destructive bg-destructive/10" : "border-secondary/30 text-success bg-secondary/10"
          ),
          "data-ocid": "quiz-timer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              timeLeft,
              "s"
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "h-full bg-gradient-gold rounded-full",
        animate: { width: `${progress}%` },
        transition: { duration: 0.3 }
      }
    ) }),
    totalEarned > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Earned this session:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-gold", children: [
        "+",
        totalEarned,
        " coins"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-game p-5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: "🧠" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-primary mb-1 uppercase tracking-wide", children: [
                "Reward: ",
                currentQ.reward,
                " coins"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground leading-snug", children: currentQ.question })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: currentQ.options.map((option, idx) => {
            const optKey = `opt-${currentIndex}-${idx}`;
            const isSelected = selected === idx;
            const isCorrect = idx === currentQ.correctIndex;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                whileTap: { scale: 0.98 },
                onClick: () => handleAnswer(idx),
                disabled: showResult,
                className: cn(
                  "w-full text-left p-4 rounded-2xl border font-body font-medium text-sm transition-smooth flex items-center gap-3",
                  showCorrect ? "bg-secondary/20 border-secondary/50 text-success success-glow" : showWrong ? "bg-destructive/15 border-destructive/40 text-destructive" : isSelected ? "bg-primary/15 border-primary/40 text-gold" : "bg-card border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
                ),
                "data-ocid": `quiz-option-${idx}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        showCorrect ? "bg-secondary/30 text-success" : showWrong ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                      ),
                      children: showCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }) : showWrong ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }) : String.fromCharCode(65 + idx)
                    }
                  ),
                  option
                ]
              },
              optKey
            );
          }) }),
          showResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: cn(
                "mt-4 p-3 rounded-2xl text-center",
                selected === currentQ.correctIndex ? "bg-secondary/15 border border-secondary/30" : "bg-destructive/10 border border-destructive/30"
              ),
              children: selected === currentQ.correctIndex ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-success font-bold", children: [
                "✅ Correct! +",
                currentQ.reward,
                " coins earned"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-destructive font-bold", children: [
                "❌ ",
                selected === -1 ? "Time's up!" : "Wrong answer!",
                " — Correct: ",
                currentQ.options[currentQ.correctIndex]
              ] })
            }
          ),
          showResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleNext,
              className: "w-full mt-4 h-12 font-display font-bold bg-gradient-gold text-card rounded-2xl coin-glow hover:scale-105 transition-smooth",
              "data-ocid": "quiz-next-btn",
              children: currentIndex + 1 >= questions.length ? "See Results 🏆" : "Next Question →"
            }
          )
        ]
      },
      currentIndex
    ) })
  ] });
}
export {
  QuizPage
};
