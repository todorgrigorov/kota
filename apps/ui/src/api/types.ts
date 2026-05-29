import type { Provider, Plan, Estimate } from '../types';

export type EstimateStatus =
  | 'draft'
  | 'submitted'
  | 'quote_available'
  | 'pending_approval'
  | 'finalised'
  | 'rejected'
  | 'expired';

export type ApprovalType = 'none' | 'manager_review';

export interface RawProvider {
  id: string;
  name: string;
  location: string;
  logo_url: string | null;
}

export interface RawProvidersResponse {
  items: RawProvider[];
}

export interface RawPlanOption {
  code: string;
  description: string | null;
  required: boolean;
  values: string[];
}

export interface RawPlanAddon {
  id: string;
  name: string;
  price_cents: number;
  currency: string;
}

export interface RawPlan {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  base_price_cents: number;
  currency: string;
  approval_type: ApprovalType;
  min_participants: number;
  lead_time_days: number;
  options: RawPlanOption[];
  addons: RawPlanAddon[];
}

export interface RawPlansResponse {
  items: RawPlan[];
}

export interface RawPricing {
  base: number;
  addons: number;
  total: number;
  currency: string;
}

export interface RawEstimate {
  id: string;
  status: EstimateStatus;
  plan: { id: string; name: string };
  selections: Record<string, string | string[]>;
  pricing: RawPricing;
  blocking_reasons: string[];
}

export interface UpdateEstimateInput {
  plan_id: string;
  selections: Record<string, string | string[]> & { addons: string[] };
}

export interface RawFinaliseEstimateResponse {
  id: string;
  status: EstimateStatus;
}

export interface Api {
  getProviders: () => Promise<Provider[]>;
  getPlans: (providerId: string) => Promise<Plan[]>;
  getEstimate: () => Promise<Estimate>;
  updateEstimate: (body: UpdateEstimateInput) => Promise<Estimate>;
  finaliseEstimate: () => Promise<RawFinaliseEstimateResponse>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
