import Common "../types/common";
import DashboardLib "../lib/dashboard";
import SpinTypes "../types/spin";
import QuizTypes "../types/quiz";
import CheckinTypes "../types/checkin";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  coinBalances : Map.Map<Common.SessionId, Common.Coins>,
  earningHistory : List.List<Common.EarningEvent>,
  spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
  quizStates : Map.Map<Common.SessionId, QuizTypes.UserQuizState>,
  checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>
) {
  // Get full dashboard stats for a session
  public query func getDashboard(sessionId : Common.SessionId) : async Common.DashboardStats {
    DashboardLib.getDashboard(coinBalances, earningHistory, spinStates, quizStates, checkinStates, sessionId);
  };

  // Get raw coin balance for a session
  public query func getCoinBalance(sessionId : Common.SessionId) : async Common.Coins {
    DashboardLib.getBalance(coinBalances, sessionId);
  };
};
