import { Stack, Title, Text, Alert, Group, Badge } from '@mantine/core';
import { useEstimate } from '../../hooks/use-estimate';
import { STRINGS } from './strings';
import type { Api } from '../../api/types';
import type { EstimateStatus } from '../../types';

const STATUS_CONFIG: Record<EstimateStatus, { color: string; title: string; body: string } | null> =
  {
    pending_approval: {
      color: 'orange',
      title: STRINGS.pendingApproval.title,
      body: STRINGS.pendingApproval.body,
    },
    finalised: { color: 'green', title: STRINGS.finalised.title, body: STRINGS.finalised.body },
    rejected: { color: 'red', title: STRINGS.rejected.title, body: STRINGS.rejected.body },
    expired: { color: 'gray', title: STRINGS.expired.title, body: STRINGS.expired.body },
    draft: null,
    submitted: null,
    quote_available: null,
  };

export interface StatusPageProps {
  api: Api;
}

export default function StatusPage({ api }: StatusPageProps) {
  const { estimate, isLoading } = useEstimate(api);
  if (isLoading || !estimate) {
    return null;
  }
  const config = STATUS_CONFIG[estimate.status];

  return (
    <Stack gap="xl">
      <Group>
        <Title order={2}>{estimate.plan.name}</Title>
        <Badge color={config?.color ?? 'gray'}>{estimate.status}</Badge>
      </Group>

      {config && (
        <Alert color={config.color} title={config.title}>
          {config.body}
        </Alert>
      )}

      <Group justify="space-between">
        <Text c="dimmed">{STRINGS.total}</Text>
        <Text fw={700} size="xl">
          {estimate.pricing.total}
        </Text>
      </Group>
    </Stack>
  );
}
