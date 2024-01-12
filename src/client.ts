import { ensureValidPort, getWsUrl, reloadMessageData } from './commons';

export class Client {

  readonly port: number;
  private ws: WebSocket | null;
  private repairTask: ReturnType<typeof setInterval> | null;

  constructor(port: number) {
    ensureValidPort(port);
    this.port = port;
    this.ws = null;
    this.repairTask = null;
  }

  private get isOpenOrOpening(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING;
  }

  private repair(): void {
    if (this.running && !this.isOpenOrOpening) {
      this.stop();
      this.start();
    }
    else if (this.repairTask !== null) {
      clearInterval(this.repairTask);
    }
  }

  private scheduleRepair(): void {
    if (this.repairTask === null) {
      this.repairTask = setInterval(() => this.repair(), 1000);
    }
  }

  start(): void {
    if (!this.ws) {
      this.ws = new WebSocket(getWsUrl(this.port));
      this.ws.addEventListener('close', () => this.scheduleRepair());
      this.ws.addEventListener('error', () => this.scheduleRepair());
      this.ws.addEventListener('message', e => {
        if (e.data !== reloadMessageData) {
          console.warn('Received unexpected data from websocket');
          return;
        }
        console.log('Reloading');
        window.location.reload();
      });
    }
  }

  stop(): void {
    this.ws?.close();
    if (this.repairTask) {
      clearInterval(this.repairTask);
    }
    this.repairTask = null;
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

}
