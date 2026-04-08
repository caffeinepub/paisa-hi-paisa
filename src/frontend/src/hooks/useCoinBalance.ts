import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./useSession";

const COINS_KEY = "paisa_coins";
const EVENTS_KEY = "paisa_events";

function getStoredCoins(): number {
  return Number.parseInt(localStorage.getItem(COINS_KEY) ?? "0", 10);
}

function getStoredEvents(): Array<{
  id: string;
  source: string;
  coins: number;
  timestamp: number;
  label: string;
}> {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addCoins(amount: number, source: string, label: string) {
  const current = getStoredCoins();
  localStorage.setItem(COINS_KEY, String(current + amount));
  const events = getStoredEvents();
  const newEvent = {
    id: crypto.randomUUID(),
    source,
    coins: amount,
    timestamp: Date.now(),
    label,
  };
  events.unshift(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, 50)));
  return current + amount;
}

export function spendCoins(amount: number): boolean {
  const current = getStoredCoins();
  if (current < amount) return false;
  localStorage.setItem(COINS_KEY, String(current - amount));
  return true;
}

export function useCoinBalance() {
  const sessionId = useSession();
  return useQuery({
    queryKey: ["coinBalance", sessionId],
    queryFn: () => getStoredCoins(),
    refetchInterval: false,
    staleTime: 0,
  });
}

export function useCoinBalanceRefresh() {
  const queryClient = useQueryClient();
  const sessionId = useSession();
  return () =>
    queryClient.invalidateQueries({ queryKey: ["coinBalance", sessionId] });
}
