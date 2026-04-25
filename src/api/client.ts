const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, data?: any) => request(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};