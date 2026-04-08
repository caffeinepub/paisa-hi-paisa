import { c as createLucideIcon, u as useCoinBalance, j as jsxRuntimeExports, L as Link, T as TrendingDown } from "./index-Y4LrGIHA.js";
import { m as motion } from "./proxy-Ks2jyQth.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem("paisa_events") ?? "[]");
  } catch {
    return [];
  }
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
const SOURCE_ICON = {
  spin: "🎡",
  quiz: "✅",
  checkin: "📅"
};
function getRecentEvents() {
  const events = getStoredEvents().slice(0, 5);
  if (events.length > 0) {
    return events.map((e) => ({
      label: e.label,
      coins: e.coins,
      time: timeAgo(e.timestamp),
      icon: SOURCE_ICON[e.source] ?? "💰"
    }));
  }
  return [
    { label: "Spin the wheel to earn!", coins: 0, time: "—", icon: "🎡" }
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
    border: "border-primary/30"
  },
  {
    to: "/quiz",
    icon: "🧠",
    title: "Daily Quiz",
    desc: "New questions every day",
    reward: "10–30 coins",
    color: "from-secondary/20 to-secondary/5",
    border: "border-secondary/30"
  },
  {
    to: "/checkin",
    icon: "📅",
    title: "Daily Check-in",
    desc: "Streak bonus rewards",
    reward: "5–15 coins",
    color: "from-chart-3/20 to-chart-3/5",
    border: "border-chart-3/30"
  }
];
function HomePage() {
  const { data: balance = 0 } = useCoinBalance();
  const inrValue = Math.floor(balance / 100) * 10;
  const recentEvents = getRecentEvents();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 px-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "card-game p-5 relative overflow-hidden",
        "data-ocid": "home-balance-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-secondary/10 blur-2xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs font-body uppercase tracking-widest mb-1", children: "Your Coins" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-2xl font-bold text-card pulse-gold shrink-0", children: "₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-5xl text-gold tabular-nums leading-none", children: balance.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
            "≈",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success font-semibold", children: [
              "₹",
              inrValue.toLocaleString()
            ] }),
            " ",
            "INR",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs ml-1 opacity-60", children: "(100 coins = ₹10)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/withdraw",
              className: "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth",
              "data-ocid": "home-withdraw-link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 13 }),
                "Withdraw earnings",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        className: "card-game p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-3", children: "Recent Earnings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: recentEvents.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: item.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-none", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: item.time })
                  ] })
                ] }),
                item.coins > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-sm text-success success-glow px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20", children: [
                  "+",
                  item.coins
                ] })
              ]
            },
            `${item.label}-${idx}`
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground mb-3", children: "Ways to Earn" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: EARN_CARDS.map(
        ({ to, icon, title, desc, reward, color, border }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, delay: 0.15 + i * 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to,
                className: `flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${color} border ${border} transition-smooth hover:scale-[1.02] active:scale-[0.98] group`,
                "data-ocid": `earn-card-${title.toLowerCase().replace(/\s+/g, "-")}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground leading-tight", children: title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: desc })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gold bg-primary/20 px-2 py-1 rounded-full border border-primary/30", children: reward }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronRight,
                      {
                        size: 14,
                        className: "text-muted-foreground group-hover:text-foreground transition-smooth"
                      }
                    )
                  ] })
                ]
              }
            )
          },
          to
        )
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.5 },
        className: "bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl float-coin", children: "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "100 coins = ₹10 INR" }),
            " ",
            "• Withdraw anytime to your bank account"
          ] })
        ]
      }
    )
  ] });
}
export {
  HomePage
};
