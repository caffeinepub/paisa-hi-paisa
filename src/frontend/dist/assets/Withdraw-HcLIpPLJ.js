import { c as createLucideIcon, j as jsxRuntimeExports, e as cn, r as reactExports, u as useCoinBalance, a as useCoinBalanceRefresh, s as spendCoins, d as ue } from "./index-Y4LrGIHA.js";
import { c as createSlot, B as Button } from "./button-Bb61SGAo.js";
import { m as motion } from "./proxy-Ks2jyQth.js";
import { A as AnimatePresence } from "./index-oMQZgODR.js";
import { C as CircleCheckBig } from "./circle-check-big-BwXOlOrx.js";
import { C as Clock } from "./clock-DpufE5RC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const WITHDRAW_HISTORY_KEY = "paisa_withdrawals";
const MIN_COINS = 500;
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(WITHDRAW_HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
const STATUS_META = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/15 border-primary/30"
  }
};
function WithdrawPage() {
  const { data: balance = 0 } = useCoinBalance();
  const refreshBalance = useCoinBalanceRefresh();
  const [history, setHistory] = reactExports.useState(loadHistory);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    holderName: "",
    coins: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const coinsToWithdraw = Number.parseInt(form.coins || "0", 10);
  const inrAmount = Math.floor(coinsToWithdraw / 100) * 10;
  const canWithdraw = balance >= MIN_COINS;
  const validate = () => {
    const newErrors = {};
    if (!form.holderName.trim())
      newErrors.holderName = "Account holder name is required";
    if (!form.bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!/^\d{9,18}$/.test(form.accountNumber))
      newErrors.accountNumber = "Enter valid account number (9-18 digits)";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase()))
      newErrors.ifscCode = "Enter valid IFSC code (e.g. SBIN0001234)";
    if (!form.coins || coinsToWithdraw < MIN_COINS)
      newErrors.coins = `Minimum ${MIN_COINS} coins required`;
    if (coinsToWithdraw > balance) newErrors.coins = "Not enough coins";
    if (coinsToWithdraw % 100 !== 0)
      newErrors.coins = "Must be a multiple of 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const success = spendCoins(coinsToWithdraw);
    if (!success) {
      ue.error("Not enough coins to withdraw");
      return;
    }
    const record = {
      id: crypto.randomUUID(),
      coins: coinsToWithdraw,
      amountInr: inrAmount,
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      ifscCode: form.ifscCode.toUpperCase(),
      holderName: form.holderName,
      status: "pending",
      createdAt: Date.now()
    };
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem(WITHDRAW_HISTORY_KEY, JSON.stringify(newHistory));
    refreshBalance();
    setSubmitted(true);
    setForm({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      holderName: "",
      coins: ""
    });
    ue.success(`Withdrawal of ₹${inrAmount} requested!`, {
      description: "Processing within 2–3 business days"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col px-4 py-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "card-game p-5 flex items-center justify-between",
        "data-ocid": "withdraw-balance-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Available Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🪙" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-gold", children: balance.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              "≈",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success font-semibold", children: [
                "₹",
                Math.floor(balance / 100) * 10
              ] }),
              " ",
              "INR"
            ] })
          ] }),
          !canWithdraw && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-semibold", children: [
              "Need ",
              MIN_COINS,
              " coins"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "to withdraw" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "💡" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "100 coins = ₹10 INR" }),
        " ",
        "• Min ",
        MIN_COINS,
        " coins • Processed in 2–3 business days"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        className: "card-game p-5 flex flex-col items-center gap-3 text-center border-secondary/30 success-glow",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 36, className: "text-success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-success", children: "Request Submitted!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your withdrawal is being processed. It will be transferred to your bank account within 2–3 business days." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-1 border-secondary/40 text-success hover:bg-secondary/10",
              onClick: () => setSubmitted(false),
              "data-ocid": "withdraw-new-request-btn",
              children: "Submit Another Request"
            }
          )
        ]
      }
    ) }),
    !submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.form,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        onSubmit: handleSubmit,
        className: "card-game p-5 flex flex-col gap-4",
        "data-ocid": "withdraw-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-gold", children: "Bank Details" }),
          !canWithdraw && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
            "You need at least ",
            MIN_COINS,
            " coins to withdraw. Keep earning!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "holderName", className: "text-sm text-foreground", children: "Account Holder Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "holderName",
                placeholder: "Full name as on bank account",
                value: form.holderName,
                onChange: handleChange("holderName"),
                className: cn(
                  "bg-input border-border h-11",
                  errors.holderName && "border-destructive"
                ),
                "data-ocid": "withdraw-holder-name"
              }
            ),
            errors.holderName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.holderName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bankName", className: "text-sm text-foreground", children: "Bank Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "bankName",
                placeholder: "e.g. State Bank of India",
                value: form.bankName,
                onChange: handleChange("bankName"),
                className: cn(
                  "bg-input border-border h-11",
                  errors.bankName && "border-destructive"
                ),
                "data-ocid": "withdraw-bank-name"
              }
            ),
            errors.bankName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.bankName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "accountNumber", className: "text-sm text-foreground", children: "Account Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "accountNumber",
                placeholder: "Enter bank account number",
                type: "tel",
                value: form.accountNumber,
                onChange: handleChange("accountNumber"),
                className: cn(
                  "bg-input border-border h-11",
                  errors.accountNumber && "border-destructive"
                ),
                "data-ocid": "withdraw-account-number"
              }
            ),
            errors.accountNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.accountNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ifscCode", className: "text-sm text-foreground", children: "IFSC Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "ifscCode",
                placeholder: "e.g. SBIN0001234",
                value: form.ifscCode,
                onChange: handleChange("ifscCode"),
                className: cn(
                  "bg-input border-border h-11 uppercase",
                  errors.ifscCode && "border-destructive"
                ),
                "data-ocid": "withdraw-ifsc-code"
              }
            ),
            errors.ifscCode && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.ifscCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "coins", className: "text-sm text-foreground", children: [
              "Coins to Withdraw",
              coinsToWithdraw >= 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-success font-semibold", children: [
                "= ₹",
                inrAmount,
                " INR"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "coins",
                placeholder: `Min ${MIN_COINS} coins (multiples of 100)`,
                type: "number",
                min: MIN_COINS,
                max: balance,
                step: 100,
                value: form.coins,
                onChange: handleChange("coins"),
                className: cn(
                  "bg-input border-border h-11",
                  errors.coins && "border-destructive"
                ),
                "data-ocid": "withdraw-coins-input"
              }
            ),
            errors.coins && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.coins })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: !canWithdraw,
              className: "h-14 text-base font-display font-bold bg-gradient-green text-card rounded-2xl success-glow-lg transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 mt-1",
              "data-ocid": "withdraw-submit-btn",
              children: [
                "WITHDRAW ₹",
                inrAmount > 0 ? inrAmount : "—"
              ]
            }
          )
        ]
      }
    ),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
        className: "card-game p-4",
        "data-ocid": "withdraw-history",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground mb-3", children: "Withdrawal History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: history.map((record) => {
            const meta = STATUS_META[record.status];
            const StatusIcon = meta.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex items-center justify-between p-3 rounded-xl border",
                  meta.bg
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: record.holderName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      record.coins,
                      " coins • ",
                      formatDate(record.createdAt)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end shrink-0 ml-2 gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-gold", children: [
                      "₹",
                      record.amountInr
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: cn(
                          "flex items-center gap-1 text-[10px] font-semibold",
                          meta.color
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 10 }),
                          meta.label
                        ]
                      }
                    )
                  ] })
                ]
              },
              record.id
            );
          }) })
        ]
      }
    )
  ] });
}
export {
  WithdrawPage
};
