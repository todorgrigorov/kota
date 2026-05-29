import { describe, it, expect } from 'vitest';
import { transformProvider, transformPlan, transformEstimate } from './transforms';
import type { RawProvider, RawPlan, RawEstimate } from './types';

const baseRawPlan: RawPlan = {
  id: 'plan_1',
  provider_id: 'prov_1',
  name: 'Test Plan',
  description: 'A plan',
  base_price_cents: 70000,
  currency: 'EUR',
  approval_type: 'none',
  min_participants: 10,
  lead_time_days: 7,
  options: [],
  addons: [],
};

const baseRawEstimate: RawEstimate = {
  id: 'est_1',
  status: 'draft',
  plan: { id: 'plan_1', name: 'Test Plan' },
  selections: { addons: [] },
  pricing: { base: 70000, addons: 0, total: 70000, currency: 'EUR' },
  blocking_reasons: [],
};

describe('transformProvider', () => {
  it('maps empty location string to null', () => {
    const raw: RawProvider = { id: 'p1', name: 'Venue', location: '', logo_url: null };
    expect(transformProvider(raw).location).toBeNull();
  });

  it('maps null logo_url through as null', () => {
    const raw: RawProvider = { id: 'p1', name: 'Venue', location: 'Berlin', logo_url: null };
    expect(transformProvider(raw).logoUrl).toBeNull();
  });

  it('preserves valid location and logo_url', () => {
    const raw: RawProvider = {
      id: 'p1',
      name: 'Venue',
      location: 'Berlin',
      logo_url: 'https://example.com/logo.svg',
    };
    const result = transformProvider(raw);
    expect(result.location).toBe('Berlin');
    expect(result.logoUrl).toBe('https://example.com/logo.svg');
  });
});

describe('transformPlan', () => {
  it('marks addon with zero price as free', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      addons: [{ id: 'addon_free', name: 'Free Thing', price_cents: 0, currency: 'EUR' }],
    };
    const plan = transformPlan(raw);
    expect(plan.addons[0].free).toBe(true);
    expect(plan.addons[0].price).toContain('0');
  });

  it('marks addon with non-zero price as not free', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      addons: [{ id: 'addon_paid', name: 'Paid Thing', price_cents: 15000, currency: 'EUR' }],
    };
    expect(transformPlan(raw).addons[0].free).toBe(false);
  });

  it('renders single-value option as readonly', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      options: [
        { code: 'catering_license_tier', description: null, required: true, values: ['tier_3'] },
      ],
    };
    expect(transformPlan(raw).options[0].strategy.control).toBe('readonly');
  });

  it('renders unknown option code with humanized fallback label', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      options: [
        { code: 'some_unknown_field', description: null, required: false, values: ['a', 'b'] },
      ],
    };
    expect(transformPlan(raw).options[0].strategy.label).toBe('Some Unknown Field');
  });

  it('sorts required options before optional ones', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      options: [
        { code: 'optional_field', description: null, required: false, values: ['a', 'b'] },
        { code: 'required_field', description: null, required: true, values: ['x', 'y'] },
      ],
    };
    const options = transformPlan(raw).options;
    expect(options[0].required).toBe(true);
    expect(options[1].required).toBe(false);
  });

  it('renders option with >4 values as select', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      options: [
        {
          code: 'unknown_many',
          description: null,
          required: false,
          values: ['a', 'b', 'c', 'd', 'e'],
        },
      ],
    };
    expect(transformPlan(raw).options[0].strategy.control).toBe('select');
  });

  it('handles numeric-looking string option values', () => {
    const raw: RawPlan = {
      ...baseRawPlan,
      options: [
        { code: 'priority_level', description: null, required: false, values: ['1', '2', '3'] },
      ],
    };
    const option = transformPlan(raw).options[0];
    expect(option.values).toEqual(['1', '2', '3']);
    expect(option.strategy.valueLabels?.['1']).toBe('Standard');
  });
});

describe('transformEstimate', () => {
  it('splits option selections and addon selections', () => {
    const raw: RawEstimate = {
      ...baseRawEstimate,
      selections: { seating_type: 'open', addons: ['addon_1'] },
    };
    const estimate = transformEstimate(raw);
    expect(estimate.optionSelections).toEqual({ seating_type: 'open' });
    expect(estimate.addonSelections).toEqual(['addon_1']);
  });

  it('defaults addonSelections to empty array when missing', () => {
    const raw: RawEstimate = {
      ...baseRawEstimate,
      selections: { seating_type: 'open' },
    };
    expect(transformEstimate(raw).addonSelections).toEqual([]);
  });

  it('formats pricing fields as non-empty strings containing the currency', () => {
    const estimate = transformEstimate(baseRawEstimate);
    expect(estimate.pricing.base).toMatch(/700/);
    expect(estimate.pricing.addons).toMatch(/0/);
    expect(estimate.pricing.total).toMatch(/700/);
    expect(estimate.pricing.base).toContain('€');
  });

  it('maps status to full status object with label', () => {
    const estimate = transformEstimate({ ...baseRawEstimate, status: 'pending_approval' });
    expect(estimate.status.id).toBe('pending_approval');
    expect(estimate.status.label).toBe('Pending Approval');
    expect(estimate.status.color).toBe('orange');
  });
});
