import send from 'koa-send';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const directory = resolve(__dirname, './dist');
const prefix = '/control';

export default async (ctx, next) => {
  if (!ctx.url.startsWith(prefix)) return await next();
  const path = ctx.path.substring(prefix.length) || '/';
  try {
    await staticServe(ctx, path);
  } catch (e) {
    if (e.status === 404) {
      await next();
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