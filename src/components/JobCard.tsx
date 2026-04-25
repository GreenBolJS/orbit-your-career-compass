import { ArrowRight, X } from "lucide-react";
import type { JobMatch } from "@/lib/storage";
import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score > 85) return "text-success";
  if (score > 70) return "text-primary";
  if (score > 50) return "text-violet";
  return "text-muted-foreground";
}

function isNew(postedAt: string) {
  return Date.now() - new Date(postedAt).getTime() < 24 * 3600_000;
}

interface Props {
  job: JobMatch;
  onDismiss: (id: string) => void;
}

export function JobCard({ job, onDismiss }: Props) {
  return (
    <article className="card-orbit group flex flex-col gap-3 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "font-mono text-3xl font-bold leading-none tabular-nums",
              scoreColor(job.score),
            )}
          >
            {job.score}
          </div>
          {isNew(job.postedAt) && (
            <span className="rounded-sm border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">
              New
            </span>
          )}
        </div>
        <button
          onClick={() => onDismiss(job.id)}
          className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-surface-elevated hover:text-foreground group-hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div>
        <h3 className="font-display text-lg font-bold leading-snug text-foreground">{job.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="text-foreground/80">{job.company}</span> · {job.location}
          {job.remote && <span className="ml-1 text-primary/80">· Remote</span>}
        </p>
      </div>

      <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-foreground/80">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          why ·{" "}
        </span>
        {job.reason}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="rounded-sm border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {job.query}
        </span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-foreground interactive-glow hover:text-primary"
        >
          View Listing <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
