import { api } from './client';
import type { Profile } from '@/lib/storage';

export async function getProfile(): Promise<Profile> {
  return api.get('/profile');
}

export async function saveProfile(data: Partial<Profile>): Promise<void> {
  return api.post('/profile', data);
}