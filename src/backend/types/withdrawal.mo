import Common "common";

module {
  // Status of a withdrawal request
  public type WithdrawalStatus = {
    #pending;
    #processed;
    #rejected;
  };

  // A withdrawal request submitted by user (internal, mutable status)
  public type WithdrawalRequest = {
    id : Nat;
    sessionId : Common.SessionId;
    bankAccountNumber : Text;
    ifscCode : Text;
    accountHolderName : Text;
    coinsRequested : Common.Coins;
    inrAmount : Common.INR;  // coinsRequested / 100 * 10, in INR
    var status : WithdrawalStatus;
    createdAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type WithdrawalRequestPublic = {
    id : Nat;
    sessionId : Common.SessionId;
    bankAccountNumber : Text;
    ifscCode : Text;
    accountHolderName : Text;
    coinsRequested : Common.Coins;
    inrAmount : Common.INR;
    status : WithdrawalStatus;
    createdAt : Common.Timestamp;
  };

  // Input from user for withdrawal
  public type WithdrawalInput = {
    bankAccountNumber : Text;
    ifscCode : Text;
    accountHolderName : Text;
    coinsRequested : Common.Coins;
  };

  // Result returned to frontend (uses shared public type)
  public type WithdrawalResult = {
    #ok : WithdrawalRequestPublic;
    #err : Text;
  };
};
