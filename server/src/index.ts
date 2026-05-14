import { App } from 'uWebSockets.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TICK_RATE, PROTOCOL_VERSION } from '@br/shared';

const CLIENT_DIR = join(__dirname, '../../client');

function serveFile(res: any, filePath: string, contentType: string) {
  let aborted = false;
  res.onAborted(() => { aborted = true; });
  try {
    const body = readFileSync(filePath);
    if (!aborted) {
      res.writeHeader('Content-Type', contentType).end(body);
    }
  } catch {
    if (!aborted) res.writeStatus('404').end('Not found');
  }
}

App()
  .ws<Record<string, never>>('/game', {
    open(_ws) {
      console.log('[server] client connected');
    },
    message(_ws, _msg, _isBinary) {
      // populated in Step 3+
    },
    close(_ws, code) {
      console.log(`[server] client disconnected (${code})`);
    },
  })
  .get('/', (res) => serveFile(res, join(CLIENT_DIR, 'index.html'), 'text/html'))
  .get('/dist/bundle.js', (res) => serveFile(res, join(CLIENT_DIR, 'dist/bundle.js'), 'application/javascript'))
  .listen(3000, (token) => {
    if (!token) { console.error('[server] failed to bind port 3000'); process.exit(1); }
    console.log(`[server] :3000 — protocol v${PROTOCOL_VERSION}, ${TICK_RATE}Hz`);
  });
