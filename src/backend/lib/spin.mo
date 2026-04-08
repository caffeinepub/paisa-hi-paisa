import Common "../types/common";
import SpinTypes "../types/spin";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  let MAX_DAILY_SPINS : Nat = 70;
  let MIN_COINS : Nat = 50;
  let MAX_COINS : Nat = 100;

  // Get or create spin state for a session
  public func getOrCreate(
    spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
    sessionId : Common.SessionId
  ) : SpinTypes.UserSpinState {
    switch (spinStates.get(sessionId)) {
      case (?state) { state };
      case null {
        let newState : SpinTypes.UserSpinState = {
          sessionId;
          var dailySpinCount = 0;
          var lastSpinDate = "";
          var totalSpins = 0;
        };
        spinStates.add(sessionId, newState);
        newState;
      };
    };
  };

  // Returns current spins used today and max allowed
  public func getDailySpinInfo(
    spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
    sessionId : Common.SessionId,
    today : Common.DateKey
  ) : { used : Nat; max : Nat } {
    let state = getOrCreate(spinStates, sessionId);
    let used = if (state.lastSpinDate == today) { state.dailySpinCount } else { 0 };
    { used; max = MAX_DAILY_SPINS };
  };

  // Attempt a spin; returns coins earned or null if daily limit reached
  public func spin(
    spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    earningHistory : List.List<Common.EarningEvent>,
    sessionId : Common.SessionId,
    today : Common.DateKey,
    now : Common.Timestamp,
    seed : Nat
  ) : ?Common.Coins {
    let state = getOrCreate(spinStates, sessionId);

    // Reset daily count if new day
    if (state.lastSpinDate != today) {
      state.dailySpinCount := 0;
      state.lastSpinDate := today;
    };

    // Check daily limit
    if (state.dailySpinCount >= MAX_DAILY_SPINS) {
      return null;
    };

    // Compute random coins in range [MIN_COINS, MAX_COINS]
    let range = Nat.sub(MAX_COINS, MIN_COINS) + 1;
    let coins = MIN_COINS + (seed % range);

    // Update spin state
    state.dailySpinCount += 1;
    state.totalSpins += 1;

    // Update coin balance
    let currentBalance = switch (coinBalances.get(sessionId)) {
      case (?b) { b };
      case null { 0 };
    };
    coinBalances.add(sessionId, currentBalance + coins);

    // Record earning event
    earningHistory.add({
      source = #spin;
      amount = coins;
      timestamp = now;
    });

    ?coins;
  };
};
