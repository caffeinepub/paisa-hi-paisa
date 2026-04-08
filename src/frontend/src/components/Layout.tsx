import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full pb-[80px] overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
      <footer className="bg-card border-t border-border py-3 text-center pb-[calc(80px+0.75rem)]">
        <p className="text-[11px] text-muted-foreground">
          © {year}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
