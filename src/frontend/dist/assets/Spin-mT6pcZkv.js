import { r as reactExports, a as useCoinBalanceRefresh, b as addCoins, d as ue, j as jsxRuntimeExports } from "./index-Y4LrGIHA.js";
import { B as Button } from "./button-Bb61SGAo.js";
import { m as motion } from "./proxy-Ks2jyQth.js";
import { A as AnimatePresence } from "./index-oMQZgODR.js";
const SPIN_TOTAL = 70;
const SPIN_STORAGE_KEY = "paisa_spin_state";
const SEGMENTS = [50, 75, 60, 100, 55, 80, 65, 90];
const SEGMENT_COLORS = [
  "oklch(0.78 0.2 80)",
  "oklch(0.68 0.19 140)",
  "oklch(0.72 0.18 60)",
  "oklch(0.62 0.17 155)",
  "oklch(0.78 0.2 80)",
  "oklch(0.68 0.19 140)",
  "oklch(0.72 0.18 60)",
  "oklch(0.62 0.17 155)"
];
function getSpinState() {
  try {
    const stored = JSON.parse(localStorage.getItem(SPIN_STORAGE_KEY) ?? "{}");
    const now = Date.now();
    const msInDay = 864e5;
    if (!stored.lastReset || now - stored.lastReset > msInDay) {
      return { spinsUsed: 0, lastReset: now };
    }
    return stored;
  } catch {
    return { spinsUsed: 0, lastReset: Date.now() };
  }
}
function saveSpinState(state) {
  localStorage.setItem(SPIN_STORAGE_KEY, JSON.stringify(state));
}
const NUM_SEGMENTS = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;
function SpinWheel({
  rotation,
  isSpinning
}) {
  const cx = 150;
  const cy = 150;
  const r = 140;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `absolute w-[320px] h-[320px] rounded-full coin-glow-lg opacity-60 ${isSpinning ? "pulse-gold" : ""}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "300",
        height: "300",
        viewBox: "0 0 300 300",
        role: "img",
        "aria-label": "Spin wheel with prizes",
        className: "relative z-10 drop-shadow-2xl",
        style: {
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 1)" : "none"
        },
        children: [
          SEGMENTS.map((coins, i) => {
            const segKey = `seg-${i}-${coins}`;
            const startAngle = i * SEGMENT_ANGLE * Math.PI / 180;
            const endAngle = (i + 1) * SEGMENT_ANGLE * Math.PI / 180;
            const x1 = cx + r * Math.sin(startAngle);
            const y1 = cy - r * Math.cos(startAngle);
            const x2 = cx + r * Math.sin(endAngle);
            const y2 = cy - r * Math.cos(endAngle);
            const midAngle = (i + 0.5) * SEGMENT_ANGLE * Math.PI / 180;
            const tx = cx + r * 0.65 * Math.sin(midAngle);
            const ty = cy - r * 0.65 * Math.cos(midAngle);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`,
                  fill: SEGMENT_COLORS[i],
                  stroke: "#1a1a1a",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "text",
                {
                  x: tx,
                  y: ty,
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                  fill: "#fff",
                  fontSize: "13",
                  fontWeight: "bold",
                  transform: `rotate(${(i + 0.5) * SEGMENT_ANGLE}, ${tx}, ${ty})`,
                  children: coins
                }
              )
            ] }, segKey);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx,
              cy,
              r: 28,
              fill: "#1a1a1a",
              stroke: "oklch(0.78 0.2 80)",
              strokeWidth: "3"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: cx,
              y: cy,
              textAnchor: "middle",
              dominantBaseline: "middle",
              fontSize: "18",
              children: "₹"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-0 z-20 flex flex-col items-center",
        style: { marginTop: "-4px" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0 h-0 border-l-[10px] border-r-[10px] border-t-[22px] border-l-transparent border-r-transparent border-t-primary drop-shadow-md" })
      }
    )
  ] });
}
function SpinPage() {
  const [spinState, setSpinState] = reactExports.useState(getSpinState);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [rotation, setRotation] = reactExports.useState(0);
  const [lastWin, setLastWin] = reactExports.useState(null);
  const rotationRef = reactExports.useRef(0);
  const refreshBalance = useCoinBalanceRefresh();
  const spinsRemaining = SPIN_TOTAL - spinState.spinsUsed;
  const handleSpin = reactExports.useCallback(() => {
    if (isSpinning || spinsRemaining <= 0) return;
    setIsSpinning(true);
    setLastWin(null);
    const winIndex = Math.floor(Math.random() * NUM_SEGMENTS);
    const winCoins = SEGMENTS[winIndex];
    const extraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const segmentOffset = 360 - winIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2;
    const newRotation = rotationRef.current + extraRotations + segmentOffset;
    rotationRef.current = newRotation;
    setRotation(newRotation);
    setTimeout(() => {
      setIsSpinning(false);
      setLastWin(winCoins);
      const newState = {
        ...spinState,
        spinsUsed: spinState.spinsUsed + 1
      };
      saveSpinState(newState);
      setSpinState(newState);
      addCoins(winCoins, "spin", "Spin Wheel Win!");
      refreshBalance();
      ue.success(`🎉 You won ${winCoins} coins!`, {
        description: `${spinsRemaining - 1} spins remaining today`
      });
    }, 4200);
  }, [isSpinning, spinsRemaining, spinState, refreshBalance]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-4 py-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "w-full card-game p-4 flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-gold", children: "Spin Wheel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Each spin = 50–100 coins" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex flex-col items-center bg-secondary/20 border border-secondary/30 rounded-2xl px-4 py-2 ${spinsRemaining > 0 ? "success-glow" : ""}`,
              "data-ocid": "spin-remaining-badge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-2xl text-success leading-none", children: spinsRemaining }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Free Spins" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpinWheel, { rotation, isSpinning })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: lastWin !== null && !isSpinning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.5, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        className: "flex flex-col items-center gap-1 bg-gradient-coin border border-primary/30 rounded-2xl px-8 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-3xl text-gold", children: [
            "+",
            lastWin,
            " Coins!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Added to your balance" })
        ]
      },
      lastWin
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleSpin,
        disabled: isSpinning || spinsRemaining <= 0,
        className: "w-full max-w-xs h-14 text-lg font-display font-bold bg-gradient-gold text-card rounded-2xl coin-glow transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100",
        "data-ocid": "spin-button",
        children: isSpinning ? "Spinning..." : spinsRemaining <= 0 ? "No Spins Left Today" : "🎡 SPIN NOW"
      }
    ),
    spinsRemaining <= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Spins reset every 24 hours. Come back tomorrow!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full card-game p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide", children: "Wheel Prizes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: SEGMENTS.map((coins, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center bg-card/50 rounded-xl py-1.5 border border-border/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gold", children: coins }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: "coins" })
          ]
        },
        `prize-${i}-${coins}`
      )) })
    ] })
  ] });
}
export {
  SpinPage
};
