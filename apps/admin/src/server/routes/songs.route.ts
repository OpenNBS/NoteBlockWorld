import { json } from '@admin/http/json';
import type { ServiceContext } from '@admin/services/context';
import { BROWSER_SONGS } from '@nbw/config';

function getLimit(url: URL) {
  const value = Number(
    url.searchParams.get('limit') ?? BROWSER_SONGS.featuredPageSize,
  );
  if (Number.isNaN(value)) {
    return BROWSER_SONGS.featuredPageSize;
  }
  return Math.min(Math.max(value, 1), 100);
}

export async function handleSongsRequest(
  request: Request,
  context: ServiceContext,
) {
  if (request.method !== 'GET') {
    return json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const url = new URL(request.url);
  const limit = getLimit(url);

  const songs = await context.models.songs
    .find(
      {},
      { title: 1, uploader: 1, visibility: 1, category: 1, createdAt: 1 },
    )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  return json({ data: songs });
}

export async function handleDashboardStatsRequest(
  request: Request,
  context: ServiceContext,
) {
  if (request.method !== 'GET') {
    return json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const [userCount, songCount] = await Promise.all([
    context.models.users.countDocuments().exec(),
    context.models.songs.countDocuments().exec(),
  ]);

  return json({
    data: {
      userCount,
      songCount,
    },
  });
}
