import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  spendCoins,
  useCoinBalance,
  useCoinBalanceRefresh,
} from "@/hooks/useCoinBalance";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const WITHDRAW_HISTORY_KEY = "paisa_withdrawals";
const MIN_COINS = 500;

interface WithdrawalRecord {
  id: string;
  coins: number;
  amountInr: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  holderName: string;
  status: "pending";
  createdAt: number;
}

function loadHistory(): WithdrawalRecord[] {
  try {
    return JSON.parse(localStorage.getItem(WITHDRAW_HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_META = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/15 border-primary/30",
  },
} as const;

export function WithdrawPage() {
  const { data: balance = 0 } = useCoinBalance();
  const refreshBalance = useCoinBalanceRefresh();
  const [history, setHistory] = useState<WithdrawalRecord[]>(loadHistory);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    holderName: "",
    coins: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const coinsToWithdraw = Number.parseInt(form.coins || "0", 10);
  const inrAmount = Math.floor(coinsToWithdraw / 100) * 10;
  const canWithdraw = balance >= MIN_COINS;

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
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

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = spendCoins(coinsToWithdraw);
    if (!success) {
      toast.error("Not enough coins to withdraw");
      return;
    }

    const record: WithdrawalRecord = {
      id: crypto.randomUUID(),
      coins: coinsToWithdraw,
      amountInr: inrAmount,
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      ifscCode: form.ifscCode.toUpperCase(),
      holderName: form.holderName,
      status: "pending",
      createdAt: Date.now(),
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
      coins: "",
    });

    toast.success(`Withdrawal of ₹${inrAmount} requested!`, {
      description: "Processing within 2–3 business days",
    });
  };

  return (
    <div className="flex flex-col px-4 py-5 gap-5">
      {/* Balance */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-game p-5 flex items-center justify-between"
        data-ocid="withdraw-balance-card"
      >
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Available Balance
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="font-display font-bold text-3xl text-gold">
              {balance.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            ≈{" "}
            <span className="text-success font-semibold">
              ₹{Math.floor(balance / 100) * 10}
            </span>{" "}
            INR
          </p>
        </div>
        {!canWithdraw && (
          <div className="text-right">
            <p className="text-xs text-destructive font-semibold">
              Need {MIN_COINS} coins
            </p>
            <p className="text-xs text-muted-foreground">to withdraw</p>
          </div>
        )}
      </motion.div>

      {/* Rate info */}
      <div className="bg-gradient-coin border border-primary/20 rounded-2xl p-3 flex items-center gap-2">
        <span className="text-lg">💡</span>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            100 coins = ₹10 INR
          </span>{" "}
          • Min {MIN_COINS} coins • Processed in 2–3 business days
        </p>
      </div>

      {/* Success state */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card-game p-5 flex flex-col items-center gap-3 text-center border-secondary/30 success-glow"
          >
            <CheckCircle size={36} className="text-success" />
            <h3 className="font-display font-bold text-lg text-success">
              Request Submitted!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your withdrawal is being processed. It will be transferred to your
              bank account within 2–3 business days.
            </p>
            <Button
              variant="outline"
              className="mt-1 border-secondary/40 text-success hover:bg-secondary/10"
              onClick={() => setSubmitted(false)}
              data-ocid="withdraw-new-request-btn"
            >
              Submit Another Request
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      {!submitted && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-game p-5 flex flex-col gap-4"
          data-ocid="withdraw-form"
        >
          <h2 className="font-display font-bold text-lg text-gold">
            Bank Details
          </h2>

          {!canWithdraw && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive">
              <AlertCircle size={14} />
              You need at least {MIN_COINS} coins to withdraw. Keep earning!
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="holderName" className="text-sm text-foreground">
              Account Holder Name
            </Label>
            <Input
              id="holderName"
              placeholder="Full name as on bank account"
              value={form.holderName}
              onChange={handleChange("holderName")}
              className={cn(
                "bg-input border-border h-11",
                errors.holderName && "border-destructive",
              )}
              data-ocid="withdraw-holder-name"
            />
            {errors.holderName && (
              <p className="text-xs text-destructive">{errors.holderName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bankName" className="text-sm text-foreground">
              Bank Name
            </Label>
            <Input
              id="bankName"
              placeholder="e.g. State Bank of India"
              value={form.bankName}
              onChange={handleChange("bankName")}
              className={cn(
                "bg-input border-border h-11",
                errors.bankName && "border-destructive",
              )}
              data-ocid="withdraw-bank-name"
            />
            {errors.bankName && (
              <p className="text-xs text-destructive">{errors.bankName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountNumber" className="text-sm text-foreground">
              Account Number
            </Label>
            <Input
              id="accountNumber"
              placeholder="Enter bank account number"
              type="tel"
              value={form.accountNumber}
              onChange={handleChange("accountNumber")}
              className={cn(
                "bg-input border-border h-11",
                errors.accountNumber && "border-destructive",
              )}
              data-ocid="withdraw-account-number"
            />
            {errors.accountNumber && (
              <p className="text-xs text-destructive">{errors.accountNumber}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ifscCode" className="text-sm text-foreground">
              IFSC Code
            </Label>
            <Input
              id="ifscCode"
              placeholder="e.g. SBIN0001234"
              value={form.ifscCode}
              onChange={handleChange("ifscCode")}
              className={cn(
                "bg-input border-border h-11 uppercase",
                errors.ifscCode && "border-destructive",
              )}
              data-ocid="withdraw-ifsc-code"
            />
            {errors.ifscCode && (
              <p className="text-xs text-destructive">{errors.ifscCode}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coins" className="text-sm text-foreground">
              Coins to Withdraw
              {coinsToWithdraw >= 100 && (
                <span className="ml-2 text-success font-semibold">
                  = ₹{inrAmount} INR
                </span>
              )}
            </Label>
            <Input
              id="coins"
              placeholder={`Min ${MIN_COINS} coins (multiples of 100)`}
              type="number"
              min={MIN_COINS}
              max={balance}
              step={100}
              value={form.coins}
              onChange={handleChange("coins")}
              className={cn(
                "bg-input border-border h-11",
                errors.coins && "border-destructive",
              )}
              data-ocid="withdraw-coins-input"
            />
            {errors.coins && (
              <p className="text-xs text-destructive">{errors.coins}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canWithdraw}
            className="h-14 text-base font-display font-bold bg-gradient-green text-card rounded-2xl success-glow-lg transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 mt-1"
            data-ocid="withdraw-submit-btn"
          >
            WITHDRAW ₹{inrAmount > 0 ? inrAmount : "—"}
          </Button>
        </motion.form>
      )}

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-game p-4"
          data-ocid="withdraw-history"
        >
          <h3 className="font-display font-bold text-sm text-foreground mb-3">
            Withdrawal History
          </h3>
          <div className="flex flex-col gap-2">
            {history.map((record) => {
              const meta = STATUS_META[record.status];
              const StatusIcon = meta.icon;
              return (
                <div
                  key={record.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border",
                    meta.bg,
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {record.holderName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {record.coins} coins • {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2 gap-1">
                    <span className="font-bold text-sm text-gold">
                      ₹{record.amountInr}
                    </span>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-semibold",
                        meta.color,
                      )}
                    >
                      <StatusIcon size={10} />
                      {meta.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
