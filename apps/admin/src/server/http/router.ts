import { notFound } from '@admin/http/json';
import { handleHealthRequest } from '@admin/routes/health.route';
import {
  handleDashboardStatsRequest,
  handleSongsRequest,
} from '@admin/routes/songs.route';
import { handleUsersRequest } from '@admin/routes/users.route';
import type { ServiceContext } from '@admin/services/context';

type RouteHandler = (
  request: Request,
  context: ServiceContext,
) => Promise<Response>;

const routeTable = new Map<string, RouteHandler>([
  ['/api/health', async (_request, context) => handleHealthRequest(context)],
  ['/api/users', handleUsersRequest],
  ['/api/songs', handleSongsRequest],
  ['/api/dashboard/stats', handleDashboardStatsRequest],
]);

export async function routeApiRequest(
  request: Request,
  context: ServiceContext,
): Promise<Response> {
  const url = new URL(request.url);
  const handler = routeTable.get(url.pathname);

  if (!handler) {
    return notFound();
  }

  return handler(request, context);
}
