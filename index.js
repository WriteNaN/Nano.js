const { InvoiceBuilder } = require("./lib");

const invoice = new InvoiceBuilder({
    useRaw: false,
    liveUpdate: true,
    rpcEndpoint: 'https://proxy.nanos.cc/proxy',
    wsEndpoint: 'wss://nanoslo.0x.no/websocket',
});