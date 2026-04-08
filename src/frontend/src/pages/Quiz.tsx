import { Button } from "@/components/ui/button";
import { addCoins, useCoinBalanceRefresh } from "@/hooks/useCoinBalance";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const QUIZ_STORAGE_KEY = "paisa_quiz_state";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  reward: number;
}

interface QuizState {
  answeredIds: string[];
  lastReset: number;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "India's currency is called?",
    options: ["Rupee", "Dollar", "Yen", "Euro"],
    correctIndex: 0,
    reward: 25,
  },
  {
    id: "q2",
    question: "Which bank prints Indian currency?",
    options: ["SBI", "HDFC", "RBI", "ICICI"],
    correctIndex: 2,
    reward: 20,
  },
  {
    id: "q3",
    question: "What does ATM stand for?",
    options: [
      "Auto Teller Money",
      "Automated Teller Machine",
      "Automatic Transfer Mode",
      "Account Transfer Machine",
    ],
    correctIndex: 1,
    reward: 15,
  },
  {
    id: "q4",
    question: "Which symbol represents Indian Rupee?",
    options: ["$", "€", "₹", "¥"],
    correctIndex: 2,
    reward: 25,
  },
  {
    id: "q5",
    question: "How many paise make one Rupee?",
    options: ["10", "50", "100", "1000"],
    correctIndex: 2,
    reward: 20,
  },
  {
    id: "q6",
    question: "Which is India's largest bank?",
    options: ["HDFC", "ICICI", "SBI", "Axis"],
    correctIndex: 2,
    reward: 15,
  },
  {
    id: "q7",
    question: "UPI stands for?",
    options: [
      "Unified Payment Interface",
      "Universal Pay India",
      "United Payment Instrument",
      "Unique Payment ID",
    ],
    correctIndex: 0,
    reward: 30,
  },
  {
    id: "q8",
    question: "NEFT transfers are available?",
    options: ["Only weekdays", "24/7 always", "Only weekends", "Only mornings"],
    correctIndex: 1,
    reward: 20,
  },
  {
    id: "q9",
    question: "GST full form?",
    options: [
      "General Sales Tax",
      "Goods and Services Tax",
      "Government Service Tax",
      "Gross State Tax",
    ],
    correctIndex: 1,
    reward: 25,
  },
  {
    id: "q10",
    question: "Digital payment app by Google?",
    options: ["PhonePe", "Paytm", "Google Pay", "BHIM"],
    correctIndex: 2,
    reward: 20,
  },
];

function loadQuizState(): QuizState {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) ?? "{}");
    const now = Date.now();
    if (!stored.lastReset || now - stored.lastReset > 86_400_000) {
      return { answeredIds: [], lastReset: now };
    }
    return stored as QuizState;
  } catch {
    return { answeredIds: [], lastReset: Date.now() };
  }
}

function loadTodayQuestions(answeredIds: string[]): QuizQuestion[] {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % 10;
  const pool: QuizQuestion[] = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    pool.push(QUESTIONS[(dayIndex + i) % QUESTIONS.length]);
  }
  return pool.filter((q) => !answeredIds.includes(q.id)).slice(0, 5);
}

export function QuizPage() {
  const initialState = loadQuizState();
  const [quizState, setQuizState] = useState<QuizState>(initialState);
  const [questions] = useState<QuizQuestion[]>(() =>
    loadTodayQuestions(initialState.answeredIds),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const refreshBalance = useCoinBalanceRefresh();

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  useEffect(() => {
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
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, isFinished, selected, currentQ]);

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null || showResult || !currentQ) return;
    setSelected(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      addCoins(
        currentQ.reward,
        "quiz",
        `Quiz: ${currentQ.question.slice(0, 30)}`,
      );
      refreshBalance();
      setTotalEarned((prev) => prev + currentQ.reward);
    }

    const newState: QuizState = {
      ...quizState,
      answeredIds: [...quizState.answeredIds, currentQ.id],
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="text-6xl">🏆</div>
          <h2 className="font-display font-bold text-2xl text-gold text-center">
            {totalEarned > 0 ? "Quiz Complete!" : "All Done for Today!"}
          </h2>
          {totalEarned > 0 && (
            <div className="bg-gradient-coin border border-primary/30 rounded-2xl px-8 py-4 text-center coin-glow">
              <p className="text-muted-foreground text-sm">You earned</p>
              <p className="font-display font-bold text-4xl text-gold">
                +{totalEarned}
              </p>
              <p className="text-muted-foreground text-sm">coins</p>
            </div>
          )}
          <p className="text-muted-foreground text-sm text-center">
            Come back tomorrow for fresh questions!
          </p>
        </motion.div>
      </div>
    );
  }

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col px-4 py-5 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-gold">
            Daily Quiz
          </h1>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold transition-smooth",
            timeLeft <= 5
              ? "border-destructive/50 text-destructive bg-destructive/10"
              : "border-secondary/30 text-success bg-secondary/10",
          )}
          data-ocid="quiz-timer"
        >
          <Clock size={13} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-gold rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {totalEarned > 0 && (
        <div className="flex items-center justify-center gap-2 py-1">
          <span className="text-sm text-muted-foreground">
            Earned this session:
          </span>
          <span className="font-bold text-gold">+{totalEarned} coins</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-game p-5 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🧠</span>
              <div>
                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">
                  Reward: {currentQ.reward} coins
                </p>
                <h2 className="font-display font-bold text-lg text-foreground leading-snug">
                  {currentQ.question}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((option, idx) => {
              const optKey = `opt-${currentIndex}-${idx}`;
              const isSelected = selected === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={optKey}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border font-body font-medium text-sm transition-smooth flex items-center gap-3",
                    showCorrect
                      ? "bg-secondary/20 border-secondary/50 text-success success-glow"
                      : showWrong
                        ? "bg-destructive/15 border-destructive/40 text-destructive"
                        : isSelected
                          ? "bg-primary/15 border-primary/40 text-gold"
                          : "bg-card border-border hover:border-primary/40 hover:bg-primary/5 text-foreground",
                  )}
                  data-ocid={`quiz-option-${idx}`}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      showCorrect
                        ? "bg-secondary/30 text-success"
                        : showWrong
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {showCorrect ? (
                      <CheckCircle size={16} />
                    ) : showWrong ? (
                      <XCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-3 rounded-2xl text-center",
                selected === currentQ.correctIndex
                  ? "bg-secondary/15 border border-secondary/30"
                  : "bg-destructive/10 border border-destructive/30",
              )}
            >
              {selected === currentQ.correctIndex ? (
                <p className="text-success font-bold">
                  ✅ Correct! +{currentQ.reward} coins earned
                </p>
              ) : (
                <p className="text-destructive font-bold">
                  ❌ {selected === -1 ? "Time's up!" : "Wrong answer!"} —
                  Correct: {currentQ.options[currentQ.correctIndex]}
                </p>
              )}
            </motion.div>
          )}

          {showResult && (
            <Button
              onClick={handleNext}
              className="w-full mt-4 h-12 font-display font-bold bg-gradient-gold text-card rounded-2xl coin-glow hover:scale-105 transition-smooth"
              data-ocid="quiz-next-btn"
            >
              {currentIndex + 1 >= questions.length
                ? "See Results 🏆"
                : "Next Question →"}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
