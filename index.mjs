import send from 'koa-send';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const directory = resolve(__dirname, './dist');

export default async (ctx, next) => {
  if (!ctx.url.startsWith('/control')) return await next();
  const path = ctx.path.substring(2) || '/';
  try {
    await staticServe(ctx, path);
  } catch (e) {
    if (e.status === 404) {
      await staticServe(ctx, '/');
    } else {
      throw e;
    }
  }
}

function staticServe(ctx, path, maxAge = 24 * 60 * 60 * 1000) {
  return send(ctx, path, {
    root: directory,
    index: 'index.html',
    gzip: true,
    maxAge,
  })
}