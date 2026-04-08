import Common "../types/common";
import WithdrawalTypes "../types/withdrawal";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  // Minimum coins required to withdraw
  public let MIN_WITHDRAWAL_COINS : Nat = 100;

  // Convert coins to INR (100 coins = 10 INR)
  public func coinsToINR(coins : Common.Coins) : Common.INR {
    coins * 10 / 100;
  };

  // Convert internal request to shared public type
  public func toPublic(req : WithdrawalTypes.WithdrawalRequest) : WithdrawalTypes.WithdrawalRequestPublic {
    {
      id = req.id;
      sessionId = req.sessionId;
      bankAccountNumber = req.bankAccountNumber;
      ifscCode = req.ifscCode;
      accountHolderName = req.accountHolderName;
      coinsRequested = req.coinsRequested;
      inrAmount = req.inrAmount;
      status = req.status;
      createdAt = req.createdAt;
    };
  };

  // Submit a withdrawal request; validates balance and minimum coins
  public func submitWithdrawal(
    withdrawalRequests : List.List<WithdrawalTypes.WithdrawalRequest>,
    coinBalances : Map.Map<Common.SessionId, Common.Coins>,
    nextId : Nat,
    sessionId : Common.SessionId,
    input : WithdrawalTypes.WithdrawalInput,
    now : Common.Timestamp
  ) : WithdrawalTypes.WithdrawalResult {
    // Validate minimum withdrawal
    if (input.coinsRequested < MIN_WITHDRAWAL_COINS) {
      return #err("Minimum " # MIN_WITHDRAWAL_COINS.toText() # " coins required to withdraw");
    };

    // Check user balance
    let balance = switch (coinBalances.get(sessionId)) {
      case (?b) { b };
      case null { 0 };
    };

    if (balance < input.coinsRequested) {
      return #err("Insufficient coins. You have " # balance.toText() # " coins.");
    };

    // Validate inputs
    if (input.bankAccountNumber == "") {
      return #err("Bank account number is required");
    };
    if (input.ifscCode == "") {
      return #err("IFSC code is required");
    };
    if (input.accountHolderName == "") {
      return #err("Account holder name is required");
    };

    // Deduct coins
    coinBalances.add(sessionId, Nat.sub(balance, input.coinsRequested));

    // Create request
    let req : WithdrawalTypes.WithdrawalRequest = {
      id = nextId;
      sessionId;
      bankAccountNumber = input.bankAccountNumber;
      ifscCode = input.ifscCode;
      accountHolderName = input.accountHolderName;
      coinsRequested = input.coinsRequested;
      inrAmount = coinsToINR(input.coinsRequested);
      var status = #pending;
      createdAt = now;
    };

    withdrawalRequests.add(req);
    #ok(toPublic(req));
  };

  // Get withdrawal history for a session (returns shared public type)
  public func getWithdrawals(
    withdrawalRequests : List.List<WithdrawalTypes.WithdrawalRequest>,
    sessionId : Common.SessionId
  ) : [WithdrawalTypes.WithdrawalRequestPublic] {
    withdrawalRequests
      .filter(func(r : WithdrawalTypes.WithdrawalRequest) : Bool { r.sessionId == sessionId })
      .map<WithdrawalTypes.WithdrawalRequest, WithdrawalTypes.WithdrawalRequestPublic>(toPublic)
      .toArray();
  };
};
