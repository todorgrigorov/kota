import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Container, Stepper, Alert } from '@mantine/core';
import { useEstimate } from '../../hooks/use-estimate';
import { ProviderPlanStep, ConfigureStep, ReviewStep } from './components';
import { STRINGS } from './strings';
import { ROUTES } from '../../router';
import { WizardStep } from './types';
import type { Api } from '../../api/types';
import type { Plan } from '../../types';

export interface WizardPageProps {
  api: Api;
}

export default function WizardPage({ api }: WizardPageProps) {
  const navigate = useNavigate();
  const { estimate, isLoading, isError, update, isUpdating, finalise, isFinalising } =
    useEstimate(api);
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.SelectPlan);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!estimate) {
      return;
    }
    if (estimate.status !== 'draft') {
      navigate({ to: ROUTES.status });
    }
  }, [estimate, navigate]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentStep]);

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, WizardStep.Review) as WizardStep);
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, WizardStep.SelectPlan) as WizardStep);
  }, []);

  const handleSelectPlan = useCallback(
    async (plan: Plan) => {
      await update({ plan_id: plan.id, selections: { addons: [] } });
      setSelectedPlan(plan);
      goNext();
    },
    [update, goNext],
  );

  const handleFinalise = useCallback(async () => {
    await finalise();
    navigate({ to: ROUTES.status });
  }, [finalise, navigate]);

  if (isLoading) {
    return null;
  }
  if (isError) {
    return <Alert color="red">{STRINGS.estimate.loadError}</Alert>;
  }

  return (
    <Container size="md" py="xl">
      <Stepper active={currentStep} mb="xl">
        <Stepper.Step label={STRINGS.steps.selectPlan} />
        <Stepper.Step label={STRINGS.steps.configure} />
        <Stepper.Step label={STRINGS.steps.review} />
      </Stepper>

      {currentStep === WizardStep.SelectPlan && (
        <ProviderPlanStep
          api={api}
          currentPlanId={estimate?.plan.id}
          onSelect={handleSelectPlan}
        />
      )}
      {currentStep === WizardStep.Configure && selectedPlan && estimate && (
        <ConfigureStep
          plan={selectedPlan}
          estimate={estimate}
          isUpdating={isUpdating}
          onUpdate={update}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {currentStep === WizardStep.Review && selectedPlan && estimate && (
        <ReviewStep
          plan={selectedPlan}
          estimate={estimate}
          isFinalising={isFinalising}
          onFinalise={handleFinalise}
          onBack={goBack}
        />
      )}
    </Container>
  );
}
