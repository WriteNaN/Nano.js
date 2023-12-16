import WS from "ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import EventEmitter from "events";

class WebSocket extends EventEmitter {
  #websocket: ReconnectingWebSocket;
  /** 
  * Opens websocket connection and listens for events
  * @param {string} url - The URL of the websocket server.
  */
  constructor(url: string){
    super();
    if (!url.startsWith("ws://") && !url.startsWith("wss://")) throw new Error("Invalid WS URL");
    this.#websocket = new ReconnectingWebSocket(url, [], {WebSocket: WS});
    this.#websocket.onerror = (error) => this.emit("error", error);
    this.#websocket.onclose = (event) => this.emit("close", event);
    this.#websocket.onopen = () => this.emit("ready");
    this.#websocket.onmessage = (event) => this.emit("message", JSON.parse(event.data));
  }

  send(json: Record<string, any>){
    this.#websocket.send(JSON.stringify(json));
  }
}

export default WebSocket;
