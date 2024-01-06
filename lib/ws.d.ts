/// <reference types="node" />
import EventEmitter from "events";
declare class WebSocket extends EventEmitter {
    #private;
    /**
    * Opens websocket connection and listens for events
    * @param {string} url - The URL of the websocket server.
    */
    constructor(url: string);
    send(json: Record<string, any>): void;
}
export default WebSocket;
