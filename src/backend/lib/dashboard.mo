import Common "../types/common";
import SpinTypes "../types/spin";
import QuizTypes "../types/quiz";
import CheckinTypes "../types/checkin";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";

module {
  // Get coin balance for a session
  public func getBalance(
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    sessionId : Common.SessionId
  ) : Common.Coins {
    switch (coinBalances.get(sessionId)) {
      case (?b) { b };
      case null { 0 };
    };
  };

  // Build a full dashboard stats snapshot for a session
  public func getDashboard(
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    earningHistory : List.List<Common.EarningEvent>,
    spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
    quizStates : Map.Map<Common.SessionId, QuizTypes.UserQuizState>,
    checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>,
    sessionId : Common.SessionId
  ) : Common.DashboardStats {
    let totalBalance = getBalance(coinBalances, sessionId);

    // Take last 20 earning events (most recent first)
    let allArr = earningHistory.toArray();
    let histLen = allArr.size();
    let startIdx : Int = histLen - 20;
    let from : Int = if (startIdx < 0) { 0 } else { startIdx };
    let recentArr = allArr.sliceToArray(from, histLen);
    let recentHistory = recentArr.reverse();

    // Sum all earned coins from history
    let totalEarned = earningHistory.foldLeft(0 : Nat, func(acc : Nat, e : Common.EarningEvent) : Nat { acc + e.amount });

    // Spin count for this session
    let spinCount = switch (spinStates.get(sessionId)) {
      case (?s) { s.totalSpins };
      case null { 0 };
    };

    // Quiz answers for this session
    let quizCount = switch (quizStates.get(sessionId)) {
      case (?q) { q.totalAnswered };
      case null { 0 };
    };

    // Check-in streak for this session
    let checkinStreak = switch (checkinStates.get(sessionId)) {
      case (?c) { c.currentStreak };
      case null { 0 };
    };

    {
      totalBalance;
      totalEarned;
      spinCount;
      quizCount;
      checkinStreak;
      recentHistory;
    };
  };
};
