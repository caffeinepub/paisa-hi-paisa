import { useCoinBalance } from "@/hooks/useCoinBalance";
import { Link } from "@tanstack/react-router";
import { ChevronRight, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

function getStoredEvents(): Array<{
  id: string;
  source: string;
  coins: number;
  timestamp: number;
  label: string;
}> {
  try {
    return JSON.parse(localStorage.getItem("paisa_events") ?? "[]");
  } catch {
    return [];
  }
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const SOURCE_ICON: Record<string, string> = {
  spin: "🎡",
  quiz: "✅",
  checkin: "📅",
};

function getRecentEvents() {
  const events = getStoredEvents().slice(0, 5);
  if (events.length > 0) {
    return events.map((e) => ({
      label: e.label,
      coins: e.coins,
      time: timeAgo(e.timestamp),
      icon: SOURCE_ICON[e.source] ?? "💰",
    }));
  }
  // Fallback shown only before any real activity
  return [
    { label: "Spin the wheel to earn!", coins: 0, time: "—", icon: "🎡" },
  ];
}

const EARN_CARDS = [
  {
    to: "/spin",
    icon: "🎡",
    title: "Spin Wheel",
    desc: "70 free spins daily",
    reward: "50–100 coins",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/30",
  },
  {
    to: "/quiz",
    icon: "🧠",
    title: "Daily Quiz",
    desc: "New questions every day",
    reward: "10–30 coins",
    color: "from-secondary/20 to-secondary/5",
    border: "border-secondary/30",
  },
  {
    to: "/checkin",
    icon: "📅",
    title: "Daily Check-in",
    desc: "Streak bonus rewards",
    reward: "5–15 coins",
    color: "from-chart-3/20 to-chart-3/5",
    border: "border-chart-3/30",
  },
];

export function HomePage() {
  const { data: balance = 0 } = useCoinBalance();
  const inrValue = Math.floor(balance / 100) * 10;
  const recentEvents = getRecentEvents();

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Hero Coin Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-game p-5 relative overflow-hidden"
        data-ocid="home-balance-card"
      >
        {/* Decorative bg circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

        <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-1">
          Your Coins
        </p>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-2xl font-bold text-card pulse-gold shrink-0">
            ₹
          </div>
          <span className="font-display font-bold text-5xl text-gold tabular-nums leading-none">
            {balance.toLocaleString()}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          ≈{" "}
          <span className="text-success font-semibold">
            ₹{inrValue.toLocaleString()}
          </span>{" "}
          INR
          <span className="text-xs ml-1 opacity-60">(100 coins = ₹10)</span>
        </p>

        <Link
          to="/withdraw"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="home-withdraw-link"
        >
          <TrendingDown size={13} />
          Withdraw earnings
          <ChevronRight size={12} />
        </Link>
      </motion.div>

      {/* Recent Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card-game p-4"
      >
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">
          Recent Earnings
        </h3>
        <div className="flex flex-col gap-2">
          {recentEvents.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground leading-none">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
              {item.coins > 0 && (
                <span className="font-display font-bold text-sm text-success success-glow px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                  +{item.coins}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Earn Section */}
      <div>
        <h2 className="font-display font-bold text-base text-foreground mb-3">
          Ways to Earn
        </h2>
        <div className="flex flex-col gap-3">
          {EARN_CARDS.map(
            ({ to, icon, title, desc, reward, color, border }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              >
                <Link
                  to={to}
                  className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${color} border ${border} transition-smooth hover:scale-[1.02] active:scale-[0.98] group`}
                  data-ocid={`earn-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-sm text-foreground leading-tight">
                        {title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-gold bg-primary/20 px-2 py-1 rounded-full border border-primary/30">
                      {reward}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground group-hover:text-foreground transition-smooth"
                    />
                  </div>
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>

      {/* Rate Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center gap-3"
      >
        <span className="text-2xl float-coin">💰</span>
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">100 coins = ₹10 INR</span>{" "}
          • Withdraw anytime to your bank account
        </p>
      </motion.div>
    </div>
  );
}
