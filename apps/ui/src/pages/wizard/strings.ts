export const STRINGS = {
  steps: {
    selectPlan: 'Select Plan',
    configure: 'Configure',
    review: 'Review',
  },
  providers: {
    loadError: 'Failed to load venues.',
    empty: 'No venues available at this time.',
  },
  plans: {
    empty: 'No plans available for this venue.',
    requiresApproval: 'Requires Approval',
    minParticipants: (n: number) => `Min. ${n} participants`,
    leadTime: (n: number) => `${n} days lead time`,
    select: 'Select',
    selected: 'Selected',
  },
  estimate: {
    loadError: 'Failed to load. Please refresh.',
  },
  review: {
    heading: 'Review your order',
    summaryHeading: 'Your selection',
    pricingHeading: 'Pricing',
    basePrice: 'Base price',
    addons: 'Add-ons',
    total: 'Total',
    blockersTitle: 'Please resolve the following before submitting:',
    back: 'Back',
    submit: 'Submit',
  },
  options: {
    selectPlaceholder: 'Select...',
    readonlyDisclaimer: 'This option is fixed for the selected plan.',
  },
  configure: {
    optionsHeading: 'Options',
    addonsHeading: 'Add-ons',
    free: 'Free',
    totalLabel: 'Total',
    saveError: 'Changes could not be saved. Please try again.',
    empty: 'This plan has no configurable options or add-ons.',
    back: 'Back',
    next: 'Next',
  },
};
