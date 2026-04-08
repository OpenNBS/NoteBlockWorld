import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const nbsvisAssetsRoot = path.resolve(
  process.cwd(),
  '../../node_modules/@opennbs/nbsvis/dist/assets',
);

const contentTypeByExt: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
};

export async function GET(
  _: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await context.params;

  if (!parts?.length) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const relativePath = parts.join('/');
  const fullPath = path.resolve(nbsvisAssetsRoot, relativePath);

  // Prevent path traversal outside the package asset directory.
  if (!fullPath.startsWith(nbsvisAssetsRoot + path.sep)) {
    return NextResponse.json({ error: 'Invalid asset path' }, { status: 400 });
  }

  try {
    const file = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentTypeByExt[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }
}
