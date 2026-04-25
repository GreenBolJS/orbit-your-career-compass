import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, RotateCcw, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getProfile, saveProfile } from "@/api/profile";
import { type ExperienceLevel, type Profile } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

type SectionKey = "targetRoles" | "skills" | "locations" | "companies";

const sections: { key: SectionKey; label: string; placeholder: string }[] = [
  { key: "targetRoles", label: "Target Roles", placeholder: "ML Engineer" },
  { key: "skills", label: "Skills", placeholder: "PyTorch" },
  { key: "locations", label: "Locations", placeholder: "Bangalore" },
  { key: "companies", label: "Companies to Watch", placeholder: "Anthropic" },
];

function ProfilePage() {
  const [profile, setLocal] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setLocal(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const update = async (patch: Partial<Profile>) => {
    if (!profile) return;
    const next = { ...profile, ...patch };
    setLocal(next);
    try {
      setSaving(true);
      await saveProfile(patch);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const addTag = (key: SectionKey, val: string) => {
    if (!profile) return;
    const v = val.trim();
    const currentArray = profile[key] ?? [];
    if (!v || currentArray.includes(v)) return;
    update({ [key]: [...currentArray, v] } as Partial<Profile>);
  };
  const removeTag = (key: SectionKey, val: string) => {
    if (!profile) return;
    const currentArray = profile[key] ?? [];
    update({ [key]: currentArray.filter((x) => x !== val) } as Partial<Profile>);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load profile</p>
            <button
              onClick={loadProfile}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm interactive-glow"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            // interest profile
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Your Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orbit uses these tags to score every opportunity it finds.
          </p>
        </div>

        <div className="space-y-6">
          <ExpField
            label="Experience Level"
            value={profile?.experienceLevel ?? "Internship"}
            options={["Internship", "Entry", "Mid"]}
            onChange={(v) => update({ experienceLevel: v as ExperienceLevel })}
          />

          {sections.map((s) => (
            <TagSection
              key={s.key}
              label={s.label}
              placeholder={s.placeholder}
              tags={profile?.[s.key] ?? []}
              onAdd={(v) => addTag(s.key, v)}
              onRemove={(v) => removeTag(s.key, v)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm interactive-glow">
            <RotateCcw className="h-4 w-4" />
            Re-analyze from ChatGPT export
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function ExpField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-5">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="inline-flex rounded-md border border-border bg-input p-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-sm px-4 py-1.5 text-xs transition",
              value === o
                ? "bg-primary text-primary-foreground glow-cyan-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagSection({
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{tags.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs"
          >
            {t}
            <button
              onClick={() => onRemove(t)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${t}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {adding ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAdd(draft);
                setDraft("");
                setAdding(false);
              } else if (e.key === "Escape") {
                setAdding(false);
                setDraft("");
              }
            }}
            onBlur={() => {
              if (draft) onAdd(draft);
              setDraft("");
              setAdding(false);
            }}
            placeholder={placeholder}
            className="rounded-md border border-primary bg-input px-2 py-1 text-xs outline-none glow-cyan-soft"
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground interactive-glow hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        )}
      </div>
    </div>
  );
}
