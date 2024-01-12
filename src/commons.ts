export const defaultPort = 48351;

export function getWsUrl(port: number): string {
  ensureValidPort(port);
  return `ws://localhost:${port}/`;
}

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 2 ** 10 && port < 2 ** 16;
}

export function ensureValidPort(port: number): void {
  if (!isValidPort(port)) {
    throw new Error('Port outside valid integer range [1024,65535]');
  }
}

export const reloadMessageData: string = 'reload';