import Common "../types/common";
import QuizLib "../lib/quiz";
import QuizTypes "../types/quiz";
import DateUtil "../lib/dateutil";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  quizStates : Map.Map<Common.SessionId, QuizTypes.UserQuizState>,
  allQuestions : List.List<QuizTypes.QuizQuestion>,
  coinBalances : Map.Map<Common.SessionId, Common.Coins>,
  earningHistory : List.List<Common.EarningEvent>
) {
  // Get today's quiz questions
  public query func getTodayQuiz(sessionId : Common.SessionId) : async [QuizTypes.QuizQuestion] {
    let now = Time.now();
    let today = DateUtil.toDateKey(now);
    QuizLib.getTodayQuestions(allQuestions, today);
  };

  // Submit an answer; returns coins earned or null if wrong / already answered
  public func submitQuizAnswer(sessionId : Common.SessionId, questionId : Nat, selectedIndex : Nat) : async ?Common.Coins {
    let now = Time.now();
    let today = DateUtil.toDateKey(now);
    QuizLib.submitAnswer(quizStates, allQuestions, coinBalances, earningHistory, sessionId, questionId, selectedIndex, today, now);
  };
};
