import { resolveOption } from './registry';
import { formatPrice } from '../utils';
import type { RawProvider, RawPlan, RawEstimate } from './types';
import type { Provider, Plan, Estimate } from '../types';

export function transformProvider(p: RawProvider): Provider {
  return {
    id: p.id,
    name: p.name,
    location: p.location || null,
    logoUrl: p.logo_url,
  };
}

export function transformPlan(p: RawPlan): Plan {
  return {
    id: p.id,
    providerId: p.provider_id,
    name: p.name,
    description: p.description,
    basePrice: formatPrice(p.base_price_cents, p.currency),
    approvalType: p.approval_type,
    minParticipants: p.min_participants,
    leadTimeDays: p.lead_time_days,
    options: p.options.map((o) => ({
      code: o.code,
      required: o.required,
      values: o.values,
      strategy: resolveOption(o.code, o.values),
    })),
    addons: p.addons.map((a) => ({
      id: a.id,
      name: a.name,
      price: formatPrice(a.price_cents, a.currency),
      free: a.price_cents === 0,
    })),
  };
}

export function transformEstimate(e: RawEstimate): Estimate {
  const optionSelections = Object.fromEntries(
    Object.entries(e.selections).filter(([k, v]) => k !== 'addons' && typeof v === 'string'),
  ) as Record<string, string>;

  const addonSelections = Array.isArray(e.selections.addons)
    ? (e.selections.addons as string[])
    : [];

  return {
    id: e.id,
    status: e.status,
    plan: e.plan,
    optionSelections,
    addonSelections,
    pricing: {
      base: formatPrice(e.pricing.base, e.pricing.currency),
      addons: formatPrice(e.pricing.addons, e.pricing.currency),
      total: formatPrice(e.pricing.total, e.pricing.currency),
    },
    blockingReasons: e.blocking_reasons,
  };
}
