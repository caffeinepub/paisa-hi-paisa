module {
  // Session-based user identity (UUID string from browser localStorage)
  public type SessionId = Text;

  // Unix timestamp in nanoseconds (from Time.now())
  public type Timestamp = Int;

  // Date key in format "YYYY-MM-DD" for daily tracking
  public type DateKey = Text;

  // Coin amount
  public type Coins = Nat;

  // INR amount in paise (1 INR = 100 paise) or as float string
  public type INR = Nat;

  // Earning source tag
  public type EarningSource = {
    #spin;
    #quiz;
    #checkin;
  };

  // A single earning event recorded in history
  public type EarningEvent = {
    source : EarningSource;
    amount : Coins;
    timestamp : Timestamp;
  };

  // Coin dashboard summary returned to frontend
  public type DashboardStats = {
    totalBalance : Coins;
    totalEarned : Coins;
    spinCount : Nat;
    quizCount : Nat;
    checkinStreak : Nat;
    recentHistory : [EarningEvent];
  };
};
