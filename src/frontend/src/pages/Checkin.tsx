import { Button } from "@/components/ui/button";
import { addCoins, useCoinBalanceRefresh } from "@/hooks/useCoinBalance";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CHECKIN_KEY = "paisa_checkin_state";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CheckinStoredState {
  streak: number;
  lastCheckin: number;
  weekCheckins: boolean[];
}

function loadCheckinState(): CheckinStoredState {
  try {
    const stored = JSON.parse(localStorage.getItem(CHECKIN_KEY) ?? "{}");
    if (!stored.lastCheckin) {
      return { streak: 0, lastCheckin: 0, weekCheckins: Array(7).fill(false) };
    }
    return stored as CheckinStoredState;
  } catch {
    return { streak: 0, lastCheckin: 0, weekCheckins: Array(7).fill(false) };
  }
}

function getCheckinReward(streak: number): number {
  const base = 5;
  const bonus = Math.min(streak, 7) * 2;
  return Math.min(base + bonus, 15);
}

function isCheckedInToday(lastCheckin: number): boolean {
  const now = new Date();
  const last = new Date(lastCheckin);
  return (
    now.getFullYear() === last.getFullYear() &&
    now.getMonth() === last.getMonth() &&
    now.getDate() === last.getDate()
  );
}

export function CheckinPage() {
  const [state, setState] = useState<CheckinStoredState>(loadCheckinState);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const refreshBalance = useCoinBalanceRefresh();

  const checkedInToday = isCheckedInToday(state.lastCheckin);
  const reward = getCheckinReward(state.streak + (checkedInToday ? 0 : 1));
  const todayIndex = new Date().getDay();

  const handleCheckin = () => {
    if (checkedInToday) return;

    const now = Date.now();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday =
      new Date(state.lastCheckin).toDateString() === yesterday.toDateString();

    const newStreak = wasYesterday || state.streak === 0 ? state.streak + 1 : 1;
    const coins = getCheckinReward(newStreak);

    const newWeekCheckins = [...state.weekCheckins];
    newWeekCheckins[todayIndex] = true;

    const newState: CheckinStoredState = {
      streak: newStreak,
      lastCheckin: now,
      weekCheckins: newWeekCheckins,
    };

    setState(newState);
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(newState));
    addCoins(coins, "checkin", `Daily Check-in (Streak ${newStreak})`);
    refreshBalance();
    setEarnedCoins(coins);
    setJustCheckedIn(true);
    toast.success(`🎯 Check-in complete! +${coins} coins`, {
      description: `Streak: ${newStreak} days 🔥`,
    });
  };

  return (
    <div className="flex flex-col px-4 py-5 gap-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-game p-5 text-center relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary/10 blur-xl pointer-events-none" />
        <div className="text-4xl mb-2">{checkedInToday ? "✅" : "📅"}</div>
        <h1 className="font-display font-bold text-xl text-gold">
          Daily Check-in
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {checkedInToday
            ? "Already checked in today!"
            : "Check in daily to earn coins and build your streak"}
        </p>

        {/* Streak */}
        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-coin border border-primary/30 rounded-full px-4 py-2 coin-glow">
          <span className="text-xl">🔥</span>
          <span className="font-display font-bold text-gold">
            {state.streak} Day{state.streak !== 1 ? "s" : ""} Streak
          </span>
        </div>
      </motion.div>

      {/* Week Days Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-game p-4"
      >
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          This Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isDone = state.weekCheckins[idx];
            const isPast = idx < todayIndex;

            return (
              <div
                key={day}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-smooth",
                  isToday && checkedInToday
                    ? "bg-secondary/20 border-secondary/40 success-glow"
                    : isToday
                      ? "bg-primary/15 border-primary/40 coin-glow"
                      : isDone
                        ? "bg-secondary/10 border-secondary/20"
                        : isPast
                          ? "bg-muted/30 border-border/30 opacity-50"
                          : "bg-card border-border/30 opacity-40",
                )}
              >
                <span className="text-[10px] text-muted-foreground font-medium">
                  {day}
                </span>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-sm",
                    isDone ? "bg-secondary/30" : "bg-muted/50",
                  )}
                >
                  {isDone ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : (
                    "🪙"
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reward Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-game p-4"
      >
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Streak Rewards
        </h3>
        <div className="flex flex-col gap-2">
          {[1, 3, 5, 7].map((streakGoal) => {
            const streakReward = getCheckinReward(streakGoal);
            const achieved = state.streak >= streakGoal;
            return (
              <div
                key={streakGoal}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-smooth",
                  achieved
                    ? "bg-secondary/10 border-secondary/30 success-glow"
                    : "bg-card border-border/40",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{achieved ? "✅" : "🎯"}</span>
                  <span className="text-sm font-medium text-foreground">
                    {streakGoal} Day Streak
                  </span>
                </div>
                <span
                  className={cn(
                    "font-bold text-sm px-2 py-0.5 rounded-full",
                    achieved
                      ? "text-success bg-secondary/20 border border-secondary/30"
                      : "text-gold bg-primary/15 border border-primary/30",
                  )}
                >
                  +{streakReward} coins/day
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Today's reward preview */}
      {!checkedInToday && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center justify-between"
        >
          <span className="text-sm text-muted-foreground">Today's reward</span>
          <span className="font-display font-bold text-gold">
            +{reward} coins
          </span>
        </motion.div>
      )}

      {/* Earned display */}
      {justCheckedIn && earnedCoins !== null && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-2 bg-gradient-coin border border-primary/30 rounded-2xl px-8 py-4 text-center coin-glow"
        >
          <span className="text-3xl">🎉</span>
          <span className="font-display font-bold text-3xl text-gold">
            +{earnedCoins} Coins!
          </span>
          <span className="text-xs text-muted-foreground">
            Streak: {state.streak} days 🔥
          </span>
        </motion.div>
      )}

      {/* CTA */}
      <Button
        onClick={handleCheckin}
        disabled={checkedInToday}
        className={cn(
          "w-full h-14 text-lg font-display font-bold rounded-2xl transition-smooth",
          checkedInToday
            ? "bg-secondary/20 text-success border border-secondary/30 success-glow cursor-default"
            : "bg-gradient-gold text-card coin-glow hover:scale-105 active:scale-95",
        )}
        data-ocid="checkin-claim-btn"
      >
        {checkedInToday ? "✅ Checked In Today!" : "📅 CLAIM TODAY'S REWARD"}
      </Button>
    </div>
  );
}
