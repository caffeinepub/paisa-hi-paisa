import Common "../types/common";
import SpinLib "../lib/spin";
import SpinTypes "../types/spin";
import DateUtil "../lib/dateutil";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";

mixin (
  spinStates : Map.Map<Common.SessionId, SpinTypes.UserSpinState>,
  coinBalances : Map.Map<Common.SessionId, Common.Coins>,
  earningHistory : List.List<Common.EarningEvent>
) {
  // Get how many spins user has done today and the daily max
  public query func getSpinInfo(sessionId : Common.SessionId) : async { used : Nat; max : Nat } {
    let now = Time.now();
    let today = DateUtil.toDateKey(now);
    SpinLib.getDailySpinInfo(spinStates, sessionId, today);
  };

  // Perform a spin; returns coins earned or null if daily limit exceeded
  public func doSpin(sessionId : Common.SessionId) : async ?Common.Coins {
    let now = Time.now();
    let today = DateUtil.toDateKey(now);
    // Derive seed from time + sessionId character hash
    let sessionHash = sessionId.foldLeft(0 : Nat, func(acc : Nat, c : Char) : Nat {
      (acc * 31 + c.toNat32().toNat()) % 1_000_000_007
    });
    let seed = Int.abs(now) + sessionHash;
    SpinLib.spin(spinStates, coinBalances, earningHistory, sessionId, today, now, seed);
  };
};
