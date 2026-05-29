import { useState, useEffect } from 'react';
import { Tabs, SimpleGrid, Card, Group, Text, Badge, Button, Avatar } from '@mantine/core';
import { useProviders } from '../../../hooks/use-providers';
import { usePlans } from '../../../hooks/use-plans';
import { STRINGS } from '../strings';
import type { Api } from '../../../api/types';
import type { Plan } from '../../../types';

export interface ProviderPlanStepProps {
  api: Api;
  currentPlanId?: string;
  onSelect: (plan: Plan) => void;
}

export default function ProviderPlanStep({ api, currentPlanId, onSelect }: ProviderPlanStepProps) {
  const { providers, isLoading, isError } = useProviders(api);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const providerId = activeProvider ?? providers[0]?.id ?? null;
  const { plans, isLoading: plansLoading } = usePlans(api, providerId);

  if (isLoading) {
    return null;
  }
  if (isError) {
    return <Text c="red">{STRINGS.providers.loadError}</Text>;
  }
  if (providers.length === 0) {
    return <Text c="dimmed">{STRINGS.providers.empty}</Text>;
  }

  return (
    <Tabs value={providerId} onChange={(v) => v && setActiveProvider(v)}>
      <Tabs.List mb="lg">
        {providers.map((p) => (
          <Tabs.Tab
            key={p.id}
            value={p.id}
            leftSection={
              <Avatar src={p.logoUrl} size={20} radius="sm">
                {p.name[0]}
              </Avatar>
            }
          >
            {p.name}
            {p.location && (
              <Text span size="xs" c="dimmed" ml={4}>
                ({p.location})
              </Text>
            )}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {providers.map((p) => (
        <Tabs.Panel key={p.id} value={p.id}>
          {plansLoading ? null : plans.length === 0 ? (
            <Text c="dimmed">{STRINGS.plans.empty}</Text>
          ) : (
            <SimpleGrid cols={2}>
              {plans.map((plan) => (
                <Card key={plan.id} withBorder padding="lg">
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>{plan.name}</Text>
                    {plan.approvalType === 'manager_review' && (
                      <Badge color="orange">{STRINGS.plans.requiresApproval}</Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {plan.description}
                  </Text>
                  <Text size="xl" fw={700} mb="xs">
                    {plan.basePrice}
                  </Text>
                  <Group gap={4} mb="md">
                    <Text size="xs" c="dimmed">
                      {STRINGS.plans.minParticipants(plan.minParticipants)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ·
                    </Text>
                    <Text size="xs" c="dimmed">
                      {STRINGS.plans.leadTime(plan.leadTimeDays)}
                    </Text>
                  </Group>
                  <Button
                    fullWidth
                    autoFocus={plan.id === currentPlanId}
                    variant={plan.id === currentPlanId ? 'filled' : 'outline'}
                    onClick={() => onSelect(plan)}
                  >
                    {plan.id === currentPlanId ? STRINGS.plans.selected : STRINGS.plans.select}
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
