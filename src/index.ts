import Emitter from "@cch137/emitter";

export default class WS
  extends Emitter<{
    open: [Event];
    reopen: [Event];
    message: [MessageEvent];
    error: [Event];
    close: [CloseEvent];
  }>
  implements WebSocket
{
  static readonly CONNECTING = WebSocket.CONNECTING;
  static readonly OPEN = WebSocket.OPEN;
  static readonly CLOSING = WebSocket.CLOSING;
  static readonly CLOSED = WebSocket.CLOSED;

  readonly CONNECTING = WS.CONNECTING;
  readonly OPEN = WS.OPEN;
  readonly CLOSING = WS.CLOSING;
  readonly CLOSED = WS.CLOSED;

  addEventListener = this.on;
  removeEventListener = this.off;
  dispatchEvent(event: Event) {
    // @ts-ignore
    return this.emit(event.type, event);
  }

  get url(): Readonly<string> {
    return this.current.url;
  }
  get protocol(): Readonly<string> {
    return this.current.protocol;
  }
  get readyState() {
    return this.current?.readyState;
  }
  get extensions(): Readonly<string> {
    return this.current.extensions;
  }
  get binaryType(): BinaryType {
    return this.current.binaryType;
  }
  set binaryType(value) {
    this.current.binaryType = value;
  }
  get bufferedAmount(): Readonly<number> {
    return this.current.bufferedAmount;
  }

  get onopen() {
    return this.current.onopen;
  }
  set onopen(value) {
    this.onopen = value;
  }
  get onmessage() {
    return this.current.onmessage;
  }
  set onmessage(value) {
    this.onmessage = value;
  }
  get onerror() {
    return this.current.onerror;
  }
  set onerror(value) {
    this.onerror = value;
  }
  get onclose() {
    return this.current.onclose;
  }
  set onclose(value) {
    this.onclose = value;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.current.send(data);
  }

  private _reconnecting = false;

  get reconnecting() {
    return this._reconnecting;
  }

  private closedByClient = false;

  close(code?: number, reason?: string) {
    this.closedByClient = true;
    this.current.close(code, reason);
  }

  private current!: WebSocket;

  open(force = false) {
    if (this.readyState !== this.CLOSED) {
      if (force) this.current.close();
      else throw new Error("Cannot reopen an unclosed WebSocket");
    }
    this.closedByClient = false;
    const { onopen, onmessage, onerror, onclose } = this.current || {};
    const ws = new WebSocket(this._url, this._protocols);
    if (onopen) ws.onopen = onopen;
    if (onmessage) ws.onmessage = onmessage;
    if (onerror) ws.onerror = onerror;
    if (onclose) ws.onclose = onclose;
    ws.addEventListener("open", (e) => {
      this.emit("open", e);
      if (!this._reconnecting) return;
      this._reconnecting = false;
      this.emit("reopen", e);
    });
    ws.addEventListener("message", (e) => this.emit("message", e));
    ws.addEventListener("error", (e) => this.emit("error", e));
    ws.addEventListener("close", (e) => {
      this.emit("close", e);
      if (this.closedByClient) {
        this._reconnecting = true;
        this.open();
      } else {
        this._reconnecting = false;
      }
    });
    this.current = ws;
  }

  readonly _url: string | URL;
  readonly _protocols?: string | string[];

  constructor(url: string | URL, protocols?: string | string[]) {
    super();
    this._url = url;
    this._protocols = protocols;
    this.open();
  }
}
