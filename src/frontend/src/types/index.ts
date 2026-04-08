export type SessionId = string;

export type EarningSource = "spin" | "quiz" | "checkin";

export interface EarningEvent {
  id: string;
  source: EarningSource;
  coins: number;
  timestamp: number;
  label: string;
}

export interface DashboardStats {
  totalCoins: number;
  totalEarned: number;
  totalWithdrawn: number;
  recentEvents: EarningEvent[];
}

export interface SpinInfo {
  spinsUsed: number;
  spinsTotal: number;
  spinsRemaining: number;
  lastSpinReset: number;
}

export interface SpinResult {
  coins: number;
  newBalance: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  reward: number;
}

export interface QuizAnswerResult {
  correct: boolean;
  coinsEarned: number;
  correctIndex: number;
  newBalance: number;
}

export interface CheckinState {
  streak: number;
  checkedInToday: boolean;
  nextReward: number;
  weekDays: boolean[];
}

export interface WithdrawalRequest {
  id: string;
  sessionId: SessionId;
  coins: number;
  amountInr: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  holderName: string;
  status: "pending" | "processing" | "completed" | "rejected";
  createdAt: number;
}

export interface WithdrawalForm {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  holderName: string;
  coins: number;
}
