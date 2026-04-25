import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  defaultSettings,
  getSettings,
  setSettings,
  resetAll,
  setDismissed,
  type Settings,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setLocal] = useState<Settings>(defaultSettings);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => setLocal(getSettings()), []);
  const update = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setLocal(next);
    setSettings(next);
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            // configuration
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Settings</h1>
        </div>

        <Row label="Search frequency" hint="How often Orbit scans the web for matches.">
          <Segmented
            value={s.frequency}
            options={[
              { v: "6h", l: "Every 6h" },
              { v: "12h", l: "Every 12h" },
              { v: "24h", l: "Every 24h" },
            ]}
            onChange={(v) => update({ frequency: v as Settings["frequency"] })}
          />
        </Row>

        <Row label="Minimum relevance score" hint="Filter out matches below this threshold.">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={10}
              value={s.minScore}
              onChange={(e) => update({ minScore: Number(e.target.value) })}
              className="h-1 w-full max-w-xs cursor-pointer appearance-none rounded bg-border accent-primary"
            />
            <span className="font-mono text-2xl font-bold tabular-nums text-primary">
              {s.minScore}
            </span>
          </div>
        </Row>

        <Row label="Telegram notifications" hint="Get instant pings on new high-score matches.">
          <div className="space-y-3">
            <Toggle checked={s.telegramEnabled} onChange={(v) => update({ telegramEnabled: v })} />
            {s.telegramEnabled && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  value={s.telegramBotToken}
                  onChange={(e) => update({ telegramBotToken: e.target.value })}
                  placeholder="Bot Token"
                  className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none interactive-glow focus:border-primary"
                />
                <input
                  value={s.telegramChatId}
                  onChange={(e) => update({ telegramChatId: e.target.value })}
                  placeholder="Chat ID"
                  className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none interactive-glow focus:border-primary"
                />
                <button
                  onClick={() => flash("Test notification dispatched")}
                  className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs interactive-glow"
                >
                  <Send className="h-3.5 w-3.5" /> Test Notification
                </button>
              </div>
            )}
          </div>
        </Row>

        <Row label="Email notifications" hint="Daily digest of top matches.">
          <div className="flex items-center gap-3 opacity-50">
            <Toggle checked={s.emailEnabled} onChange={() => {}} disabled />
            <input
              disabled
              placeholder="you@email.com"
              className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none"
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              coming soon
            </span>
          </div>
        </Row>

        {/* Danger zone */}
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-destructive">
            // danger zone
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setDismissed([]);
                flash("All matches restored");
              }}
              className="rounded-md border border-destructive/50 bg-transparent px-4 py-2 text-sm text-destructive interactive-glow hover:bg-destructive/10"
            >
              Clear all matches
            </button>
            <button
              onClick={() => {
                resetAll();
                flash("Profile reset");
                setTimeout(() => navigate({ to: "/" }), 600);
              }}
              className="rounded-md border border-destructive/50 bg-transparent px-4 py-2 text-sm text-destructive interactive-glow hover:bg-destructive/10"
            >
              Reset profile
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-md border border-primary/50 bg-surface px-4 py-2 font-mono text-xs text-primary glow-cyan-soft animate-fade-up">
          {toast}
        </div>
      )}
    </AppShell>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-5">
      <div className="mb-1 text-sm font-semibold text-foreground">{label}</div>
      {hint && <div className="mb-4 text-xs text-muted-foreground">{hint}</div>}
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-input p-1">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "rounded-sm px-4 py-1.5 text-xs transition",
            value === o.v
              ? "bg-primary text-primary-foreground glow-cyan-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full border border-border transition",
        checked ? "bg-primary glow-cyan-soft" : "bg-input",
        disabled && "cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
          checked ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}
