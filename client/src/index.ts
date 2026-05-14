import { TICK_RATE, PROTOCOL_VERSION } from '@br/shared';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function drawStatus(msg: string, color = '#ffffff') {
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = '18px monospace';
  ctx.fillText(msg, 20, 40);
  ctx.fillStyle = '#555555';
  ctx.fillText(`protocol v${PROTOCOL_VERSION} | server tick ${TICK_RATE}Hz`, 20, 70);
}

drawStatus('Connecting…', '#888888');

const ws = new WebSocket(`ws://${location.host}/game`);

ws.onopen = () => {
  console.log('[client] connected to server');
  drawStatus('Connected to Strafe server ✓', '#00ff88');
};

ws.onclose = (e) => {
  console.log(`[client] disconnected (${e.code})`);
  drawStatus(`Disconnected (${e.code})`, '#ff4444');
};

ws.onerror = () => {
  console.error('[client] websocket error');
  drawStatus('Connection error', '#ff4444');
};
