import Common "types/common";
import SpinTypes "types/spin";
import QuizTypes "types/quiz";
import CheckinTypes "types/checkin";
import WithdrawalTypes "types/withdrawal";
import SpinApi "mixins/spin-api";
import QuizApi "mixins/quiz-api";
import CheckinApi "mixins/checkin-api";
import WithdrawalApi "mixins/withdrawal-api";
import DashboardApi "mixins/dashboard-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  // ── Shared state ──────────────────────────────────────────────
  let coinBalances = Map.empty<Common.SessionId, Common.Coins>();
  let earningHistory = List.empty<Common.EarningEvent>();

  // ── Spin state ────────────────────────────────────────────────
  let spinStates = Map.empty<Common.SessionId, SpinTypes.UserSpinState>();

  // ── Quiz state ────────────────────────────────────────────────
  let allQuestions : List.List<QuizTypes.QuizQuestion> = List.fromArray<QuizTypes.QuizQuestion>([
    { id = 0;  question = "100 coins = kitne INR? / 100 coins = how many INR?"; options = ["5", "10", "20", "50"]; correctIndex = 1; coinsReward = 20 },
    { id = 1;  question = "India ki currency kya hai? / What is India's currency?"; options = ["Dollar", "Pound", "Rupee", "Euro"]; correctIndex = 2; coinsReward = 10 },
    { id = 2;  question = "Bank mein paisa rakhne ko kya kehte hain? / What is it called to keep money in a bank?"; options = ["Lending", "Deposit", "Investment", "Withdrawal"]; correctIndex = 1; coinsReward = 15 },
    { id = 3;  question = "EMI ka full form kya hai? / What is the full form of EMI?"; options = ["Easy Money Income", "Equated Monthly Installment", "Extra Monthly Interest", "Equal Money Income"]; correctIndex = 1; coinsReward = 25 },
    { id = 4;  question = "ATM ka full form? / Full form of ATM?"; options = ["Any Time Money", "Automated Teller Machine", "Automatic Transfer Mode", "Auto Teller Module"]; correctIndex = 1; coinsReward = 10 },
    { id = 5;  question = "Fixed Deposit (FD) kya hota hai? / What is a Fixed Deposit?"; options = ["Roz paisa deposit karna", "Ek nishchit samay ke liye paisa bank mein rakhna", "Share kharidna", "Loan lena"]; correctIndex = 1; coinsReward = 20 },
    { id = 6;  question = "UPI ka full form kya hai? / What is the full form of UPI?"; options = ["Unified Payment Interface", "Universal Payment Index", "United Pay India", "Unique Payment ID"]; correctIndex = 0; coinsReward = 15 },
    { id = 7;  question = "Gold investment kya hoti hai? / What is gold investment?"; options = ["Sone mein paisa lagana", "Ghar kharidna", "Stock market", "Bank mein paisa rakhna"]; correctIndex = 0; coinsReward = 10 },
    { id = 8;  question = "Mutual Fund kya hai? / What is a Mutual Fund?"; options = ["Bank loan", "Anek logon ke paison ka ek saath nivesh", "Govt scheme", "Insurance"]; correctIndex = 1; coinsReward = 25 },
    { id = 9;  question = "IFSC code kis kaam aata hai? / What is IFSC code used for?"; options = ["Internet banking password", "Bank branch identify karne ke liye", "ATM PIN", "PAN card number"]; correctIndex = 1; coinsReward = 20 },
    { id = 10; question = "India mein GST kitne prakar ka hai? / How many types of GST are there in India?"; options = ["2", "3", "4", "5"]; correctIndex = 2; coinsReward = 25 },
    { id = 11; question = "Share market mein 'Bull' kya darshata hai? / In stock market what does 'Bull' indicate?"; options = ["Market girna", "Market badhna", "Market band rehna", "Market stagnant rehna"]; correctIndex = 1; coinsReward = 20 },
    { id = 12; question = "NEFT ka full form? / Full form of NEFT?"; options = ["National Electronic Funds Transfer", "New Electronic Financial Transfer", "National Easy Fund Transfer", "Net Electronic Fund Transfer"]; correctIndex = 0; coinsReward = 15 },
    { id = 13; question = "Credit card aur Debit card mein kya fark hai? / Difference between Credit and Debit card?"; options = ["Koi fark nahi", "Credit card mein bank ka paisa, debit card mein apna", "Debit card mein bank ka paisa, credit card mein apna", "Dono same"]; correctIndex = 1; coinsReward = 20 },
    { id = 14; question = "Inflation (Mehangai) ka matlab kya hai? / What does Inflation mean?"; options = ["Cheezon ki kimat kam hona", "Cheezon ki kimat badhna", "Paisa badhna", "Tax kam hona"]; correctIndex = 1; coinsReward = 25 },
    { id = 15; question = "PPF ka full form? / Full form of PPF?"; options = ["Public Provident Fund", "Private Pension Fund", "Personal Profit Fund", "Public Pension Fund"]; correctIndex = 0; coinsReward = 20 },
    { id = 16; question = "KYC ka full form? / Full form of KYC?"; options = ["Know Your Customer", "Keep Your Credit", "Know Your Cash", "Keep Your Card"]; correctIndex = 0; coinsReward = 10 },
    { id = 17; question = "PAN card ka full form? / Full form of PAN card?"; options = ["Permanent Account Number", "Personal Account Note", "Public Account Number", "Primary Account Name"]; correctIndex = 0; coinsReward = 10 },
    { id = 18; question = "RBI ka full form? / Full form of RBI?"; options = ["Reserve Bank of India", "Royal Bank of India", "Regional Bank of India", "Rural Bank of India"]; correctIndex = 0; coinsReward = 15 },
    { id = 19; question = "Savings account mein minimum balance kitna rehna chahiye? / Typical minimum balance for a savings account?"; options = ["Rs 0-500", "Rs 500-10,000", "Rs 50,000+", "No minimum"]; correctIndex = 1; coinsReward = 15 },
    { id = 20; question = "Loan ki interest rate kise kehte hain? / What is the interest rate on a loan called?"; options = ["Profit rate", "Annual Percentage Rate (APR)", "EMI rate", "Bank rate"]; correctIndex = 1; coinsReward = 20 },
    { id = 21; question = "Paisa bachaane ki aadat kyun zaroori hai? / Why is saving money important?"; options = ["Zaroorat nahi", "Emergency aur future goals ke liye", "Sirf entertainment ke liye", "Tax bachane ke liye"]; correctIndex = 1; coinsReward = 15 },
    { id = 22; question = "Sensex kya hai? / What is Sensex?"; options = ["India ka foreign exchange", "Bombay Stock Exchange ka index", "NSE ka index", "RBI ka report"]; correctIndex = 1; coinsReward = 25 },
    { id = 23; question = "Cheque bounce hone par kya hota hai? / What happens when a cheque bounces?"; options = ["Kuch nahi", "Legal action aur penalty lag sakti hai", "Free reissue milta hai", "Bank maafi maang leta hai"]; correctIndex = 1; coinsReward = 20 },
    { id = 24; question = "Online fraud se bachne ke liye kya karein? / How to protect yourself from online fraud?"; options = ["OTP share karo", "OTP kisi ke saath share mat karo", "Bank password email karo", "ATM PIN likho"]; correctIndex = 1; coinsReward = 30 },
  ]);
  let quizStates = Map.empty<Common.SessionId, QuizTypes.UserQuizState>();

  // ── Check-in state ────────────────────────────────────────────
  let checkinStates = Map.empty<Common.SessionId, CheckinTypes.UserCheckinState>();

  // ── Withdrawal state ──────────────────────────────────────────
  let withdrawalRequests = List.empty<WithdrawalTypes.WithdrawalRequest>();

  // ── Mixin composition ─────────────────────────────────────────
  include SpinApi(spinStates, coinBalances, earningHistory);
  include QuizApi(quizStates, allQuestions, coinBalances, earningHistory);
  include CheckinApi(checkinStates, coinBalances, earningHistory);
  include WithdrawalApi(withdrawalRequests, coinBalances);
  include DashboardApi(coinBalances, earningHistory, spinStates, quizStates, checkinStates);
};
