import { Stack, Title, Text, Alert, Group, Badge, Card, Container } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useEstimate } from '../../hooks/use-estimate';
import { ROUTES } from '../../router';
import { STRINGS } from './strings';
import type { Api } from '../../api/types';

export interface StatusPageProps {
  api: Api;
}

export default function StatusPage({ api }: StatusPageProps) {
  const navigate = useNavigate();
  const { estimate, isLoading } = useEstimate(api);

  useEffect(() => {
    if (!estimate) {
      return;
    }
    if (estimate.status.id === 'draft') {
      navigate({ to: ROUTES.wizard });
    }
  }, [estimate, navigate]);

  if (isLoading || !estimate || estimate.status.id === 'draft') {
    return null;
  }

  return (
    <Container size="sm" py="xl">
      <Card withBorder padding="xl" radius="md">
        <Stack gap="xl">
          <Group justify="space-between">
            <Title order={2}>{estimate.plan.name}</Title>
            <Badge color={estimate.status.color}>{estimate.status.title}</Badge>
          </Group>

          <Alert color={estimate.status.color} title={estimate.status.title}>
            {estimate.status.body}
          </Alert>

          <Group justify="space-between">
            <Text c="dimmed">{STRINGS.total}</Text>
            <Text fw={700} size="xl">
              {estimate.pricing.total}
            </Text>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
