import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { getMatches, dismissMatch } from "@/api/matches";
import { runAgent } from "@/api/agent";
import { getProfile } from "@/api/profile";
import { type JobMatch } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

type Filter = "All" | "Internships" | "Full-time" | "Remote";
type Sort = "Relevance" | "Date";

function DashboardIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Relevance");
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningAgent, setRunningAgent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [matchesData, profileData] = await Promise.all([
        getMatches(),
        getProfile(),
      ]);
      setJobs(matchesData);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    try {
      setRunningAgent(true);
      await runAgent();
      // Reload matches after running agent
      const matchesData = await getMatches();
      setJobs(matchesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run agent');
    } finally {
      setRunningAgent(false);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await dismissMatch(id);
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss match');
    }
  };

  const filteredJobs = useMemo(() => {
    let list = jobs;
    if (filter === "Internships") list = list.filter((j) => j.type === "Internship");
    if (filter === "Full-time") list = list.filter((j) => j.type === "Full-time");
    if (filter === "Remote") list = list.filter((j) => j.remote);
    list = [...list].sort((a, b) =>
      sort === "Relevance"
        ? b.score - a.score
        : new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
    return list;
  }, [jobs, filter, sort]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            // matches feed
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">
            {profile?.targetRoles?.[0]
              ? `Opportunities for ${profile.targetRoles[0]}`
              : "Today's Opportunities"}
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
          <Stat label="tracked" value={jobs.length} />
          <Stat label="new 24h" value={jobs.filter((j) => Date.now() - new Date(j.postedAt).getTime() < 86400000).length} accent />
          <Stat label="avg score" value={jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.score, 0) / jobs.length) : 0} />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface/40 p-2">
        <div className="flex flex-wrap gap-1">
          {(["All", "Internships", "Full-time", "Remote"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs interactive-glow",
                filter === f
                  ? "bg-primary text-primary-foreground glow-cyan-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-input px-2 py-1.5 text-xs text-foreground outline-none interactive-glow"
          >
            <option>Relevance</option>
            <option>Date</option>
          </select>
        </div>
      </div>

      {/* Run Agent Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunAgent}
          disabled={runningAgent}
          className="rounded-md border border-border bg-primary px-6 py-2 text-sm font-medium text-primary-foreground interactive-glow hover:brightness-110 disabled:opacity-50"
        >
          {runningAgent ? "Running Agent..." : "Run Agent"}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading matches...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm interactive-glow"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyRadar />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredJobs.map((j) => (
            <JobCard key={j.id} job={j} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          "font-mono text-base font-bold tabular-nums",
          accent ? "text-success" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function EmptyRadar() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 rounded-full border border-primary/30" />
        <div className="absolute inset-3 rounded-full border border-primary/20" />
        <div className="absolute inset-6 rounded-full border border-primary/10" />
        <div className="absolute inset-0 rounded-full">
          <div
            className="radar-sweep h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, oklch(0.85 0.16 210 / 0.5), transparent 30%)",
            }}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary glow-cyan-soft" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">Agent is scanning...</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">// check back soon</p>
      </div>
    </div>
  );
}
