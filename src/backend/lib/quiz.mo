import Common "../types/common";
import QuizTypes "../types/quiz";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";
import Char "mo:core/Char";

module {
  let QUESTIONS_PER_DAY : Nat = 5;

  // Return today's questions seeded by date string hash
  public func getTodayQuestions(
    allQuestions : List.List<QuizTypes.QuizQuestion>,
    today : Common.DateKey
  ) : [QuizTypes.QuizQuestion] {
    let total = allQuestions.size();
    if (total == 0) { return [] };

    // Compute a simple hash of the date string as seed
    var seed : Nat = 0;
    for (c in today.toIter()) {
      seed := (seed * 31 + c.toNat32().toNat()) % 1_000_000_007;
    };

    let count = if (total < QUESTIONS_PER_DAY) { total } else { QUESTIONS_PER_DAY };
    let arr = allQuestions.toArray();

    // Pick `count` distinct indices via LCG
    var picked : [QuizTypes.QuizQuestion] = [];
    var usedIndices : [Nat] = [];
    var attempts = 0;
    var s = seed;
    while (picked.size() < count and attempts < total * 3) {
      let idx = s % total;
      s := (s * 1664525 + 1013904223) % 1_000_000_007;
      attempts += 1;
      if (usedIndices.find(func(u : Nat) : Bool { u == idx }) == null) {
        usedIndices := usedIndices.concat([idx]);
        picked := picked.concat([arr[idx]]);
      };
    };
    picked;
  };

  // Get or create quiz state for a session
  public func getOrCreate(
    quizStates : Map.Map<Common.SessionId, QuizTypes.UserQuizState>,
    sessionId : Common.SessionId
  ) : QuizTypes.UserQuizState {
    switch (quizStates.get(sessionId)) {
      case (?state) { state };
      case null {
        let newState : QuizTypes.UserQuizState = {
          sessionId;
          var answeredToday = [];
          var lastQuizDate = "";
          var totalAnswered = 0;
        };
        quizStates.add(sessionId, newState);
        newState;
      };
    };
  };

  // Submit an answer; returns coins earned or null if already answered / wrong
  public func submitAnswer(
    quizStates : Map.Map<Common.SessionId, QuizTypes.UserQuizState>,
    allQuestions : List.List<QuizTypes.QuizQuestion>,
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    earningHistory : List.List<Common.EarningEvent>,
    sessionId : Common.SessionId,
    questionId : Nat,
    selectedIndex : Nat,
    today : Common.DateKey,
    now : Common.Timestamp
  ) : ?Common.Coins {
    let state = getOrCreate(quizStates, sessionId);

    // Reset answered list if new day
    if (state.lastQuizDate != today) {
      state.answeredToday := [];
      state.lastQuizDate := today;
    };

    // Check if already answered this question today
    if (state.answeredToday.find(func(id : Nat) : Bool { id == questionId }) != null) {
      return null;
    };

    // Find the question
    let question = switch (allQuestions.find(func(q : QuizTypes.QuizQuestion) : Bool { q.id == questionId })) {
      case (?q) { q };
      case null { return null };
    };

    // Check correctness
    if (question.correctIndex != selectedIndex) {
      return null;
    };

    // Mark as answered
    state.answeredToday := state.answeredToday.concat([questionId]);
    state.totalAnswered += 1;

    // Award coins
    let coins = question.coinsReward;
    let currentBalance = switch (coinBalances.get(sessionId)) {
      case (?b) { b };
      case null { 0 };
    };
    coinBalances.add(sessionId, currentBalance + coins);

    earningHistory.add({
      source = #quiz;
      amount = coins;
      timestamp = now;
    });

    ?coins;
  };
};
