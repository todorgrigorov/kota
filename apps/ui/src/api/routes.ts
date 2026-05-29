export const ROUTES = {
  providers: '/providers',
  plans: (providerId: string) => `/plans?provider_id=${providerId}`,
  estimate: '/estimate',
  finalise: '/estimate/finalise',
} as const;
