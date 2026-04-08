import Common "common";

module {
  // Per-user spin state tracked per day
  public type UserSpinState = {
    sessionId : Common.SessionId;
    var dailySpinCount : Nat;
    var lastSpinDate : Common.DateKey;
    var totalSpins : Nat;
  };
};
