// localStorage helpers for Orbit

export type ExperienceLevel = "Internship" | "Entry" | "Mid";

export interface Profile {
  targetRoles: string[];
  skills: string[];
  locations: string[];
  experienceLevel: ExperienceLevel;
  companies: string[];
  onboarded: boolean;
}

export interface Settings {
  frequency: "6h" | "12h" | "24h";
  minScore: number;
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  emailEnabled: boolean;
  email: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time";
  remote: boolean;
  score: number;
  reason: string;
  query: string;
  postedAt: string; // ISO
  url: string;
}

const KEYS = {
  profile: "orbit:profile",
  settings: "orbit:settings",
  dismissed: "orbit:dismissed",
} as const;

export const defaultProfile: Profile = {
  targetRoles: [],
  skills: [],
  locations: [],
  experienceLevel: "Internship",
  companies: [],
  onboarded: false,
};

export const defaultSettings: Settings = {
  frequency: "12h",
  minScore: 6,
  telegramEnabled: false,
  telegramBotToken: "",
  telegramChatId: "",
  emailEnabled: false,
  email: "",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const getProfile = () => read<Profile>(KEYS.profile, defaultProfile);
export const setProfile = (p: Profile) => write(KEYS.profile, p);

export const getSettings = () => read<Settings>(KEYS.settings, defaultSettings);
export const setSettings = (s: Settings) => write(KEYS.settings, s);

export const getDismissed = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.dismissed) || "[]");
  } catch {
    return [];
  }
};
export const setDismissed = (ids: string[]) => write(KEYS.dismissed, ids);

export const resetAll = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.profile);
  localStorage.removeItem(KEYS.settings);
  localStorage.removeItem(KEYS.dismissed);
};
