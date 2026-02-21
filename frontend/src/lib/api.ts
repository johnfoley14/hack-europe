import type { Initiative, CreateInitiativeData, CreatePledgeData, PledgeResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: string[]) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      data.error || 'An error occurred',
      data.errors
    );
  }

  return response.json();
}

export const api = {
  getInitiatives: (params?: { status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return fetchApi<Initiative[]>(`/initiatives${query ? `?${query}` : ''}`);
  },

  getInitiative: (id: string) =>
    fetchApi<Initiative>(`/initiatives/${id}`),

  createInitiative: (data: CreateInitiativeData) =>
    fetchApi<Initiative>('/initiatives', {
      method: 'POST',
      body: JSON.stringify({ initiative: data }),
    }),

  createPledge: (initiativeId: string, data: CreatePledgeData) =>
    fetchApi<PledgeResponse>(`/initiatives/${initiativeId}/pledges`, {
      method: 'POST',
      body: JSON.stringify({ pledge: data }),
    }),
};
