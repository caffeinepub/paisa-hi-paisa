import Common "common";

module {
  // Per-user daily check-in state
  public type UserCheckinState = {
    sessionId : Common.SessionId;
    var currentStreak : Nat;
    var lastCheckinDate : Common.DateKey;
    var totalCheckins : Nat;
  };
};
