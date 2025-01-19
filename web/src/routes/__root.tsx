import { User } from '@/types/types.gen';
import { UseQueryResult } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

interface RouterContext {
  auth: UseQueryResult<void | User | null, unknown>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});
