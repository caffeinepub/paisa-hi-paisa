import { r as reactExports, a as useCoinBalanceRefresh, j as jsxRuntimeExports, e as cn, b as addCoins, d as ue } from "./index-Y4LrGIHA.js";
import { B as Button } from "./button-Bb61SGAo.js";
import { m as motion } from "./proxy-Ks2jyQth.js";
import { C as CircleCheckBig } from "./circle-check-big-BwXOlOrx.js";
const CHECKIN_KEY = "paisa_checkin_state";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function loadCheckinState() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHECKIN_KEY) ?? "{}");
    if (!stored.lastCheckin) {
      return { streak: 0, lastCheckin: 0, weekCheckins: Array(7).fill(false) };
    }
    return stored;
  } catch {
    return { streak: 0, lastCheckin: 0, weekCheckins: Array(7).fill(false) };
  }
}
function getCheckinReward(streak) {
  const base = 5;
  const bonus = Math.min(streak, 7) * 2;
  return Math.min(base + bonus, 15);
}
function isCheckedInToday(lastCheckin) {
  const now = /* @__PURE__ */ new Date();
  const last = new Date(lastCheckin);
  return now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth() && now.getDate() === last.getDate();
}
function CheckinPage() {
  const [state, setState] = reactExports.useState(loadCheckinState);
  const [justCheckedIn, setJustCheckedIn] = reactExports.useState(false);
  const [earnedCoins, setEarnedCoins] = reactExports.useState(null);
  const refreshBalance = useCoinBalanceRefresh();
  const checkedInToday = isCheckedInToday(state.lastCheckin);
  const reward = getCheckinReward(state.streak + (checkedInToday ? 0 : 1));
  const todayIndex = (/* @__PURE__ */ new Date()).getDay();
  const handleCheckin = () => {
    if (checkedInToday) return;
    const now = Date.now();
    const yesterday = /* @__PURE__ */ new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = new Date(state.lastCheckin).toDateString() === yesterday.toDateString();
    const newStreak = wasYesterday || state.streak === 0 ? state.streak + 1 : 1;
    const coins = getCheckinReward(newStreak);
    const newWeekCheckins = [...state.weekCheckins];
    newWeekCheckins[todayIndex] = true;
    const newState = {
      streak: newStreak,
      lastCheckin: now,
      weekCheckins: newWeekCheckins
    };
    setState(newState);
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(newState));
    addCoins(coins, "checkin", `Daily Check-in (Streak ${newStreak})`);
    refreshBalance();
    setEarnedCoins(coins);
    setJustCheckedIn(true);
    ue.success(`🎯 Check-in complete! +${coins} coins`, {
      description: `Streak: ${newStreak} days 🔥`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col px-4 py-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "card-game p-5 text-center relative overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary/10 blur-xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: checkedInToday ? "✅" : "📅" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-gold", children: "Daily Check-in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: checkedInToday ? "Already checked in today!" : "Check in daily to earn coins and build your streak" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 inline-flex items-center gap-2 bg-gradient-coin border border-primary/30 rounded-full px-4 py-2 coin-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🔥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-gold", children: [
              state.streak,
              " Day",
              state.streak !== 1 ? "s" : "",
              " Streak"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "card-game p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-3", children: "This Week" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2", children: DAYS.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isDone = state.weekCheckins[idx];
            const isPast = idx < todayIndex;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-smooth",
                  isToday && checkedInToday ? "bg-secondary/20 border-secondary/40 success-glow" : isToday ? "bg-primary/15 border-primary/40 coin-glow" : isDone ? "bg-secondary/10 border-secondary/20" : isPast ? "bg-muted/30 border-border/30 opacity-50" : "bg-card border-border/30 opacity-40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: day }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm",
                        isDone ? "bg-secondary/30" : "bg-muted/50"
                      ),
                      children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14, className: "text-success" }) : "🪙"
                    }
                  )
                ]
              },
              day
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.15 },
        className: "card-game p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-3", children: "Streak Rewards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: [1, 3, 5, 7].map((streakGoal) => {
            const streakReward = getCheckinReward(streakGoal);
            const achieved = state.streak >= streakGoal;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-smooth",
                  achieved ? "bg-secondary/10 border-secondary/30 success-glow" : "bg-card border-border/40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: achieved ? "✅" : "🎯" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
                      streakGoal,
                      " Day Streak"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: cn(
                        "font-bold text-sm px-2 py-0.5 rounded-full",
                        achieved ? "text-success bg-secondary/20 border border-secondary/30" : "text-gold bg-primary/15 border border-primary/30"
                      ),
                      children: [
                        "+",
                        streakReward,
                        " coins/day"
                      ]
                    }
                  )
                ]
              },
              streakGoal
            );
          }) })
        ]
      }
    ),
    !checkedInToday && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
        className: "bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Today's reward" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-gold", children: [
            "+",
            reward,
            " coins"
          ] })
        ]
      }
    ),
    justCheckedIn && earnedCoins !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        className: "flex flex-col items-center gap-2 bg-gradient-coin border border-primary/30 rounded-2xl px-8 py-4 text-center coin-glow",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-3xl text-gold", children: [
            "+",
            earnedCoins,
            " Coins!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Streak: ",
            state.streak,
            " days 🔥"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleCheckin,
        disabled: checkedInToday,
        className: cn(
          "w-full h-14 text-lg font-display font-bold rounded-2xl transition-smooth",
          checkedInToday ? "bg-secondary/20 text-success border border-secondary/30 success-glow cursor-default" : "bg-gradient-gold text-card coin-glow hover:scale-105 active:scale-95"
        ),
        "data-ocid": "checkin-claim-btn",
        children: checkedInToday ? "✅ Checked In Today!" : "📅 CLAIM TODAY'S REWARD"
      }
    )
  ] });
}
export {
  CheckinPage
};
