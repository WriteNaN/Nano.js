# Nano.js

Table of contents
=================

<!--ts-->
**Table of Contents**
- [Nano.js](#nanojs)
  - [Introduction](#introduction)
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
  - [Credits](#credits)
<!--te-->

### Introduction
> Nano.js is a comprehensive JavaScript library for interacting with the Nano cryptocurrency.

### Wallet Functions
> consists of block functions, websocket, rpc, privacy addons and an embedded database for storing wallet state 

##### the program is completely written with security first in mind, if you find any flaws or want to report a bug, feel free to open a github issue.


### To Fellow Explorers
##### ~a module could easily be extracted from it for devs to easily interact with the nano blockchain, and you're welcome! just dont forget to credit me :3~ Edit: I made it a module for you :D

## Example Usage
![image](https://github.com/WriteNaN/Nano.js/assets/151211283/488a79af-a022-42b0-9b34-d15a53f63be9)

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


### Credits

Much thanks to them who helped me with libs:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/22433963?v=4" width="75px;"/><br /><sub>Benskalz</sub>](http://www.nanswap.com)<br />[💻](https://github.com/Benskalz/simple-nano-wallet-js) | [<img src="https://avatars.githubusercontent.com/u/6938280?v=4" width="75px;"/><br /><sub>Numsu</sub>](http://github.com/numsu)<br />[💻](https://github.com/numsu/nanocurrency-web-js) | [<img src="https://avatars.githubusercontent.com/u/990773?v=4" width="75px;"/><br /><sub>Marvin Roger</sub>](https://github.com/marvinroger)<br />[💻](https://github.com/marvinroger/nanocurrency-js/) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

*special thanks to [nanswap nodes](https://nanswap.com/nodes) for letting me use their nodes! <3*

> &copy; Celio Sevii 2024, you are free to use it for commercial products :D
