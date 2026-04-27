import { json } from '@admin/http/json';
import type { ServiceContext } from '@admin/services/context';

export async function handleHealthRequest(context: ServiceContext) {
  return json({
    ok: true,
    uptimeMs: Date.now() - context.startedAt,
    env: context.env.NODE_ENV,
  });
}
