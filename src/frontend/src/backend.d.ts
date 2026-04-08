import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardStats {
    totalEarned: Coins;
    recentHistory: Array<EarningEvent>;
    checkinStreak: bigint;
    spinCount: bigint;
    totalBalance: Coins;
    quizCount: bigint;
}
export type Coins = bigint;
export type Timestamp = bigint;
export interface WithdrawalRequestPublic {
    id: bigint;
    bankAccountNumber: string;
    status: WithdrawalStatus;
    ifscCode: string;
    createdAt: Timestamp;
    accountHolderName: string;
    inrAmount: INR;
    sessionId: SessionId;
    coinsRequested: Coins;
}
export interface QuizQuestion {
    id: bigint;
    question: string;
    correctIndex: bigint;
    coinsReward: Coins;
    options: Array<string>;
}
export interface EarningEvent {
    source: EarningSource;
    timestamp: Timestamp;
    amount: Coins;
}
export type WithdrawalResult = {
    __kind__: "ok";
    ok: WithdrawalRequestPublic;
} | {
    __kind__: "err";
    err: string;
};
export interface WithdrawalInput {
    bankAccountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    coinsRequested: Coins;
}
export type SessionId = string;
export type INR = bigint;
export enum EarningSource {
    checkin = "checkin",
    quiz = "quiz",
    spin = "spin"
}
export enum WithdrawalStatus {
    pending = "pending",
    rejected = "rejected",
    processed = "processed"
}
export interface backendInterface {
    doCheckin(sessionId: SessionId): Promise<Coins | null>;
    doSpin(sessionId: SessionId): Promise<Coins | null>;
    getCheckinStreak(sessionId: SessionId): Promise<bigint>;
    getCoinBalance(sessionId: SessionId): Promise<Coins>;
    getDashboard(sessionId: SessionId): Promise<DashboardStats>;
    getSpinInfo(sessionId: SessionId): Promise<{
        max: bigint;
        used: bigint;
    }>;
    getTodayQuiz(sessionId: SessionId): Promise<Array<QuizQuestion>>;
    getWithdrawalHistory(sessionId: SessionId): Promise<Array<WithdrawalRequestPublic>>;
    requestWithdrawal(sessionId: SessionId, input: WithdrawalInput): Promise<WithdrawalResult>;
    submitQuizAnswer(sessionId: SessionId, questionId: bigint, selectedIndex: bigint): Promise<Coins | null>;
}
