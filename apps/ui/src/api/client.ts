import { ROUTES } from './routes';
import { transformProvider, transformPlan, transformEstimate } from './transforms';
import type {
  Api,
  RawProvidersResponse,
  RawPlansResponse,
  RawEstimate,
  UpdateEstimateInput,
  RawFinaliseEstimateResponse,
} from './types';
import { ApiError } from './types';

const BASE = '/api';

async function request<T>(path: string, init?: { method?: string; body?: string }): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.error?.code ?? 'unknown',
      data.error?.message ?? 'Unknown error',
    );
  }
  return data as T;
}

export const api: Api = {
  getProviders: async () => {
    const raw = await request<RawProvidersResponse>(ROUTES.providers);
    return raw.items.map(transformProvider);
  },
  getPlans: async (providerId) => {
    const raw = await request<RawPlansResponse>(ROUTES.plans(providerId));
    return raw.items.map(transformPlan);
  },
  getEstimate: async () => {
    const raw = await request<RawEstimate>(ROUTES.estimate);
    return transformEstimate(raw);
  },
  updateEstimate: async (body: UpdateEstimateInput) => {
    const raw = await request<RawEstimate>(ROUTES.estimate, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return transformEstimate(raw);
  },
  finaliseEstimate: () => request<RawFinaliseEstimateResponse>(ROUTES.finalise, { method: 'POST' }),
};
