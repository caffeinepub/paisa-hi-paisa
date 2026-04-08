import Common "common";

module {
  // A single quiz question
  public type QuizQuestion = {
    id : Nat;
    question : Text;
    options : [Text];
    correctIndex : Nat;
    coinsReward : Common.Coins;
  };

  // Per-user quiz state tracked per day
  public type UserQuizState = {
    sessionId : Common.SessionId;
    var answeredToday : [Nat]; // question IDs answered today
    var lastQuizDate : Common.DateKey;
    var totalAnswered : Nat;
  };
};
