export function json(
  payload: unknown,
  init: Omit<ResponseInit, 'headers'> & {
    headers?: HeadersInit;
  } = {},
) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  });
}

export function notFound() {
  return json(
    {
      error: 'Not Found',
    },
    { status: 404 },
  );
}
