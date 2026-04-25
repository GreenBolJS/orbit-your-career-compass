import { api } from './client';
import type { JobMatch } from '@/lib/storage';

export async function getMatches(): Promise<JobMatch[]> {
  return api.get('/matches');
}

export async function dismissMatch(id: string): Promise<void> {
  return api.post(`/matches/dismiss/${id}`);
}

export async function clearMatches(): Promise<void> {
  return api.delete('/matches/clear');
}