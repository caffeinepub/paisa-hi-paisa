import Common "../types/common";
import CheckinTypes "../types/checkin";
import DateUtil "dateutil";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  let MIN_COINS : Nat = 5;
  let MAX_COINS : Nat = 15;

  // Get or create check-in state for a session
  public func getOrCreate(
    checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>,
    sessionId : Common.SessionId
  ) : CheckinTypes.UserCheckinState {
    switch (checkinStates.get(sessionId)) {
      case (?state) { state };
      case null {
        let newState : CheckinTypes.UserCheckinState = {
          sessionId;
          var currentStreak = 0;
          var lastCheckinDate = "";
          var totalCheckins = 0;
        };
        checkinStates.add(sessionId, newState);
        newState;
      };
    };
  };

  // Attempt daily check-in; returns coins earned or null if already checked in today
  public func checkin(
    checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>,
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    earningHistory : List.List<Common.EarningEvent>,
    sessionId : Common.SessionId,
    today : Common.DateKey,
    now : Common.Timestamp
  ) : ?Common.Coins {
    let state = getOrCreate(checkinStates, sessionId);

    // Already checked in today
    if (state.lastCheckinDate == today) {
      return null;
    };

    // Update streak
    let yesterday = DateUtil.prevDay(today);
    if (state.lastCheckinDate == yesterday and yesterday != "") {
      state.currentStreak += 1;
    } else {
      // Missed a day or first ever check-in
      state.currentStreak := 1;
    };

    state.lastCheckinDate := today;
    state.totalCheckins += 1;

    // Scale coins with streak: starts at MIN_COINS=5, max MAX_COINS=15
    // streak 1 → 5, streak 10+ → 15
    let range = Nat.sub(MAX_COINS, MIN_COINS); // 10
    let streakCapped = if (state.currentStreak > 10) { 10 } else { state.currentStreak };
    let streakBonus = Nat.sub(streakCapped, 1) * range / 10;
    let coins = MIN_COINS + streakBonus;

    // Update balance
    let currentBalance = switch (coinBalances.get(sessionId)) {
      case (?b) { b };
      case null { 0 };
    };
    coinBalances.add(sessionId, currentBalance + coins);

    earningHistory.add({
      source = #checkin;
      amount = coins;
      timestamp = now;
    });

    ?coins;
  };

  // Get current streak for a session
  public func getStreak(
    checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>,
    sessionId : Common.SessionId
  ) : Nat {
    switch (checkinStates.get(sessionId)) {
      case (?state) { state.currentStreak };
      case null { 0 };
    };
  };
};
