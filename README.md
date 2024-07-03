# @cch137/websocket

The `@cch137/websocket` package provides an enhanced WebSocket implementation that extends the native WebSocket with additional features, such as event emitters and automatic reconnection. This package can be used in both the browser and Node.js environments.

## Installation

```bash
npm install @cch137/websocket
```

## Usage

The `WS` class extends the functionality of the native WebSocket, providing event emitters and automatic reconnection capabilities.

### Example

```typescript
import WS from "@cch137/websocket";

const ws = new WS("wss://example.com");

// Listen to the open event
ws.on("open", (event) => {
  console.log("WebSocket is open:", event);
});

// Listen to the message event
ws.on("message", (messageEvent) => {
  console.log("Message received:", messageEvent.data);
});

// Listen to the close event
ws.on("close", (closeEvent) => {
  console.log("WebSocket is closed:", closeEvent);
});

// Send a message
ws.send("Hello, WebSocket!");

// Close the connection
ws.close();
```

## Features

- **Event Emitters**: Use `on`, `off`, and `emit` methods to handle WebSocket events (`open`, `message`, `error`, `close`, `reopen`).
- **Automatic Reconnection**: Automatically reconnects when the connection is closed unintentionally.
- **Compatibility**: Works in both browser and Node.js environments.

### Event Handling

The `WS` class uses an event emitter to handle WebSocket events. The following events are supported:

- `open`: Emitted when the WebSocket connection is opened.
- `reopen`: Emitted when the WebSocket connection is reopened after a disconnection.
- `message`: Emitted when a message is received from the server.
- `error`: Emitted when an error occurs with the WebSocket.
- `close`: Emitted when the WebSocket connection is closed.

### Reconnection

The `WS` class automatically reconnects when the WebSocket connection is closed unintentionally. You can use the `reconnecting` property to check if the WebSocket is currently reconnecting.

### Properties

The `WS` class extends the native WebSocket properties and adds the following:

- `reconnecting`: A boolean indicating if the WebSocket is currently reconnecting.

### Methods

The `WS` class provides the following methods:

- `send(data: string | ArrayBufferLike | Blob | ArrayBufferView)`: Sends data through the WebSocket connection.
- `close(code?: number, reason?: string)`: Closes the WebSocket connection.
- `open(force = false)`: Opens the WebSocket connection. If `force` is `true`, it will close any existing connection before opening a new one.
