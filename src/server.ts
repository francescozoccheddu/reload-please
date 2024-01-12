import { WebSocket, WebSocketServer } from 'ws';

import { defaultPort, ensureValidPort, getWsUrl, reloadMessageData } from './commons';

export class Server {

  readonly port: number;
  private ws: WebSocketServer | null;

  constructor(port: number = defaultPort) {
    ensureValidPort(port);
    this.port = port;
    this.ws = null;
  }

  start(): void {
    if (!this.ws) {
      this.ws = new WebSocketServer({
        port: this.port,
      });
    }
  }

  stop(): void {
    this.ws?.clients.forEach(ws => ws?.terminate());
    this.ws?.close();
    this.ws = null;
  }

  get running(): boolean {
    return this.ws !== null;
  }

  set running(running: boolean) {
    if (running) {
      this.start();
    }
    else {
      this.stop();
    }
  }

  reload(): void {
    if (!this.running) {
      throw new Error('Not running');
    }
    this.ws!.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(reloadMessageData, { binary: false });
      }
    });
  }

  get clientScript(): string {
    return getClientScript(this.port);
  }

}

export function getClientScript(port: number = defaultPort): string {
  ensureValidPort(port);
  return `
    ((function() {
      const ws = new WebSocket(${JSON.stringify(getWsUrl(port))});
      ws.addEventListener('message', e => {
        if (e.data !== ${JSON.stringify(reloadMessageData)}) {
          console.warn('Received unexpected data from websocket');
          return;
        }
        console.log('Reloading');
        window.location.reload();
      });
    })());
  `;
}