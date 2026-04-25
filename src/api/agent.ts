import { api } from './client';

export async function runAgent(): Promise<void> {
  return api.post('/run-agent');
}

export async function getHealth(): Promise<{ status: string }> {
  return api.get('/health');
}