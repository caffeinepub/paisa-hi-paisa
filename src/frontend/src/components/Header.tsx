import { useCoinBalance } from "@/hooks/useCoinBalance";
import { Link } from "@tanstack/react-router";

export function Header() {
  const { data: balance = 0 } = useCoinBalance();

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border/50 shadow-lg"
      data-ocid="header"
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-coin coin-glow flex items-center justify-center text-xl font-bold shrink-0 transition-smooth group-hover:scale-110">
            ₹
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm leading-none text-gold">
              Paisa Hi Paisa
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Earn & Win Daily
            </span>
          </div>
        </Link>

        {/* Coin Balance */}
        <div
          className="flex items-center gap-1.5 bg-gradient-coin border border-primary/30 rounded-full px-3 py-1.5 coin-glow"
          data-ocid="header-coin-balance"
        >
          <span className="text-lg">🪙</span>
          <span className="font-display font-bold text-gold text-sm tabular-nums">
            {balance.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
