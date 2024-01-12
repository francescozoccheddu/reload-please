# reload-please

Lightweight server and client script to trigger a browser page reload.

## Installation

Run:

```shell
npm i @francescozoccheddu/reload-please
```

## Usage

### Server

```javascript
import { Server } from "@francescozoccheddu/reload-please";

const server = new Server();
server.start();
// [...]
server.reload();
// [...]
server.stop();
```

### Client

```javascript
import { Client } from "@francescozoccheddu/reload-please";

const client = new Client();
client.start();
// [...]
client.stop();
```

> **Note**
You can also use `server.clientScript` or `getClientScript()` to inject the client code server-side, on the fly.

## Build

Run:

```shell
npm run build
```