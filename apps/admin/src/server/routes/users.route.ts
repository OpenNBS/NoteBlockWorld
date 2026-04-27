import { json } from '@admin/http/json';
import type { ServiceContext } from '@admin/services/context';

function getLimit(url: URL) {
  const value = Number(url.searchParams.get('limit') ?? 20);
  if (Number.isNaN(value)) {
    return 20;
  }
  return Math.min(Math.max(value, 1), 100);
}

export async function handleUsersRequest(
  request: Request,
  context: ServiceContext,
) {
  if (request.method !== 'GET') {
    return json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const url = new URL(request.url);
  const limit = getLimit(url);
  const users = await context.models.users
    .find(
      {},
      { email: 1, username: 1, publicName: 1, creationDate: 1, lastSeen: 1 },
    )
    .sort({ creationDate: -1 })
    .limit(limit)
    .lean()
    .exec();

  return json({ data: users });
}
