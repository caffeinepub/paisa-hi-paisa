import Common "../types/common";
import CheckinLib "../lib/checkin";
import CheckinTypes "../types/checkin";
import DateUtil "../lib/dateutil";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  checkinStates : Map.Map<Common.SessionId, CheckinTypes.UserCheckinState>,
  coinBalances : Map.Map<Common.SessionId, Common.Coins>,
  earningHistory : List.List<Common.EarningEvent>
) {
  // Perform today's check-in; returns coins earned or null if already done today
  public func doCheckin(sessionId : Common.SessionId) : async ?Common.Coins {
    let now = Time.now();
    let today = DateUtil.toDateKey(now);
    CheckinLib.checkin(checkinStates, coinBalances, earningHistory, sessionId, today, now);
  };

  // Get current streak for a session
  public query func getCheckinStreak(sessionId : Common.SessionId) : async Nat {
    CheckinLib.getStreak(checkinStates, sessionId);
  };
};
