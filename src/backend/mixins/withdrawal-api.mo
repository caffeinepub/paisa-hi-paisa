import Common "../types/common";
import WithdrawalLib "../lib/withdrawal";
import WithdrawalTypes "../types/withdrawal";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  withdrawalRequests : List.List<WithdrawalTypes.WithdrawalRequest>,
  coinBalances : Map.Map<Common.SessionId, Common.Coins>
) {
  // Submit a withdrawal request; deducts coins on success
  public func requestWithdrawal(sessionId : Common.SessionId, input : WithdrawalTypes.WithdrawalInput) : async WithdrawalTypes.WithdrawalResult {
    let now = Time.now();
    // Use current list size as the next unique ID
    let nextId = withdrawalRequests.size();
    WithdrawalLib.submitWithdrawal(withdrawalRequests, coinBalances, nextId, sessionId, input, now);
  };

  // Get all withdrawal requests for a session
  public query func getWithdrawalHistory(sessionId : Common.SessionId) : async [WithdrawalTypes.WithdrawalRequestPublic] {
    WithdrawalLib.getWithdrawals(withdrawalRequests, sessionId);
  };
};
