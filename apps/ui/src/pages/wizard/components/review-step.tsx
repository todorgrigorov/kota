import { Stack, Title, Text, Group, Button, Alert, Divider } from '@mantine/core';
import { STRINGS } from '../strings';
import type { Plan, Estimate } from '../../../types';

interface SelectionsSummaryProps {
  plan: Plan;
  estimate: Estimate;
}

function SelectionsSummary({ plan, estimate }: SelectionsSummaryProps) {
  const selectedAddons = plan.addons.filter((a) => estimate.addonSelections.includes(a.id));

  return (
    <Stack gap="sm">
      <Text fw={600}>{STRINGS.review.summaryHeading}</Text>
      <Text fw={500}>{plan.name}</Text>
      {plan.options.map((option) => {
        const value = estimate.optionSelections[option.code];
        if (!value) {
          return null;
        }
        const label = option.strategy.valueLabels?.[value] ?? value;
        return (
          <Group key={option.code} justify="space-between">
            <Text size="sm" c="dimmed">
              {option.strategy.label}
            </Text>
            <Text size="sm">{label}</Text>
          </Group>
        );
      })}
      {selectedAddons.map((addon) => (
        <Group key={addon.id} justify="space-between">
          <Text size="sm" c="dimmed">
            {addon.name}
          </Text>
          <Text size="sm">{addon.free ? STRINGS.configure.free : addon.price}</Text>
        </Group>
      ))}
    </Stack>
  );
}

interface PricingBreakdownProps {
  plan: Plan;
  estimate: Estimate;
}

function PricingBreakdown({ plan, estimate }: PricingBreakdownProps) {
  return (
    <Stack gap="sm">
      <Text fw={600}>{STRINGS.review.pricingHeading}</Text>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {STRINGS.review.basePrice}
        </Text>
        <Text size="sm">{plan.basePrice}</Text>
      </Group>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {STRINGS.review.addons}
        </Text>
        <Text size="sm">{estimate.pricing.addons}</Text>
      </Group>
      <Divider />
      <Group justify="space-between">
        <Text fw={600}>{STRINGS.review.total}</Text>
        <Text fw={700} size="lg">
          {estimate.pricing.total}
        </Text>
      </Group>
    </Stack>
  );
}

export interface ReviewStepProps {
  plan: Plan;
  estimate: Estimate;
  isFinalising: boolean;
  onFinalise: () => Promise<unknown>;
  onBack: () => void;
}

export default function ReviewStep({
  plan,
  estimate,
  isFinalising,
  onFinalise,
  onBack,
}: ReviewStepProps) {
  return (
    <Stack gap="xl">
      <Title order={2} tabIndex={-1}>
        {STRINGS.review.heading}
      </Title>
      <SelectionsSummary plan={plan} estimate={estimate} />
      {estimate.blockingReasons.length > 0 && (
        <Alert color="red" title={STRINGS.review.blockersTitle}>
          <Stack component="ul" gap="xs" style={{ margin: 0 }}>
            {estimate.blockingReasons.map((reason) => (
              <Text component="li" key={reason} size="sm">
                {reason}
              </Text>
            ))}
          </Stack>
        </Alert>
      )}
      <Divider />
      <PricingBreakdown plan={plan} estimate={estimate} />
      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          {STRINGS.review.back}
        </Button>
        <Button
          onClick={onFinalise}
          loading={isFinalising}
          disabled={estimate.blockingReasons.length > 0}
        >
          {STRINGS.review.submit}
        </Button>
      </Group>
    </Stack>
  );
}
