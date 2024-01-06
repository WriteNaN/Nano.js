##### Integrate nano to your service today!
<div style="text-align: center;">
  <h1><img src="https://cdn.discordapp.com/emojis/876897668373307392.webp?size=48&quality=lossless" style="vertical-align: middle;" /> Nano.js </h1>
  <p>Interact with the nano blockchain using javascript easily! 🔥</p>
</div>


<img src="https://github.com/WriteNaN/Nano.js/assets/151211283/3b1f8f24-64c5-4919-a95b-9684a5938c46" style="border-radius: 20px;" />



Table of contents
=================

<!--ts-->
**Table of Contents**
- [Nano.js](#integrate-nano-to-your-service-today)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Building From Source](#building)
  - [Wallet Functions](#wallet-functions)
  - [Example Usage](#example-usage)
  - [Documentation](#documentation)
    - [Wallet Class](#wallet-class)
      - [Initialize Wallet](#initialize-wallet)
      - [Manage Accounts](#manage-accounts)
        - [Get All Accounts](#get-all-accounts)
        - [Add an Account](#add-an-account)
        - [Remove an Account](#remove-an-account)
        - [Get an Account](#get-an-account)
      - [Transaction Operations](#transaction-operations)
        - [Send Nano](#send-nano)
        - [Set Representative](#set-representative)
      - [Reset Wallet](#reset-wallet)
     - [Receive Nano](#receiving-nano)
     - [Events](#wallet-events)
    - [Invoice Class](#creating-invoices)
      - [Invoice Builder](#invoice-builder)
      - [Creating Invoices](#creating-invoices)
      - [Retrieve Invoice](#retrieving-invoices)
      - [Check Status](#fetch-status)
      - [Remove Invoice](#remove-invoice)
      - [Invoice Events](#invoice-events)
    - [Creating QRs](#creating-qrs)
    - [Using RPC Directly](#rpc-usage)
      - [Constructor](#rpc-constructor)
      - [Account Info](#account-info)
      - [Generate Work](#work-generate)
      - [Receivable](#receivable)
      - [Process](#process)
      - [Custom Call](#custom-call)
    - [Using WS Directly](#ws-usage)
      - [Constructor](#ws-constructor)
      - [Send WS](#send-to-ws)
      - [WS Events](#ws-events)
    - [Converting Units](#converting-units)
  - [Credits](#credits)
<!--te-->

### Introduction
> Nano.js is a comprehensive JavaScript library for interacting with the Nano cryptocurrency.

### Installation
```python
npm i @nano.gift/nano.js --save
```

### Building
run the following commands, lib would have build
```python
git clone https://github.com/WriteNaN/Nano.js.git
npm i
npm run build
```

### Wallet Functions
> consists of block functions, websocket, rpc, privacy addons and an embedded database for storing wallet state 

##### the program is completely written with security first in mind, if you find any flaws or want to report a bug, feel free to open a github issue.


### To Fellow Explorers
##### ~a module could easily be extracted from it for devs to easily interact with the nano blockchain, and you're welcome! just dont forget to credit me :3~ Edit: I made it a module for you :D

## Example Usage
![image](https://github.com/WriteNaN/Nano.js/assets/151211283/3ea2ac66-57f4-4ae6-9c58-03b12017125a)


## Documentation
### Wallet Class
#### Initialize Wallet
```javascript
const wallet = new Wallet(masterSeed, {
  WS_URL: string,
  RPC_URL: string,
  WORK_SERVER?: string,
  Headers?: Record<string, any>,
  autoReceive?: boolean,
});
```
- masterSeed (string): The master seed for deriving Nano accounts.
- WS_URL (string): WebSocket URL for Nano blockchain interaction.
- RPC_URL (string): RPC URL for Nano blockchain interaction.
- WORK_SERVER (string, optional): Work server URL for generating proof-of-work.
- Headers (Record<string, any>, optional): Headers for authentication.
- autoReceive (boolean, optional): Set to true for automatic handling of received transactions.

### Manage Accounts
note: index is an integer which is used to derive the account from the master key.
#### Get All Accounts
```javascript
const allAccounts = wallet.getAllAccounts();
```
#### Add an Account
```javascript
const newAccount = wallet.addAccount(index);
```
#### Remove an Account
```javascript
wallet.removeAccount(index);
```
#### Get an Account
```javascript
const accountDetails = wallet.getAccount(index);
```

### Transaction Operations
#### Send Nano
```javascript
const sendHash = await wallet.send({
  recipient: string,
  amount: number,
  from: number,
  isRaw?: boolean,
});
```
#### Set Representative
```javascript
const representativeResult = await wallet.setRepresentative({
  newRepresentative: string,
  accountIndex: number,
});
```
### Reset Wallet
```javascript
wallet.resetWallet();
```
⚠️ this function removes all db files and config

## Receiving Nano
Single Block
```javascript
const received = await wallet.Block().receive({hash, amount}, privateKey);
```
All Transactions
```javascript
const allArrayReceived = await wallet.Block().receiveAll(privateKey);
```

#### Wallet Events
```javascript
wallet.once("ready", () => callback); // emitted upon wallet initialization
wallet.on("receive/send/representative", (hash) => console.log(hash.hash); 
```

### Creating Invoices
#### Invoice Builder 
```javascript
const invoice = new InvoiceBuilder({
  useRaw: false, // raw nano values
  liveUpdate: true, // uses websocket
  rpcEndpoint: "nano_rpc_url",
  wsEndpoint?: "Websocket url if you\'re using it",
  customHeaders: { /* add your custom headers if needed */ },
  maxHistory: "50", // this is the history calls to check if ws is disabled
});
```
you initialize your invoice builder class here and can further use our functions
#### Creating Invoices
```javascript
const newInvoice = invoice.create(options: {
recipientAddress: "the address to receive nano on",
amountNano: amount,
label?: string,
message?: message,
roundingPercent: integer
});
```
- label and message are optional values for the QRCode
- roundingPercent is the % you are okay at neglecting if the sender makes a small percent difference in payment, i would suggest setting it to zero if you are creating multiple invoices on same address

@ returns invoice ID

#### Retrieving Invoices
```javascript
const invoiceData = invoice.get(newInvoiceId);

// returns:
{
  id: 'invoice id',
  data: {
    uri: 'nano:<address>?amount=<raw>&label=if?&message=if?',
    qrCode: QRBUFFER,
    address: '<address>',
    amount: '<raw>',
    label?: string,
    message?: string,
    roundingPercent: integer,
    status: 'waiting',
    invoiceId: 'invoice id'
  }
}
```
#### Fetch Status
```javascript
await invoice.checkStatus(invoiceID);
```
returns null if not found, satisfies payment and returns paid object if received
#### Remove Invoice
```javascript
invoice.remove(invoiceID);
```
invoices stay in memory as in a map, remove them through this function.
#### Invoice Events
```javascript
invoice.on("payment", (invoiceData) => {
  console.log("Payment received:", invoiceData); // payment done on $invoiceID
});

invoice.on("error", (errorDetails) => {
  console.error("Error:", errorDetails); // eg: already paid
});
```
payment events are only available if liveUpdate is enabled and a valid nano ws uri is inputted in the `InvoiceBuilder` constructor

### Creating QRs
```javascript
const qrResult = await createQr({
  address: "address",
  amount: integer, 
  label: "Example Label",
  message: "Example Message",
  isRaw: false, // Set to true if the amount is already in raw
});
```
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
  <div style="flex: 1;">
    <p>@returns uri (nano protocol standard url) and qrCode (buffer), here is an example:</p>
  </div>
  <div style="flex: 1; text-align: right;">
    <img src="https://github.com/WriteNaN/Nano.js/assets/151211283/7d49dcb4-a223-460d-84c3-bc85aca1facb" alt="QR Code" />
    <p style="text-align: left">PLEASE DONT SEND ANY NANO HERE IT IS AN EXAMPLE QR!</p>
  </div>
</div>

### RPC Usage
#### RPC Constructor
```javascript
const rpc = new RPC(RPC_URL = "nano rpc url", customHeaders: Record, WORK_URL? = "rpc url used if not found");
```
#### Account Info
```javascript
await rpc.account_info(address);
```
#### Work Generate
```javascript
await rpc.generate_work(hash);
```
#### Receivable
```javascript
await rpc.receivable(address);
```
#### Process
```javascript
await rpc.process();
```
this is used to publish signed blocks to the blockchain through the node
#### Custom Call
```javascript
await rpc.request({
"action",
...params
});
```
this method can be used to invoke any available rpc function, please refer to official rpc docs [here](https://docs.nano.org/commands/rpc-protocol/) to find available rpc commands

### WS Usage
#### WS Constructor
```javascript
const ws = new WebSocket(ws_url: string)
```
#### Send To Ws
check params which are available to use [here](https://docs.nano.org/integration-guides/websockets/)
```javascript
ws.send(json)
```
#### WS Events
```javascript
ws.on("ready", () => console.log("socket opened");
ws.on("error", (error) => console.log("socket exitted with error," e);
ws.on("close", (event) => console.log("ws closed") // reconnects by default
ws.on("message", (message) => console.log(`received message from socket ${message});
```

### Converting Units
here is an example code to convert between raw and nano
```javascript
const toRaw = nanoToRaw(3); // 3000000000000000000000000000000
const toNano = nanoToRaw(3); // 0.000000000000000000000000000003
```

### Credits

Much thanks to them who helped me with libs:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/22433963?v=4" width="75px;"/><br /><sub>Benskalz</sub>](http://www.nanswap.com)<br />[💻](https://github.com/Benskalz/simple-nano-wallet-js) | [<img src="https://avatars.githubusercontent.com/u/6938280?v=4" width="75px;"/><br /><sub>Numsu</sub>](http://github.com/numsu)<br />[💻](https://github.com/numsu/nanocurrency-web-js) | [<img src="https://avatars.githubusercontent.com/u/990773?v=4" width="75px;"/><br /><sub>Marvin Roger</sub>](https://github.com/marvinroger)<br />[💻](https://github.com/marvinroger/nanocurrency-js/) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

*special thanks to [nanswap nodes](https://nanswap.com/nodes) for letting me use their nodes! <3*

> &copy; Celio Sevii 2024, you are free to use it for commercial products :D
