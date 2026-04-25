import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Target, User, SlidersHorizontal } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { getMatches } from "@/api/matches";
import { cn } from "@/lib/utils";

const navItems: { to: string; label: string; icon: typeof LayoutGrid; badge?: boolean }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/matches", label: "Matches", icon: Target, badge: true },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: SlidersHorizontal },
];

// Isolated ticker — re-renders on its own without touching the shell.
const LastScan = memo(function LastScan() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
      · last scan {now ?? "--:--"}
    </span>
  );
});

export function AppShell({ children }: { children?: React.ReactNode }) {
  const [matchCount, setMatchCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadMatchCount = async () => {
      try {
        const matches = await getMatches();
        setMatchCount(matches.length);
      } catch (err) {
        console.error('Failed to load match count:', err);
        setMatchCount(0);
      }
    };
    loadMatchCount();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-[0.35em] text-foreground">ORBIT</span>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">v0.1</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-success">Agent Active</span>
          <LastScan />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-border bg-sidebar md:block">
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to === "/dashboard" && location.pathname.startsWith("/dashboard"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm interactive-glow",
                    active
                      ? "border-border bg-surface text-foreground glow-cyan-soft"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", active && "text-primary")} />
                    {item.label}
                  </span>
                  {item.badge && matchCount > 0 && (
                    <span className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {matchCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-4 pb-4 pt-6 font-mono text-[10px] leading-relaxed text-muted-foreground">
            <div>// orbit_agent</div>
            <div>// status: scanning</div>
            <div>// queries: 12 active</div>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-sidebar md:hidden">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <div className="mx-auto max-w-6xl animate-fade-up">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
