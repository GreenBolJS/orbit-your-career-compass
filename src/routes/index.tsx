import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { TagInput } from "@/components/TagInput";
import { saveProfile } from "@/api/profile";
import {
  defaultProfile,
  type ExperienceLevel,
  type Profile,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit — Your interests. Working for you." },
      {
        name: "description",
        content:
          "Orbit monitors the web 24/7 and surfaces jobs, internships and opportunities that match your actual goals.",
      },
      { property: "og:title", content: "Orbit — Your personal opportunity agent" },
      {
        property: "og:description",
        content: "A personal job & internship alert agent that watches the web for you.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [manual, setManual] = useState(false);
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [count, setCount] = useState(2400);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    // Check if already onboarded (this might need to be updated to check API)
    // For now, we'll assume onboarding is always needed
  }, [navigate]);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3) + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const launch = async () => {
    try {
      const safeProfile = profile || {
        targetRoles: [],
        skills: [],
        locations: [],
        experienceLevel: "Internship" as ExperienceLevel,
        companies: [],
        onboarded: true,
      };
      await saveProfile({ ...safeProfile, onboarded: true });
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error('Failed to save profile:', err);
      // Still navigate even if save fails
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <section className="relative flex flex-col justify-between overflow-hidden border-b border-border p-8 lg:border-b-0 lg:border-r lg:p-14">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="font-mono text-sm tracking-[0.4em]">ORBIT</span>
          <span className="font-mono text-[10px] text-muted-foreground">// v0.1</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Your interests.
            <br />
            <span className="bg-gradient-to-r from-primary to-violet bg-clip-text text-transparent">
              Working for you.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Orbit monitors the web 24/7 and surfaces jobs, internships and opportunities that match
            your actual goals.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          <Stat value={count.toLocaleString()} label="Opportunities tracked" live />
          <Stat value="12" label="Active queries" />
          <Stat value="24/7" label="Agent uptime" />
        </div>
      </section>

      {/* RIGHT */}
      <section className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Stepper */}
          <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
            <StepDot n={1} active={step === 1} done={step === 2} onClick={() => setStep(1)} />
            <div className="h-px flex-1 bg-border" />
            <StepDot n={2} active={step === 2} onClick={() => setStep(2)} />
          </div>

          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="font-display text-2xl font-bold">Import your AI history</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a ChatGPT JSON export — Orbit infers your interests automatically.
                </p>
              </div>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface/60 p-10 text-center interactive-glow",
                  dragOver && "border-primary glow-cyan-soft",
                )}
              >
                <Upload className="h-6 w-6 text-primary" />
                <div className="text-sm">
                  <span className="text-foreground">Drop conversations.json</span>
                  <span className="text-muted-foreground"> or click to browse</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  .json · max 50mb
                </span>
                <input type="file" accept="application/json" className="hidden" />
              </label>

              <button
                onClick={() => {
                  setManual(true);
                  setStep(2);
                }}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary"
              >
                or enter manually →
              </button>

              <button
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium interactive-glow"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {manual ? "Tell Orbit about you" : "Confirm your profile"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Press Enter to add a tag. You can edit any of this later.
                </p>
              </div>

              <Field label="Target Roles">
                <TagInput
                  value={profile.targetRoles}
                  onChange={(v) => setProfileState({ ...profile, targetRoles: v })}
                  placeholder="ML Engineer, Backend Intern…"
                />
              </Field>

              <Field label="Skills">
                <TagInput
                  value={profile.skills}
                  onChange={(v) => setProfileState({ ...profile, skills: v })}
                  placeholder="PyTorch, Go, React…"
                />
              </Field>

              <Field label="Preferred Locations">
                <TagInput
                  value={profile.locations}
                  onChange={(v) => setProfileState({ ...profile, locations: v })}
                  placeholder="Bangalore, Remote…"
                />
              </Field>

              <Field label="Experience Level">
                <Segmented
                  value={profile.experienceLevel}
                  options={["Internship", "Entry", "Mid"]}
                  onChange={(v) =>
                    setProfileState({ ...profile, experienceLevel: v as ExperienceLevel })
                  }
                />
              </Field>

              <Field label="Companies to Watch (optional)">
                <TagInput
                  value={profile.companies}
                  onChange={(v) => setProfileState({ ...profile, companies: v })}
                  placeholder="Anthropic, Razorpay…"
                />
              </Field>

              <button
                onClick={launch}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground interactive-glow hover:brightness-110"
              >
                Launch Orbit <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/dashboard"
                className="block text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                skip & explore demo →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, live }: { value: string; label: string; live?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface/50 p-3">
      <div
        className={cn(
          "font-mono text-xl font-bold tabular-nums text-foreground",
          live && "animate-ticker text-primary",
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function StepDot({
  n,
  active,
  done,
  onClick,
}: {
  n: number;
  active?: boolean;
  done?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs",
        active && "border-primary bg-primary/10 text-primary glow-cyan-soft",
        done && "border-success/50 bg-success/10 text-success",
        !active && !done && "border-border text-muted-foreground",
      )}
    >
      {n}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
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
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-md border border-border bg-input p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-sm px-3 py-1.5 text-xs transition",
            value === o
              ? "bg-primary text-primary-foreground glow-cyan-soft"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
