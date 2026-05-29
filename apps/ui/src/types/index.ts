import type { OptionRenderStrategy } from '../api/registry';
import type { ApprovalType, RawEstimateStatus } from '../api/types';

export type { ApprovalType };

export interface Provider {
  id: string;
  name: string;
  location: string | null;
  logoUrl: string | null;
}

export interface Addon {
  id: string;
  name: string;
  price: string;
  free: boolean;
}

export interface Option {
  code: string;
  required: boolean;
  values: string[];
  strategy: OptionRenderStrategy;
}

export interface Plan {
  id: string;
  providerId: string;
  name: string;
  description: string;
  basePrice: string;
  approvalType: ApprovalType;
  minParticipants: number;
  leadTimeDays: number;
  options: Option[];
  addons: Addon[];
}

export interface Pricing {
  base: string;
  addons: string;
  total: string;
}

export interface EstimateStatus {
  id: RawEstimateStatus;
  label: string;
  color: string;
  title?: string;
  body?: string;
}

export interface Estimate {
  id: string;
  status: EstimateStatus;
  plan: { id: string; name: string };
  optionSelections: Record<string, string>;
  addonSelections: string[];
  pricing: Pricing;
  blockingReasons: string[];
}
