import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { getMatches, dismissMatch } from "@/api/matches";
import { type JobMatch } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/matches")({
  component: MatchesPage,
});

type Filter = "All" | "Internships" | "Full-time" | "Remote";

function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMatches();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
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
    return list.sort((a, b) => b.score - a.score);
  }, [jobs, filter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          // matches
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">All Matches</h1>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface/40 p-2">
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
              onClick={loadMatches}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm interactive-glow"
            >
              Try Again
            </button>
          </div>
        </div>
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
