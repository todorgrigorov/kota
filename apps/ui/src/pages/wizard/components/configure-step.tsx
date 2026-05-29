import { useState, useCallback } from 'react';
import { Stack, Title, Checkbox, Group, Text, Button, Divider, Alert, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { OptionField } from '.';
import { STRINGS } from '../strings';
import type { Plan, Estimate, Option, Addon } from '../../../types';
import type { UpdateEstimateParams } from '../../../hooks/use-estimate';

interface OptionsSectionProps {
  options: Option[];
  selections: Record<string, string>;
  onChange: (code: string, value: string | null) => void;
}

function OptionsSection({ options, selections, onChange }: OptionsSectionProps) {
  if (options.length === 0) {
    return null;
  }
  return (
    <Stack gap="lg">
      <Text fw={600}>{STRINGS.configure.optionsHeading}</Text>
      {options.map((option) => (
        <OptionField
          key={option.code}
          option={option}
          value={selections[option.code]}
          onChange={(value) => onChange(option.code, value)}
        />
      ))}
    </Stack>
  );
}

interface AddonsSectionProps {
  addons: Addon[];
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
}

function AddonsSection({ addons, selected, onToggle }: AddonsSectionProps) {
  if (addons.length === 0) {
    return null;
  }
  return (
    <Stack gap="md">
      <Text fw={600}>{STRINGS.configure.addonsHeading}</Text>
      {addons.map((addon) => (
        <Group key={addon.id} justify="space-between">
          <Checkbox
            label={addon.name}
            checked={selected.includes(addon.id)}
            onChange={(e) => onToggle(addon.id, e.currentTarget.checked)}
            styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
          />
          {addon.free ? (
            <Badge color="green" variant="light">
              {STRINGS.configure.free}
            </Badge>
          ) : (
            <Text size="sm">{addon.price}</Text>
          )}
        </Group>
      ))}
    </Stack>
  );
}

interface PricingSummaryProps {
  total: string;
  isUpdating: boolean;
}

function PricingSummary({ total, isUpdating }: PricingSummaryProps) {
  return (
    <Group justify="space-between">
      <Text fw={600}>{STRINGS.configure.totalLabel}</Text>
      <Text
        fw={700}
        size="lg"
        c={isUpdating ? 'dimmed' : undefined}
        aria-live="polite"
        aria-atomic="true"
      >
        {total}
      </Text>
    </Group>
  );
}

export interface ConfigureStepProps {
  plan: Plan;
  estimate: Estimate;
  isUpdating: boolean;
  onUpdate: (params: UpdateEstimateParams) => Promise<unknown>;
  onNext: () => void;
  onBack: () => void;
}

export default function ConfigureStep({
  plan,
  estimate,
  isUpdating,
  onUpdate,
  onNext,
  onBack,
}: ConfigureStepProps) {
  const [options, setOptions] = useState(estimate.optionSelections);
  const [addons, setAddons] = useState(estimate.addonSelections);

  const handleOptionChange = useCallback(
    async (code: string, value: string | null) => {
      const next = { ...options };
      if (value === null) {
        delete next[code];
      } else {
        next[code] = value;
      }
      setOptions(next);
      try {
        await onUpdate({ plan, selections: { ...next, addons } });
      } catch {
        notifications.show({ message: STRINGS.configure.saveError, color: 'red' });
      }
    },
    [options, addons, plan.id, onUpdate],
  );

  const handleAddonToggle = useCallback(
    async (id: string, checked: boolean) => {
      const next = checked ? [...addons, id] : addons.filter((a) => a !== id);
      setAddons(next);
      try {
        await onUpdate({ plan, selections: { ...options, addons: next } });
      } catch {
        notifications.show({ message: STRINGS.configure.saveError, color: 'red' });
      }
    },
    [addons, options, plan.id, onUpdate],
  );

  return (
    <Stack gap="xl">
      <Title order={2} tabIndex={-1}>
        {plan.name}
      </Title>
      {plan.options.length === 0 && plan.addons.length === 0 ? (
        <Alert color="gray">{STRINGS.configure.empty}</Alert>
      ) : (
        <>
          <OptionsSection options={plan.options} selections={options} onChange={handleOptionChange} />
          {plan.options.length > 0 && plan.addons.length > 0 && <Divider />}
          <AddonsSection addons={plan.addons} selected={addons} onToggle={handleAddonToggle} />
        </>
      )}
      <Divider />
      <PricingSummary total={estimate.pricing.total} isUpdating={isUpdating} />
      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          {STRINGS.configure.back}
        </Button>
        <Button onClick={onNext} disabled={isUpdating}>
          {STRINGS.configure.next}
        </Button>
      </Group>
    </Stack>
  );
}
