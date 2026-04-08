import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CalendarCheck,
  HelpCircle,
  Home,
  Loader,
  TrendingDown,
} from "lucide-react";
import type React from "react";

const NAV_ITEMS: Array<{
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  exact?: boolean;
}> = [
  { to: "/", icon: Home, label: "Home", exact: true },
  { to: "/spin", icon: Loader, label: "Spin" },
  { to: "/quiz", icon: HelpCircle, label: "Quiz" },
  { to: "/checkin", icon: CalendarCheck, label: "Check-in" },
  { to: "/withdraw", icon: TrendingDown, label: "Withdraw" },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50"
      data-ocid="bottom-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-md mx-auto flex items-stretch">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-body transition-smooth",
                isActive
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`nav-${label.toLowerCase().replace(/[^a-z]/g, "")}`}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-smooth",
                  isActive && "bg-primary/15 coin-glow",
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    isActive && "drop-shadow-[0_0_6px_oklch(0.78_0.2_80)]",
                  )}
                />
              </div>
              <span className={cn("font-medium", isActive && "font-bold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
