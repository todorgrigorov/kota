import { humanize } from '../utils';

export type OptionControl = 'radio' | 'select' | 'readonly';

export interface OptionRenderStrategy {
  label: string;
  control: OptionControl;
  valueLabels?: Record<string, string>;
}

const OPTION_REGISTRY: Record<string, OptionRenderStrategy> = {
  seating_type: {
    label: 'Seating Type',
    control: 'radio',
    valueLabels: { open: 'Open', reserved: 'Reserved' },
  },
  food_package: {
    label: 'Food Package',
    control: 'select',
    valueLabels: {
      none: 'No Food',
      light: 'Light Catering',
      full: 'Full Catering',
    },
  },
  date_flex_window_days: {
    label: 'Date Flexibility',
    control: 'select',
    valueLabels: { '0': 'Fixed date', '7': '±7 days', '30': '±30 days' },
  },
  priority_level: {
    label: 'Priority Level',
    control: 'select',
    valueLabels: { '1': 'Standard', '2': 'Priority', '3': 'Premium' },
  },
};

export function resolveOption(code: string, values: string[]): OptionRenderStrategy {
  if (code in OPTION_REGISTRY) {
    return OPTION_REGISTRY[code];
  }

  return {
    label: humanize(code),
    control: values.length === 1 ? 'readonly' : values.length > 4 ? 'select' : 'radio',
    valueLabels: Object.fromEntries(values.map((v) => [v, humanize(v)])),
  };
}
