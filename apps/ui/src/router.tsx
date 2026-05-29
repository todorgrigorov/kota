import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import WizardPage from './pages/wizard';
import StatusPage from './pages/status';
import { api } from './api/client';

export const ROUTES = {
  wizard: '/',
  status: '/status',
} as const;

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const wizardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.wizard,
  component: () => <WizardPage api={api} />,
});

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.status,
  component: () => <StatusPage api={api} />,
});

const routeTree = rootRoute.addChildren([wizardRoute, statusRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
