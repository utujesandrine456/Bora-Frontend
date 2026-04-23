/**
 * localJobsStore.ts
 *
 * Manages locally-stored jobs in browser localStorage.
 * Used as a fallback/supplement when the backend returns no data
 * or doesn't immediately reflect a newly created job.
 */

const STORAGE_KEY = 'bora_local_jobs';

export interface LocalJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  description: string;
  skills: string[];
  requirements: string[];
  experienceYears: number;
  createdAt: string;
  updatedAt: string;
  _isLocal: boolean; // Flag to distinguish from backend jobs
}

/** Read all local jobs */
export const getLocalJobs = (): LocalJob[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Save a new job to local store */
export const saveLocalJob = (job: Omit<LocalJob, '_isLocal'>): LocalJob => {
  const localJob: LocalJob = { ...job, _isLocal: true };
  const existing = getLocalJobs();

  // De-duplicate: if same id already exists, update it
  const withoutOld = existing.filter(j => j.id !== localJob.id);
  const updated = [localJob, ...withoutOld];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return localJob;
};

/** Merge API jobs with local jobs — local jobs fill in gaps not returned by server */
export const mergeWithLocalJobs = (apiJobs: any[]): any[] => {
  const localJobs = getLocalJobs();
  if (!localJobs.length) return apiJobs;

  // Build a set of IDs already returned by the API
  const apiIds = new Set(apiJobs.map(j => j._id || j.id));

  // Build a set of 'Title|Company' keys for backend jobs to identify content duplicates
  const apiKeys = new Set(apiJobs.map(j => `${j.title}|${j.company}`.toLowerCase()));

  // Only include local jobs that:
  // 1. Are NOT already in the API response by ID
  // 2. Are NOT already in the API response by Title|Company (prevents sync overlap)
  const missingLocal = localJobs.filter(lj => {
    const isIdDuplicate = apiIds.has(lj.id);
    const isContentDuplicate = apiKeys.has(`${lj.title}|${lj.company}`.toLowerCase());
    return !isIdDuplicate && !isContentDuplicate;
  });

  // Merge: API jobs first (authoritative), then missing local ones
  return [...apiJobs, ...missingLocal];
};

/** Remove a job from local store by ID (e.g. once confirmed on server) */
export const removeLocalJob = (id: string): void => {
  if (typeof window === 'undefined') return;
  const existing = getLocalJobs().filter(j => j.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

/** Clear all locally stored jobs */
export const clearLocalJobs = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
