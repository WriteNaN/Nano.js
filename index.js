'use strict';

var fetch$1 = fetch;
var WS = require('ws');
var ReconnectingWebSocket = require('reconnecting-websocket');
var EventEmitter = require('events');
var Database = require('better-sqlite3');
var path = require('path');
var crypto = require('crypto');
var goodbye = require('graceful-goodbye');
var uuid = require('uuid');
var fs = require('fs');
var url = require('url');
var multiNanoWeb = require('multi-nano-web');
var nanocurrency = require('nanocurrency');
var BigNumber = require('bignumber.js');
var fs$1 = require('fs/promises');
var axios = require('axios');
var canvas = require('canvas');
var jsdom = require('jsdom');
var qrcode = require('qrcode-generator');
var Decimal = require('decimal.js');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/**

* Thanks to https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/ - adapted to use with typescript

*/
class RPC {
    rpcURL;
    worURL;
    headerAuth;
    /**
    * Initializes the RPC client for blockchain queries.
    * @param {string} RPC_URL - The URL of the RPC endpoint.
    * @param {string} WORK_URL - The URL of the work server used to generate work; falls back to RPC if not provided.
    * @param {Record<string, any>} customHeaders - Optional headers for authentication.
    */
    constructor(RPC_URL, customHeaders = {}, WORK_URL) {
        this.rpcURL = RPC_URL;
        this.worURL = WORK_URL || RPC_URL;
        this.headerAuth = customHeaders;
    }
    async account_info(account) {
        const params = {
            action: "account_info",
            account,
            representative: "true"
        };
        return this.req(params);
    }
    async work_generate(hash) {
        const params = {
            action: "work_generate",
            hash,
        };
        const r = await this.req(params);
        if (!r.work) {
            throw new Error(`work_generate failed on ${this.worURL}: ${JSON.stringify(r)}`);
        }
        return r.work;
    }
    async receivable(account) {
        const params = {
            action: "pending",
            account,
            threshold: "1",
        };
        const r = await this.req(params);
        return r.blocks || [];
    }
    async getAccountHistory(account) {
        const params = {
            action: "account_history",
            account,
            count: "2"
        };
        const r = await this.req(params);
        return r.history || [];
    }
    async process(block, subtype) {
        const params = {
            action: "process",
            json_block: "true",
            subtype,
            block
        };
        return this.req(params);
    }
    async req(params) {
        const url = params.action === "work_generate" ? this.worURL : this.rpcURL;
        try {
            const response = await fetch$1(url, {
                method: "POST",
                headers: {
                    ...this.headerAuth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC error: ${error.message}`);
            }
            else {
                throw new Error(`RPC error: ${error}`);
            }
        }
    }
}

class WebSocket extends EventEmitter {
    #websocket;
    /**
    * Opens websocket connection and listens for events
    * @param {string} url - The URL of the websocket server.
    */
    constructor(url) {
        super();
        if (!url.startsWith("ws://") && !url.startsWith("wss://"))
            throw new Error("Invalid WS URL");
        this.#websocket = new ReconnectingWebSocket(url, [], { WebSocket: WS });
        this.#websocket.onerror = (error) => this.emit("error", error);
        this.#websocket.onclose = (event) => this.emit("close", event);
        this.#websocket.onopen = () => this.emit("ready");
        this.#websocket.onmessage = (event) => this.emit("message", JSON.parse(event.data));
    }
    send(json) {
        this.#websocket.send(JSON.stringify(json));
    }
}

/**

* better-sqlite3 embedded localstorage

*/
const __filename$2 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('bundle.js', document.baseURI).href)));
const __dirname$2 = path.dirname(__filename$2);
class WalletStorage {
    encryptionKey;
    db;
    db_path;
    db_init_path;
    constructor(encryptionKey) {
        this.encryptionKey = encryptionKey;
        this.db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(encryptionKey).digest("hex"), "salt", 16).toString("hex");
        this.db_path = path.join(__dirname$2, 'sqlite', `${this.db_init_path}.sqlite`);
        fs.mkdirSync(path.dirname(this.db_path), { recursive: true });
        if (!fs.existsSync(this.db_path))
            fs.writeFileSync(this.db_path, '');
        this.db = new Database(this.db_path);
        this.initialize();
        goodbye(async () => {
            console.log("gracefully closed wallet connection");
            this.closeConnection();
        });
    }
    initialize() {
        try {
            //db.exec('ALTER TABLE accounts ADD COLUMN address TEXT;'); debug
            this.db.exec(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        keys BLOB,
        _id TEXT,
        _index INTEGER
      );`);
            //console.log('Database initialized.');
        }
        catch (error) {
            console.error('Error initializing database:', error);
            process.exit(1);
        }
    }
    addAccount(account) {
        try {
            const _id = uuid.v4();
            const encryptedKeys = this.encryptData(JSON.stringify(account.keys));
            const stmt = this.db.prepare('INSERT INTO accounts (_id, address, keys, _index) VALUES (?, ?, ?, ?)');
            stmt.run(_id, account.address, encryptedKeys, account._index);
            return _id;
        }
        catch (error) {
            console.error('Error adding account:', error);
            return '';
        }
    }
    getAccount(accountId) {
        try {
            const stmt = this.db.prepare('SELECT * FROM accounts WHERE _id = ?');
            const account = stmt.get(accountId);
            if (account) {
                account.keys = JSON.parse(this.decryptData(account.keys));
                return account;
            }
            return null;
        }
        catch (error) {
            console.error('Error getting account:', error);
            return null;
        }
    }
    getAccountByAddress(address) {
        try {
            const stmt = this.db.prepare('SELECT * FROM accounts WHERE address = ?');
            const account = stmt.get(address);
            if (account) {
                account.keys = JSON.parse(this.decryptData(account.keys));
                return account;
            }
            return null;
        }
        catch (error) {
            console.error('Error getting account by address:', error);
            return null;
        }
    }
    getAccountByIndex(index) {
        try {
            const stmt = this.db.prepare('SELECT * FROM accounts WHERE _index = ?');
            const account = stmt.get(index);
            if (account) {
                account.keys = JSON.parse(this.decryptData(account.keys));
                return account;
            }
            return null;
        }
        catch (error) {
            console.error('Error getting account by address:', error);
            return null;
        }
    }
    removeAccountByAddress(address) {
        try {
            const stmt = this.db.prepare('DELETE FROM accounts WHERE address = ?');
            stmt.run(address);
        }
        catch (error) {
            console.error('Error removing account by address:', error);
        }
    }
    getAllAccounts() {
        try {
            const stmt = this.db.prepare('SELECT * FROM accounts');
            return stmt.all().map((account) => ({
                ...account,
                keys: JSON.parse(this.decryptData(account.keys)),
            }));
        }
        catch (error) {
            console.error('Error getting all accounts:', error);
            return [];
        }
    }
    resetWallet() {
        try {
            this.db.exec('DROP TABLE IF EXISTS accounts');
            console.log('Cleaned db');
            this.db.exec(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT,
        keys BLOB,
        _id TEXT,
        _index INTEGER
      );`);
        }
        catch (error) {
            console.error('Error deleting entire wallet:', error);
        }
    }
    closeConnection() {
        try {
            this.db.close();
            //console.log('Database connection closed.');
        }
        catch (error) {
            console.error('Error closing database connection:', error);
        }
    }
    encryptData(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return Buffer.concat([iv, Buffer.from(encrypted, 'hex')]);
    }
    decryptData(encryptedData) {
        const iv = encryptedData.subarray(0, 16);
        const actualEncryptedData = encryptedData.subarray(16);
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
        let decrypted = decipher.update(actualEncryptedData.toString('hex'), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    generateKey(pass) {
        const key = crypto.scryptSync(pass, Buffer.from(crypto.createHash('sha512').update(pass).digest('hex')).subarray(0, 16), 32);
        return key;
    }
}
class Account {
    id;
    address;
    _index;
    keys;
    constructor({ address, keys, _index, }) {
        this.address = address;
        this.keys = keys;
        this._index = _index;
    }
}

function nanoToRaw(amount, decimal = 30) {
    let value = new BigNumber(amount.toString());
    return value.shiftedBy(decimal).toFixed(0);
}
function rawToNano(amount, decimal = 30) {
    let value = new BigNumber(amount.toString());
    return value.shiftedBy(-(decimal)).toFixed(decimal, 1);
}

/**

* credits to my bro [Benskalz](https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/wallet.js) to help me with this <3

*/
class Block {
    rpc;
    amount;
    constructor(rpc) {
        this.rpc = rpc;
    }
    async send(toAddress, amount, privateKey, isRaw = false) {
        if (isRaw) {
            this.amount = amount;
            const publicKey = nanocurrency.derivePublicKey(privateKey);
            const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
            const account_info = await this.rpc.account_info(address);
            if (account_info.error)
                throw new Error("Error from RPC", account_info.error);
            const data = {
                walletBalanceRaw: account_info.balance,
                fromAddress: address,
                toAddress,
                representativeAddress: account_info.representative,
                amountRaw: this.amount.toString(),
                frontier: account_info.frontier,
                work: await this.rpc.work_generate(account_info.frontier),
            };
            const signedBlock = multiNanoWeb.block.send(data, privateKey);
            return await this.rpc.process(signedBlock);
        }
        else {
            this.amount = parseInt(nanoToRaw(amount));
            const publicKey = nanocurrency.derivePublicKey(privateKey);
            const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
            const account_info = await this.rpc.account_info(address);
            if (account_info.error)
                throw new Error("Error from RPC", account_info.error);
            const data = {
                walletBalanceRaw: account_info.balance,
                fromAddress: address,
                toAddress,
                representativeAddress: account_info.representative,
                amountRaw: this.amount.toString(),
                frontier: account_info.frontier,
                work: await this.rpc.work_generate(account_info.frontier),
            };
            const signedBlock = multiNanoWeb.block.send(data, privateKey);
            return await this.rpc.process(signedBlock);
        }
    }
    async representative(repAddress, privateKey) {
        const publicKey = nanocurrency.derivePublicKey(privateKey);
        const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
        const account_info = await this.rpc.account_info(address);
        if (account_info.error === "Account not found")
            throw new Error("Account has to be opened before changing representative!");
        const toSign = {
            walletBalanceRaw: account_info.balance,
            representativeAddress: repAddress,
            address,
            frontier: account_info.frontier,
            work: await this.rpc.work_generate(account_info.frontier)
        };
        const signedBlock = multiNanoWeb.block.representative(toSign, privateKey);
        return await this.rpc.process(signedBlock);
    }
    async receive(pendingTx, privateKey, openRep = "nano_1gmor8qytb6os131yriu3xwt6a8wukaos3eg9yfno1x5kpm6uwgowqix89cq") {
        const publicKey = nanocurrency.derivePublicKey(privateKey);
        const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
        const account_info = await this.rpc.account_info(address);
        let data = {
            toAddress: address,
            transactionHash: pendingTx.hash,
            amountRaw: pendingTx.amount.toString(),
            walletBalanceRaw: "0",
            frontier: "0",
            representativeAddress: openRep,
        };
        if (account_info.error === "Account not found") {
            //console.log("proceeding to open acc");
            data.walletBalanceRaw = "0";
            data.representativeAddress = openRep;
            data.frontier = "0".repeat(64);
            data.work = await this.rpc.work_generate(publicKey);
        }
        else {
            data.walletBalanceRaw = account_info.balance;
            data.representativeAddress = account_info.representative;
            data.frontier = account_info.frontier;
            data.work = await this.rpc.work_generate(account_info.frontier);
        }
        const signedBlock = multiNanoWeb.block.receive(data, privateKey);
        let r = await this.rpc.process(signedBlock, "receive");
        return r;
    }
    async receiveAll(privateKey) {
        const publicKey = nanocurrency.derivePublicKey(privateKey);
        const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
        const done = [];
        while (true) {
            const receivable = await this.rpc.receivable(address);
            if (Object.keys(receivable).length === 0)
                break;
            const transaction = {
                hash: Object.keys(receivable)[0],
                amount: receivable[Object.keys(receivable)[0]]
            };
            try {
                const result = await this.receive(transaction, privateKey);
                done.push(result);
            }
            catch (error) {
                throw error;
            }
        }
        return done;
    }
}

function deriveAccount(masterSeed, index) {
    const seed = crypto.scryptSync(masterSeed, "salt", 32).toString("hex");
    const privateKey = nanocurrency.deriveSecretKey(seed, index);
    const publicKey = nanocurrency.derivePublicKey(privateKey);
    const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
    return {
        address,
        keys: {
            privateKey,
            publicKey
        },
        _index: index
    };
}

var modes = {
    numeric: "Numeric",
    alphanumeric: "Alphanumeric",
    byte: "Byte",
    kanji: "Kanji"
};

function getMode(data) {
    switch (true) {
        case /^[0-9]*$/.test(data):
            return modes.numeric;
        case /^[0-9A-Z $%*+\-./:]*$/.test(data):
            return modes.alphanumeric;
        default:
            return modes.byte;
    }
}

const isObject = (obj) => !!obj && typeof obj === "object" && !Array.isArray(obj);
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source === undefined || !isObject(target) || !isObject(source))
        return target;
    target = { ...target };
    Object.keys(source).forEach((key) => {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = sourceValue;
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return mergeDeep(target, ...sources);
}

async function downloadURI(uri, name) {
    const resp = await axios.get(uri);
    //console.log(Buffer.from(resp.data));
    return Buffer.from(resp.data);
}

function calculateImageSize({ originalHeight, originalWidth, maxHiddenDots, maxHiddenAxisDots, dotSize }) {
    const hideDots = { x: 0, y: 0 };
    const imageSize = { x: 0, y: 0 };
    if (originalHeight <= 0 || originalWidth <= 0 || maxHiddenDots <= 0 || dotSize <= 0) {
        return {
            height: 0,
            width: 0,
            hideYDots: 0,
            hideXDots: 0
        };
    }
    const k = originalHeight / originalWidth;
    //Getting the maximum possible axis hidden dots
    hideDots.x = Math.floor(Math.sqrt(maxHiddenDots / k));
    //The count of hidden dot's can't be less than 1
    if (hideDots.x <= 0)
        hideDots.x = 1;
    //Check the limit of the maximum allowed axis hidden dots
    if (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.x)
        hideDots.x = maxHiddenAxisDots;
    //The count of dots should be odd
    if (hideDots.x % 2 === 0)
        hideDots.x--;
    imageSize.x = hideDots.x * dotSize;
    //Calculate opposite axis hidden dots based on axis value.
    //The value will be odd.
    //We use ceil to prevent dots covering by the image.
    hideDots.y = 1 + 2 * Math.ceil((hideDots.x * k - 1) / 2);
    imageSize.y = Math.round(imageSize.x * k);
    //If the result dots count is bigger than max - then decrease size and calculate again
    if (hideDots.y * hideDots.x > maxHiddenDots || (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.y)) {
        if (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.y) {
            hideDots.y = maxHiddenAxisDots;
            if (hideDots.y % 2 === 0)
                hideDots.x--;
        }
        else {
            hideDots.y -= 2;
        }
        imageSize.y = hideDots.y * dotSize;
        hideDots.x = 1 + 2 * Math.ceil((hideDots.y / k - 1) / 2);
        imageSize.x = Math.round(imageSize.y / k);
    }
    return {
        height: imageSize.y,
        width: imageSize.x,
        hideYDots: hideDots.x,
        hideXDots: hideDots.y
    };
}

var errorCorrectionPercents = {
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.3
};

var dotTypes = {
    dots: "dots",
    rounded: "rounded",
    classy: "classy",
    classyRounded: "classy-rounded",
    square: "square",
    extraRounded: "extra-rounded"
};

let QRDot$1 = class QRDot {
    _context;
    _type;
    constructor({ context, type }) {
        this._context = context;
        this._type = type;
    }
    draw(x, y, size, getNeighbor) {
        const context = this._context;
        const type = this._type;
        let drawFunction;
        switch (type) {
            case dotTypes.dots:
                drawFunction = this._drawDot;
                break;
            case dotTypes.classy:
                drawFunction = this._drawClassy;
                break;
            case dotTypes.classyRounded:
                drawFunction = this._drawClassyRounded;
                break;
            case dotTypes.rounded:
                drawFunction = this._drawRounded;
                break;
            case dotTypes.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case dotTypes.square:
            default:
                drawFunction = this._drawSquare;
        }
        drawFunction.call(this, { x, y, size, context, getNeighbor });
    }
    _rotateFigure({ x, y, size, context, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    }
    _basicDot(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
            }
        });
    }
    _basicSquare(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.rect(-size / 2, -size / 2, size, size);
            }
        });
    }
    //if rotation === 0 - right side is rounded
    _basicSideRounded(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            }
        });
    }
    //if rotation === 0 - top right corner is rounded
    _basicCornerRounded(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            }
        });
    }
    //if rotation === 0 - top right corner is rounded
    _basicCornerExtraRounded(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
            }
        });
    }
    _basicCornersRounded(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(0, size / 2);
                context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            }
        });
    }
    _basicCornersExtraRounded(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
            }
        });
    }
    _drawDot({ x, y, size, context }) {
        this._basicDot({ x, y, size, context, rotation: 0 });
    }
    _drawSquare({ x, y, size, context }) {
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
    _drawRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerRounded({ x, y, size, context, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, context, rotation });
            return;
        }
    }
    _drawExtraRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerExtraRounded({ x, y, size, context, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, context, rotation });
            return;
        }
    }
    _drawClassy({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x, y, size, context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
    _drawClassyRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
};

var cornerSquareTypes = {
    dot: "dot",
    square: "square",
    extraRounded: "extra-rounded"
};

let QRCornerSquare$1 = class QRCornerSquare {
    _context;
    _type;
    constructor({ context, type }) {
        this._context = context;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const context = this._context;
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerSquareTypes.square:
                drawFunction = this._drawSquare;
                break;
            case cornerSquareTypes.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case cornerSquareTypes.dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x, y, size, context, rotation });
    }
    _rotateFigure({ x, y, size, context, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    }
    _basicDot(args) {
        const { size, context } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
                context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
            }
        });
    }
    _basicSquare(args) {
        const { size, context } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.rect(-size / 2, -size / 2, size, size);
                context.rect(-size / 2 + dotSize, -size / 2 + dotSize, size - 2 * dotSize, size - 2 * dotSize);
            }
        });
    }
    _basicExtraRounded(args) {
        const { size, context } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
                context.lineTo(dotSize, -3.5 * dotSize);
                context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
                context.lineTo(3.5 * dotSize, -dotSize);
                context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
                context.lineTo(-dotSize, 3.5 * dotSize);
                context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
                context.lineTo(-3.5 * dotSize, -dotSize);
                context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
                context.lineTo(dotSize, -2.5 * dotSize);
                context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
                context.lineTo(2.5 * dotSize, -dotSize);
                context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
                context.lineTo(-dotSize, 2.5 * dotSize);
                context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
                context.lineTo(-2.5 * dotSize, -dotSize);
            }
        });
    }
    _drawDot({ x, y, size, context, rotation }) {
        this._basicDot({ x, y, size, context, rotation });
    }
    _drawSquare({ x, y, size, context, rotation }) {
        this._basicSquare({ x, y, size, context, rotation });
    }
    _drawExtraRounded({ x, y, size, context, rotation }) {
        this._basicExtraRounded({ x, y, size, context, rotation });
    }
};

var cornerDotTypes = {
    dot: "dot",
    square: "square"
};

let QRCornerDot$1 = class QRCornerDot {
    _context;
    _type;
    constructor({ context, type }) {
        this._context = context;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const context = this._context;
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerDotTypes.square:
                drawFunction = this._drawSquare;
                break;
            case cornerDotTypes.dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x, y, size, context, rotation });
    }
    _rotateFigure({ x, y, size, context, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    }
    _basicDot(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
            }
        });
    }
    _basicSquare(args) {
        const { size, context } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                context.rect(-size / 2, -size / 2, size, size);
            }
        });
    }
    _drawDot({ x, y, size, context, rotation }) {
        this._basicDot({ x, y, size, context, rotation });
    }
    _drawSquare({ x, y, size, context, rotation }) {
        this._basicSquare({ x, y, size, context, rotation });
    }
};

var gradientTypes = {
    radial: "radial",
    linear: "linear"
};

const squareMask$1 = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
const dotMask$1 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
class QRCanvas {
    _canvas;
    _options;
    _qr;
    _image;
    //TODO don't pass all options to this class
    constructor(options) {
        this._canvas = canvas.createCanvas(options.width, options.height);
        this._canvas.width = options.width;
        this._canvas.height = options.height;
        this._options = options;
    }
    get context() {
        return this._canvas.getContext("2d");
    }
    get width() {
        return this._canvas.width;
    }
    get height() {
        return this._canvas.height;
    }
    getCanvas() {
        return this._canvas;
    }
    clear() {
        const canvasContext = this.context;
        if (canvasContext) {
            canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
    async drawQR(qr) {
        const count = qr.getModuleCount();
        const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        let drawImageSize = {
            hideXDots: 0,
            hideYDots: 0,
            width: 0,
            height: 0
        };
        this._qr = qr;
        if (this._options.image) {
            await this.loadImage();
            if (!this._image)
                return;
            const { imageOptions, qrOptions } = this._options;
            const coverLevel = imageOptions.imageSize * errorCorrectionPercents[qrOptions.errorCorrectionLevel];
            const maxHiddenDots = Math.floor(coverLevel * count * count);
            drawImageSize = calculateImageSize({
                originalWidth: this._image.width,
                originalHeight: this._image.height,
                maxHiddenDots,
                maxHiddenAxisDots: count - 14,
                dotSize
            });
        }
        this.clear();
        this.drawBackground();
        //Draw the dots with the given filter function
        this.drawDots((i, j) => {
            if (this._options.imageOptions.hideBackgroundDots) {
                if (i >= (count - drawImageSize.hideXDots) / 2 &&
                    i < (count + drawImageSize.hideXDots) / 2 &&
                    j >= (count - drawImageSize.hideYDots) / 2 &&
                    j < (count + drawImageSize.hideYDots) / 2) {
                    return false;
                }
            }
            if (squareMask$1[i]?.[j] || squareMask$1[i - count + 7]?.[j] || squareMask$1[i]?.[j - count + 7]) {
                return false;
            }
            if (dotMask$1[i]?.[j] || dotMask$1[i - count + 7]?.[j] || dotMask$1[i]?.[j - count + 7]) {
                return false;
            }
            return true;
        });
        this.drawCorners();
        if (this._options.image) {
            this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
        }
    }
    drawBackground() {
        const canvasContext = this.context;
        const options = this._options;
        if (canvasContext) {
            if (options.backgroundOptions.gradient) {
                const gradientOptions = options.backgroundOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = gradient;
            }
            else if (options.backgroundOptions.color) {
                canvasContext.fillStyle = options.backgroundOptions.color;
            }
            canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
    drawDots(filter) {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const canvasContext = this.context;
        if (!canvasContext) {
            throw "QR code is not defined";
        }
        const options = this._options;
        const count = this._qr.getModuleCount();
        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dot = new QRDot$1({ context: canvasContext, type: options.dotsOptions.type });
        canvasContext.beginPath();
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }
                if (!this._qr.isDark(i, j)) {
                    continue;
                }
                const x = this._options.useLegacyDotRotation ? xBeginning + i * dotSize : yBeginning + j * dotSize;
                const y = this._options.useLegacyDotRotation ? yBeginning + j * dotSize : xBeginning + i * dotSize;
                dot.draw(x, y, dotSize, 
                //Get neighbor function
                (xOffset, yOffset) => {
                    //Out of bounds check
                    if (this._options.useLegacyDotRotation) {
                        if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                            return false;
                        if (filter && !filter(i + xOffset, j + yOffset))
                            return false;
                        return !!this._qr && this._qr.isDark(i + xOffset, j + yOffset);
                    }
                    else {
                        if (j + xOffset < 0 || i + yOffset < 0 || j + xOffset >= count || i + yOffset >= count)
                            return false;
                        if (filter && !filter(j + xOffset, i + yOffset))
                            return false;
                        return !!this._qr && this._qr.isDark(i + yOffset, j + xOffset);
                    }
                });
            }
        }
        if (options.dotsOptions.gradient) {
            const gradientOptions = options.dotsOptions.gradient;
            const gradient = this._createGradient({
                context: canvasContext,
                options: gradientOptions,
                additionalRotation: 0,
                x: xBeginning,
                y: yBeginning,
                size: count * dotSize
            });
            gradientOptions.colorStops.forEach(({ offset, color }) => {
                gradient.addColorStop(offset, color);
            });
            canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
        }
        else if (options.dotsOptions.color) {
            canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
        }
        canvasContext.fill("evenodd");
    }
    drawCorners(filter) {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const canvasContext = this.context;
        if (!canvasContext) {
            throw "QR code is not defined";
        }
        const options = this._options;
        const count = this._qr.getModuleCount();
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const cornersSquareSize = dotSize * 7;
        const cornersDotSize = dotSize * 3;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        [
            [0, 0, 0],
            [1, 0, Math.PI / 2],
            [0, 1, -Math.PI / 2]
        ].forEach(([column, row, rotation]) => {
            if (filter && !filter(column, row)) {
                return;
            }
            const x = xBeginning + column * dotSize * (count - 7);
            const y = yBeginning + row * dotSize * (count - 7);
            if (options.cornersSquareOptions?.type) {
                const cornersSquare = new QRCornerSquare$1({ context: canvasContext, type: options.cornersSquareOptions?.type });
                canvasContext.beginPath();
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
            }
            else {
                const dot = new QRDot$1({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                for (let i = 0; i < squareMask$1.length; i++) {
                    for (let j = 0; j < squareMask$1[i].length; j++) {
                        if (!squareMask$1[i]?.[j]) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => !!squareMask$1[i + xOffset]?.[j + yOffset]);
                    }
                }
            }
            if (options.cornersSquareOptions?.gradient) {
                const gradientOptions = options.cornersSquareOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x,
                    y,
                    size: cornersSquareSize
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
            }
            else if (options.cornersSquareOptions?.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
            }
            canvasContext.fill("evenodd");
            if (options.cornersDotOptions?.type) {
                const cornersDot = new QRCornerDot$1({ context: canvasContext, type: options.cornersDotOptions?.type });
                canvasContext.beginPath();
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
            }
            else {
                const dot = new QRDot$1({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                for (let i = 0; i < dotMask$1.length; i++) {
                    for (let j = 0; j < dotMask$1[i].length; j++) {
                        if (!dotMask$1[i]?.[j]) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => !!dotMask$1[i + xOffset]?.[j + yOffset]);
                    }
                }
            }
            if (options.cornersDotOptions?.gradient) {
                const gradientOptions = options.cornersDotOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    size: cornersDotSize
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
            }
            else if (options.cornersDotOptions?.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersDotOptions.color;
            }
            canvasContext.fill("evenodd");
        });
    }
    loadImage() {
        return new Promise((resolve, reject) => {
            const options = this._options;
            const image = new canvas.Image();
            if (!options.image) {
                return reject("Image is not defined");
            }
            if (typeof options.imageOptions.crossOrigin === "string") {
                image.crossOrigin = options.imageOptions.crossOrigin;
            }
            this._image = image;
            image.onload = () => {
                resolve();
            };
            image.src = options.image;
        });
    }
    drawImage({ width, height, count, dotSize }) {
        const canvasContext = this.context;
        if (!canvasContext) {
            throw "canvasContext is not defined";
        }
        if (!this._image) {
            throw "image is not defined";
        }
        const options = this._options;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        const dw = width - options.imageOptions.margin * 2;
        const dh = height - options.imageOptions.margin * 2;
        canvasContext.drawImage(this._image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
    }
    _createGradient({ context, options, additionalRotation, x, y, size }) {
        let gradient;
        if (options.type === gradientTypes.radial) {
            gradient = context.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
        }
        else {
            const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
            const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
            let x0 = x + size / 2;
            let y0 = y + size / 2;
            let x1 = x + size / 2;
            let y1 = y + size / 2;
            if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                x0 = x0 - size / 2;
                y0 = y0 - (size / 2) * Math.tan(rotation);
                x1 = x1 + size / 2;
                y1 = y1 + (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                y0 = y0 - size / 2;
                x0 = x0 - size / 2 / Math.tan(rotation);
                y1 = y1 + size / 2;
                x1 = x1 + size / 2 / Math.tan(rotation);
            }
            else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                x0 = x0 + size / 2;
                y0 = y0 + (size / 2) * Math.tan(rotation);
                x1 = x1 - size / 2;
                y1 = y1 - (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                y0 = y0 + size / 2;
                x0 = x0 + size / 2 / Math.tan(rotation);
                y1 = y1 - size / 2;
                x1 = x1 - size / 2 / Math.tan(rotation);
            }
            gradient = context.createLinearGradient(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
        }
        return gradient;
    }
}

const dom$2 = new jsdom.JSDOM();
const document$3 = dom$2.window.document;
class QRDot {
    _element;
    _svg;
    _type;
    constructor({ svg, type }) {
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, getNeighbor) {
        const type = this._type;
        let drawFunction;
        switch (type) {
            case dotTypes.dots:
                drawFunction = this._drawDot;
                break;
            case dotTypes.classy:
                drawFunction = this._drawClassy;
                break;
            case dotTypes.classyRounded:
                drawFunction = this._drawClassyRounded;
                break;
            case dotTypes.rounded:
                drawFunction = this._drawRounded;
                break;
            case dotTypes.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case dotTypes.square:
            default:
                drawFunction = this._drawSquare;
        }
        drawFunction.call(this, { x, y, size, getNeighbor });
    }
    _rotateFigure({ x, y, size, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        draw();
        this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
    }
    _basicDot(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "circle");
                this._element.setAttribute("cx", String(x + size / 2));
                this._element.setAttribute("cy", String(y + size / 2));
                this._element.setAttribute("r", String(size / 2));
            }
        });
    }
    _basicSquare(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "rect");
                this._element.setAttribute("x", String(x));
                this._element.setAttribute("y", String(y));
                this._element.setAttribute("width", String(size));
                this._element.setAttribute("height", String(size));
            }
        });
    }
    //if rotation === 0 - right side is rounded
    _basicSideRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` + //go to top left position
                    `v ${size}` + //draw line to left bottom corner
                    `h ${size / 2}` + //draw line to left bottom corner + half of size right
                    `a ${size / 2} ${size / 2}, 0, 0, 0, 0 ${-size}` // draw rounded corner
                );
            }
        });
    }
    //if rotation === 0 - top right corner is rounded
    _basicCornerRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` + //go to top left position
                    `v ${size}` + //draw line to left bottom corner
                    `h ${size}` + //draw line to right bottom corner
                    `v ${-size / 2}` + //draw line to right bottom corner + half of size top
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded corner
                );
            }
        });
    }
    //if rotation === 0 - top right corner is rounded
    _basicCornerExtraRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` + //go to top left position
                    `v ${size}` + //draw line to left bottom corner
                    `h ${size}` + //draw line to right bottom corner
                    `a ${size} ${size}, 0, 0, 0, ${-size} ${-size}` // draw rounded top right corner
                );
            }
        });
    }
    //if rotation === 0 - left bottom and right top corners are rounded
    _basicCornersRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$3.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` + //go to left top position
                    `v ${size / 2}` + //draw line to left top corner + half of size bottom
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${size / 2} ${size / 2}` + // draw rounded left bottom corner
                    `h ${size / 2}` + //draw line to right bottom corner
                    `v ${-size / 2}` + //draw line to right bottom corner + half of size top
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded right top corner
                );
            }
        });
    }
    _drawDot({ x, y, size }) {
        this._basicDot({ x, y, size, rotation: 0 });
    }
    _drawSquare({ x, y, size }) {
        this._basicSquare({ x, y, size, rotation: 0 });
    }
    _drawRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerRounded({ x, y, size, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, rotation });
            return;
        }
    }
    _drawExtraRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerExtraRounded({ x, y, size, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, rotation });
            return;
        }
    }
    _drawClassy({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x, y, size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, rotation: 0 });
    }
    _drawClassyRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, rotation: 0 });
    }
}

const dom$1 = new jsdom.JSDOM();
const document$2 = dom$1.window.document;
class QRCornerSquare {
    _element;
    _svg;
    _type;
    constructor({ svg, type }) {
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerSquareTypes.square:
                drawFunction = this._drawSquare;
                break;
            case cornerSquareTypes.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case cornerSquareTypes.dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x, y, size, rotation });
    }
    _rotateFigure({ x, y, size, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        draw();
        this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
    }
    _basicDot(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$2.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x + size / 2} ${y}` + // M cx, y //  Move to top of ring
                    `a ${size / 2} ${size / 2} 0 1 0 0.1 0` + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
                    `z` + // Z // Close the outer shape
                    `m 0 ${dotSize}` + // m -1 outerRadius-innerRadius // Move to top point of inner radius
                    `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
                    `Z` // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
                );
            }
        });
    }
    _basicSquare(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$2.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size}` +
                    `h ${size}` +
                    `v ${-size}` +
                    `z` +
                    `M ${x + dotSize} ${y + dotSize}` +
                    `h ${size - 2 * dotSize}` +
                    `v ${size - 2 * dotSize}` +
                    `h ${-size + 2 * dotSize}` +
                    `z`);
            }
        });
    }
    _basicExtraRounded(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document$2.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x} ${y + 2.5 * dotSize}` +
                    `v ${2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
                    `h ${2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
                    `v ${-2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
                    `h ${-2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
                    `M ${x + 2.5 * dotSize} ${y + dotSize}` +
                    `h ${2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
                    `v ${2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
                    `h ${-2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
                    `v ${-2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`);
            }
        });
    }
    _drawDot({ x, y, size, rotation }) {
        this._basicDot({ x, y, size, rotation });
    }
    _drawSquare({ x, y, size, rotation }) {
        this._basicSquare({ x, y, size, rotation });
    }
    _drawExtraRounded({ x, y, size, rotation }) {
        this._basicExtraRounded({ x, y, size, rotation });
    }
}

class QRCornerDot {
    _element;
    _svg;
    _type;
    constructor({ svg, type }) {
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerDotTypes.square:
                drawFunction = this._drawSquare;
                break;
            case cornerDotTypes.dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x, y, size, rotation });
    }
    _rotateFigure({ x, y, size, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        draw();
        this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
    }
    _basicDot(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                this._element.setAttribute("cx", String(x + size / 2));
                this._element.setAttribute("cy", String(y + size / 2));
                this._element.setAttribute("r", String(size / 2));
            }
        });
    }
    _basicSquare(args) {
        const { size, x, y } = args;
        this._rotateFigure({
            ...args,
            draw: () => {
                this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                this._element.setAttribute("x", String(x));
                this._element.setAttribute("y", String(y));
                this._element.setAttribute("width", String(size));
                this._element.setAttribute("height", String(size));
            }
        });
    }
    _drawDot({ x, y, size, rotation }) {
        this._basicDot({ x, y, size, rotation });
    }
    _drawSquare({ x, y, size, rotation }) {
        this._basicSquare({ x, y, size, rotation });
    }
}

const dom = new jsdom.JSDOM();
const document$1 = dom.window.document;
const squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
const dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
class QRSVG {
    _element;
    _style;
    _defs;
    _dotsClipPath;
    _cornersSquareClipPath;
    _cornersDotClipPath;
    _dots;
    _cornerSquares;
    _corners;
    _cornerDots;
    _options;
    _qr;
    _image;
    //TODO don't pass all options to this class
    constructor(options) {
        this._element = document$1.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._element.setAttribute("width", String(options.width));
        this._element.setAttribute("height", String(options.height));
        this._element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        this._defs = document$1.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._style = document$1.createElementNS("http://www.w3.org/2000/svg", "style");
        this._options = options;
    }
    get width() {
        return this._options.width;
    }
    get height() {
        return this._options.height;
    }
    getElement() {
        return this._element;
    }
    clear() {
        const oldElement = this._element;
        this._element = oldElement.cloneNode(false);
        oldElement?.parentNode?.replaceChild(this._element, oldElement);
        this._defs = document$1.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._style = document$1.createElementNS("http://www.w3.org/2000/svg", "style");
        this._element.appendChild(this._style);
        this._element.appendChild(this._defs);
    }
    async drawQR(qr) {
        const count = qr.getModuleCount();
        const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        let drawImageSize = {
            hideXDots: 0,
            hideYDots: 0,
            width: 0,
            height: 0
        };
        this._qr = qr;
        if (this._options.image) {
            //We need it to get image size
            await this.loadImage();
            if (!this._image)
                return;
            const { imageOptions, qrOptions } = this._options;
            const coverLevel = imageOptions.imageSize * errorCorrectionPercents[qrOptions.errorCorrectionLevel];
            const maxHiddenDots = Math.floor(coverLevel * count * count);
            drawImageSize = calculateImageSize({
                originalWidth: this._image.width,
                originalHeight: this._image.height,
                maxHiddenDots,
                maxHiddenAxisDots: count - 14,
                dotSize
            });
        }
        this._element.appendChild(this._style);
        this._element.appendChild(this._defs);
        this.clear();
        this.drawBackground();
        this.drawDots((i, j) => {
            if (this._options.imageOptions.hideBackgroundDots) {
                if (i >= (count - drawImageSize.hideXDots) / 2 &&
                    i < (count + drawImageSize.hideXDots) / 2 &&
                    j >= (count - drawImageSize.hideYDots) / 2 &&
                    j < (count + drawImageSize.hideYDots) / 2) {
                    return false;
                }
            }
            if (squareMask[i]?.[j] || squareMask[i - count + 7]?.[j] || squareMask[i]?.[j - count + 7]) {
                return false;
            }
            if (dotMask[i]?.[j] || dotMask[i - count + 7]?.[j] || dotMask[i]?.[j - count + 7]) {
                return false;
            }
            return true;
        });
        this.drawCorners();
        if (this._options.image) {
            await this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
        }
    }
    drawBackground() {
        const element = this._element;
        const options = this._options;
        if (element) {
            const gradientOptions = options.backgroundOptions?.gradient;
            const color = options.backgroundOptions?.color;
            if (gradientOptions) {
                this._createColor({
                    options: gradientOptions,
                    color: color,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    height: options.height,
                    width: options.width,
                    name: "background-color"
                });
            }
            else if (options.backgroundOptions?.color) {
                this._createStyle({
                    color: color,
                    name: "background-color"
                });
            }
        }
    }
    drawDots(filter) {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const options = this._options;
        const count = this._qr.getModuleCount();
        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });
        if (options.dotsOptions?.gradient) {
            this._dotsClipPath = document$1.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            this._dotsClipPath.setAttribute("id", "clip-path-dot-color");
            this._defs.appendChild(this._dotsClipPath);
            this._createColor({
                options: options.dotsOptions?.gradient,
                color: options.dotsOptions.color,
                additionalRotation: 0,
                x: xBeginning,
                y: yBeginning,
                height: count * dotSize,
                width: count * dotSize,
                name: "dot-color"
            });
        }
        else if (options.dotsOptions.color) {
            this._dots = document$1.createElementNS("http://www.w3.org/2000/svg", "g");
            this._dots.setAttribute("class", "dot-color");
            this._element.appendChild(this._dots);
            this._createStyle({
                color: options.dotsOptions.color,
                name: "dot-color"
            });
        }
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }
                if (!this._qr?.isDark(i, j)) {
                    continue;
                }
                const x = this._options.useLegacyDotRotation ? xBeginning + i * dotSize : yBeginning + j * dotSize;
                const y = this._options.useLegacyDotRotation ? yBeginning + j * dotSize : xBeginning + i * dotSize;
                dot.draw(x, y, dotSize, (xOffset, yOffset) => {
                    if (this._options.useLegacyDotRotation) {
                        if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                            return false;
                        if (filter && !filter(i + xOffset, j + yOffset))
                            return false;
                        return !!this._qr && this._qr.isDark(i + xOffset, j + yOffset);
                    }
                    else {
                        if (j + xOffset < 0 || i + yOffset < 0 || j + xOffset >= count || i + yOffset >= count)
                            return false;
                        if (filter && !filter(j + xOffset, i + yOffset))
                            return false;
                        return !!this._qr && this._qr.isDark(i + yOffset, j + xOffset);
                    }
                });
                if (dot._element && this._dotsClipPath) {
                    this._dotsClipPath.appendChild(dot._element);
                }
                else if (dot._element && this._dots) {
                    this._dots.appendChild(dot._element);
                }
            }
        }
    }
    drawCorners() {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const element = this._element;
        const options = this._options;
        if (!element) {
            throw "Element code is not defined";
        }
        const count = this._qr.getModuleCount();
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const cornersSquareSize = dotSize * 7;
        const cornersDotSize = dotSize * 3;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        [
            [0, 0, 0],
            [1, 0, Math.PI / 2],
            [0, 1, -Math.PI / 2]
        ].forEach(([column, row, rotation]) => {
            const x = xBeginning + column * dotSize * (count - 7);
            const y = yBeginning + row * dotSize * (count - 7);
            let cornersSquareClipPath = this._dotsClipPath;
            let cornersDotClipPath = this._dotsClipPath;
            if (options.cornersSquareOptions?.gradient) {
                cornersSquareClipPath = document$1.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersSquareClipPath.setAttribute("id", `clip-path-corners-square-color-${column}-${row}`);
                this._defs.appendChild(cornersSquareClipPath);
                this._cornersSquareClipPath = this._cornersDotClipPath = cornersDotClipPath = cornersSquareClipPath;
                this._createColor({
                    options: options.cornersSquareOptions?.gradient,
                    color: options.cornersSquareOptions?.color,
                    additionalRotation: rotation,
                    x,
                    y,
                    height: cornersSquareSize,
                    width: cornersSquareSize,
                    name: `corners-square-color-${column}-${row}`
                });
            }
            else {
                this._cornerSquares = document$1.createElementNS("http://www.w3.org/2000/svg", "g");
                this._cornerSquares.setAttribute("class", `corners-square-color-${column}-${row}`);
                this._element.appendChild(this._cornerSquares);
                this._createStyle({
                    color: options.cornersSquareOptions?.color,
                    name: `corners-square-color-${column}-${row}`
                });
            }
            if (options.cornersSquareOptions?.type) {
                const cornersSquare = new QRCornerSquare({ svg: this._element, type: options.cornersSquareOptions.type });
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
                if (options.cornersSquareOptions?.gradient && cornersSquare._element && cornersSquareClipPath) {
                    cornersSquareClipPath.appendChild(cornersSquare._element);
                }
                else if (cornersSquare._element && this._cornerSquares) {
                    this._cornerSquares.appendChild(cornersSquare._element);
                }
            }
            else {
                const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });
                for (let i = 0; i < squareMask.length; i++) {
                    for (let j = 0; j < squareMask[i].length; j++) {
                        if (!squareMask[i]?.[j]) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => !!squareMask[i + xOffset]?.[j + yOffset]);
                        if (dot._element && this._cornersSquareClipPath) {
                            this._cornersSquareClipPath.appendChild(dot._element);
                        }
                        else if (dot._element && this._cornerSquares) {
                            this._cornerSquares.appendChild(dot._element);
                        }
                    }
                }
            }
            if (options.cornersDotOptions?.gradient) {
                cornersDotClipPath = document$1.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersDotClipPath.setAttribute("id", `clip-path-corners-dot-color-${column}-${row}`);
                this._defs.appendChild(cornersDotClipPath);
                this._cornersDotClipPath = cornersDotClipPath;
                this._createColor({
                    options: options.cornersDotOptions?.gradient,
                    color: options.cornersDotOptions?.color,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    height: cornersDotSize,
                    width: cornersDotSize,
                    name: `corners-dot-color-${column}-${row}`
                });
            }
            else {
                this._cornerDots = document$1.createElementNS("http://www.w3.org/2000/svg", "g");
                this._cornerDots.setAttribute("class", `corners-dot-color-${column}-${row}`);
                this._element.appendChild(this._cornerDots);
                this._createStyle({
                    color: options.cornersDotOptions?.color,
                    name: `corners-dot-color-${column}-${row}`
                });
            }
            if (options.cornersDotOptions?.type) {
                const cornersDot = new QRCornerDot({ svg: this._element, type: options.cornersDotOptions.type });
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
                if (options.cornersDotOptions?.gradient && cornersDot._element && cornersDotClipPath) {
                    cornersDotClipPath.appendChild(cornersDot._element);
                }
                else if (cornersDot._element && this._cornerDots) {
                    this._cornerDots.appendChild(cornersDot._element);
                }
            }
            else {
                const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });
                for (let i = 0; i < dotMask.length; i++) {
                    for (let j = 0; j < dotMask[i].length; j++) {
                        if (!dotMask[i]?.[j]) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => !!dotMask[i + xOffset]?.[j + yOffset]);
                        if (dot._element && this._cornersDotClipPath) {
                            this._cornersDotClipPath.appendChild(dot._element);
                        }
                        else if (dot._element && this._cornerDots) {
                            this._cornerDots.appendChild(dot._element);
                        }
                    }
                }
            }
        });
    }
    loadImage() {
        return new Promise((resolve, reject) => {
            const options = this._options;
            const image = new canvas.Image();
            if (!options.image) {
                return reject("Image is not defined");
            }
            if (typeof options.imageOptions.crossOrigin === "string") {
                image.crossOrigin = options.imageOptions.crossOrigin;
            }
            this._image = image;
            image.onload = () => {
                resolve();
            };
            image.src = options.image;
        });
    }
    async drawImage({ width, height, count, dotSize }) {
        const options = this._options;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        const dw = width - options.imageOptions.margin * 2;
        const dh = height - options.imageOptions.margin * 2;
        const image = document$1.createElementNS("http://www.w3.org/2000/svg", "image");
        const base64Image = await this._getBase64Image(options.image || "");
        image.setAttribute("href", base64Image);
        image.setAttribute("xlink:href", base64Image);
        image.setAttribute("x", String(dx));
        image.setAttribute("y", String(dy));
        image.setAttribute("width", `${dw}px`);
        image.setAttribute("height", `${dh}px`);
        this._element.appendChild(image);
    }
    async _getImageBlob(url) {
        const resp = await fetch(url);
        return resp.blob();
    }
    // convert a blob to base64
    _blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function () {
                const dataUrl = reader.result;
                resolve(dataUrl);
            };
            reader.readAsDataURL(blob);
        });
    }
    async _getBase64Image(url) {
        if (url === "") {
            return new Promise((resolve) => {
                resolve("");
            });
        }
        const blob = await this._getImageBlob(url);
        const base64 = await this._blobToBase64(blob);
        return base64;
    }
    _createColor({ options, color, additionalRotation, x, y, height, width, name }) {
        const size = width > height ? width : height;
        const rect = document$1.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("height", String(height));
        rect.setAttribute("width", String(width));
        rect.setAttribute("clip-path", `url('#clip-path-${name}')`);
        if (options) {
            let gradient;
            if (options.type === gradientTypes.radial) {
                gradient = document$1.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
                gradient.setAttribute("id", name);
                gradient.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient.setAttribute("fx", String(x + width / 2));
                gradient.setAttribute("fy", String(y + height / 2));
                gradient.setAttribute("cx", String(x + width / 2));
                gradient.setAttribute("cy", String(y + height / 2));
                gradient.setAttribute("r", String(size / 2));
            }
            else {
                const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
                const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
                let x0 = x + width / 2;
                let y0 = y + height / 2;
                let x1 = x + width / 2;
                let y1 = y + height / 2;
                if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                    (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                    x0 = x0 - width / 2;
                    y0 = y0 - (height / 2) * Math.tan(rotation);
                    x1 = x1 + width / 2;
                    y1 = y1 + (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                    y0 = y0 - height / 2;
                    x0 = x0 - width / 2 / Math.tan(rotation);
                    y1 = y1 + height / 2;
                    x1 = x1 + width / 2 / Math.tan(rotation);
                }
                else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                    x0 = x0 + width / 2;
                    y0 = y0 + (height / 2) * Math.tan(rotation);
                    x1 = x1 - width / 2;
                    y1 = y1 - (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                    y0 = y0 + height / 2;
                    x0 = x0 + width / 2 / Math.tan(rotation);
                    y1 = y1 - height / 2;
                    x1 = x1 - width / 2 / Math.tan(rotation);
                }
                gradient = document$1.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                gradient.setAttribute("id", name);
                gradient.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient.setAttribute("x1", String(Math.round(x0)));
                gradient.setAttribute("y1", String(Math.round(y0)));
                gradient.setAttribute("x2", String(Math.round(x1)));
                gradient.setAttribute("y2", String(Math.round(y1)));
            }
            options.colorStops.forEach(({ offset, color }) => {
                const stop = document$1.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop.setAttribute("offset", `${100 * offset}%`);
                stop.setAttribute("stop-color", color);
                gradient.appendChild(stop);
            });
            rect.setAttribute("fill", `url('#${name}')`);
            this._defs.appendChild(gradient);
        }
        else if (color) {
            rect.setAttribute("fill", color);
        }
        this._element.appendChild(rect);
    }
    _createStyle({ color, name }) {
        this._style.innerHTML += `.${name}{ fill: ${color}; }`;
    }
}

var drawTypes = {
    canvas: "canvas",
    svg: "svg"
};

const qrTypes = {};
for (let type = 0; type <= 40; type++) {
    qrTypes[type] = type;
}

var errorCorrectionLevels = {
    L: "L",
    M: "M",
    Q: "Q",
    H: "H"
};

const defaultOptions = {
    type: drawTypes.canvas,
    width: 300,
    height: 300,
    data: "",
    margin: 0,
    qrOptions: {
        typeNumber: qrTypes[0],
        mode: undefined,
        errorCorrectionLevel: errorCorrectionLevels.Q
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        crossOrigin: "anonymous",
        margin: 0
    },
    dotsOptions: {
        type: "square",
        color: "#000"
    },
    backgroundOptions: {
        color: "#fff"
    },
    useLegacyDotRotation: false
};

function sanitizeGradient(gradient) {
    const newGradient = { ...gradient };
    if (!newGradient.colorStops || !newGradient.colorStops.length) {
        throw "Field 'colorStops' is required in gradient";
    }
    if (newGradient.rotation) {
        newGradient.rotation = Number(newGradient.rotation);
    }
    else {
        newGradient.rotation = 0;
    }
    newGradient.colorStops = newGradient.colorStops.map((colorStop) => ({
        ...colorStop,
        offset: Number(colorStop.offset)
    }));
    return newGradient;
}
function sanitizeOptions(options) {
    const newOptions = { ...options };
    newOptions.width = Number(newOptions.width);
    newOptions.height = Number(newOptions.height);
    newOptions.margin = Number(newOptions.margin);
    newOptions.imageOptions = {
        ...newOptions.imageOptions,
        hideBackgroundDots: Boolean(newOptions.imageOptions.hideBackgroundDots),
        imageSize: Number(newOptions.imageOptions.imageSize),
        margin: Number(newOptions.imageOptions.margin)
    };
    if (newOptions.margin > Math.min(newOptions.width, newOptions.height)) {
        newOptions.margin = Math.min(newOptions.width, newOptions.height);
    }
    newOptions.dotsOptions = {
        ...newOptions.dotsOptions
    };
    if (newOptions.dotsOptions.gradient) {
        newOptions.dotsOptions.gradient = sanitizeGradient(newOptions.dotsOptions.gradient);
    }
    if (newOptions.cornersSquareOptions) {
        newOptions.cornersSquareOptions = {
            ...newOptions.cornersSquareOptions
        };
        if (newOptions.cornersSquareOptions.gradient) {
            newOptions.cornersSquareOptions.gradient = sanitizeGradient(newOptions.cornersSquareOptions.gradient);
        }
    }
    if (newOptions.cornersDotOptions) {
        newOptions.cornersDotOptions = {
            ...newOptions.cornersDotOptions
        };
        if (newOptions.cornersDotOptions.gradient) {
            newOptions.cornersDotOptions.gradient = sanitizeGradient(newOptions.cornersDotOptions.gradient);
        }
    }
    if (newOptions.backgroundOptions) {
        newOptions.backgroundOptions = {
            ...newOptions.backgroundOptions
        };
        if (newOptions.backgroundOptions.gradient) {
            newOptions.backgroundOptions.gradient = sanitizeGradient(newOptions.backgroundOptions.gradient);
        }
    }
    return newOptions;
}

class QRCodeStyling {
    _options;
    _container;
    _canvas;
    _svg;
    _qr;
    _canvasDrawingPromise;
    _svgDrawingPromise;
    constructor(options) {
        this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options)) : defaultOptions;
        this.update();
    }
    static _clearContainer(container) {
        if (container) {
            container.innerHTML = "";
        }
    }
    async _getQRStylingElement(extension) {
        if (!this._qr)
            throw "QR code is empty";
        if (extension.toLowerCase() === "svg") {
            let promise, svg;
            if (this._svg && this._svgDrawingPromise) {
                svg = this._svg;
                promise = this._svgDrawingPromise;
            }
            else {
                svg = new QRSVG(this._options);
                promise = svg.drawQR(this._qr);
            }
            await promise;
            return svg;
        }
        else {
            let promise, canvas;
            if (this._canvas && this._canvasDrawingPromise) {
                canvas = this._canvas;
                promise = this._canvasDrawingPromise;
            }
            else {
                canvas = new QRCanvas(this._options);
                promise = canvas.drawQR(this._qr);
            }
            await promise;
            return canvas;
        }
    }
    update(options) {
        QRCodeStyling._clearContainer(this._container);
        this._options = options ? sanitizeOptions(mergeDeep(this._options, options)) : this._options;
        if (!this._options.data) {
            return;
        }
        this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
        this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
        this._qr.make();
        if (this._options.type === drawTypes.canvas) {
            this._canvas = new QRCanvas(this._options);
            this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
            this._svgDrawingPromise = undefined;
            this._svg = undefined;
        }
        else {
            this._svg = new QRSVG(this._options);
            this._svgDrawingPromise = this._svg.drawQR(this._qr);
            this._canvasDrawingPromise = undefined;
            this._canvas = undefined;
        }
        this.append(this._container);
    }
    append(container) {
        if (!container) {
            return;
        }
        if (typeof container.appendChild !== "function") {
            throw "Container should be a single DOM node";
        }
        if (this._options.type === drawTypes.canvas) {
            if (this._canvas) {
                container.appendChild(this._canvas.getCanvas());
            }
        }
        else {
            if (this._svg) {
                container.appendChild(this._svg.getElement());
            }
        }
        this._container = container;
    }
    async getRawData(extension = "png", quality) {
        if (!this._qr)
            throw "QR code is empty";
        //A bit trickery to get typescript to behave
        const lowerCasedExtension = extension.toLocaleLowerCase();
        if (lowerCasedExtension === "svg") {
            const element = await this._getQRStylingElement(lowerCasedExtension);
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(element.getElement());
            return new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], { type: "image/svg+xml" });
        }
        else {
            const element = await this._getQRStylingElement(lowerCasedExtension);
            return new Promise((resolve) => element.getCanvas().toBlob(resolve, `image/${lowerCasedExtension}`, quality));
        }
    }
    /**
     *
     * @param extension file format of the returned image
     * @param quality [0-1] with 1 being the highest quality
     * @returns
     */
    async toDataUrl(extension = "png", quality) {
        if (!this._qr)
            throw "QR code is empty";
        const lowerCasedExtension = extension.toLocaleLowerCase();
        const element = await this._getQRStylingElement(lowerCasedExtension);
        return element.getCanvas().toDataURL(`image/${lowerCasedExtension}`, quality);
    }
    async download(downloadOptions) {
        if (!this._qr)
            throw "QR code is empty";
        let extension = "png";
        if (typeof downloadOptions === "object" && downloadOptions !== null) {
            if (downloadOptions.name) {
                downloadOptions.name;
            }
            if (downloadOptions.extension) {
                extension = downloadOptions.extension;
            }
        }
        //A bit trickery to get typescript to behave
        const lowerCasedExtension = extension.toLocaleLowerCase();
        if (lowerCasedExtension === "svg") {
            const element = await this._getQRStylingElement(lowerCasedExtension);
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(element.getElement());
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            downloadURI(url);
        }
        else {
            const element = await this._getQRStylingElement(lowerCasedExtension);
            const url = element.getCanvas().toDataURL(`image/${extension}`);
            return downloadURI(url);
        }
    }
}

async function createQr(data) {
    const uriBase = `nano:${data.address}`;
    const queryParams = [`amount=${data.isRaw ? data.amount : nanoToRaw(data.amount)}`];
    if (data.label)
        queryParams.push(`label=${encodeURIComponent(data.label)}`);
    if (data.message)
        queryParams.push(`message=${encodeURIComponent(data.message)}`);
    const uri = `${uriBase}?${queryParams.join('&')}`;
    const defaultOption = {
        "width": 300,
        "height": 300,
        "data": uri,
        "margin": 0,
        "qrOptions": { "typeNumber": "0", "mode": "Byte", "errorCorrectionLevel": "L" },
        "imageOptions": { "hideBackgroundDots": true, "imageSize": data.isRaw ? 0.5 : 0.5, "margin": 0 },
        "dotsOptions": { "type": "extra-rounded", "color": "#6a1a4c", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#d06caa" }, { "offset": 1, "color": "#2880c3" }] } },
        "backgroundOptions": { "color": "transparent" },
        "image": "https://raw.githubusercontent.com/WriteNaN/Nano.js/main/src/assets/nano.png", "dotsOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#6a1a4c", "color2": "#6a1a4c", "rotation": "0" } }, "cornersSquareOptions": { "type": "extra-rounded", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#e3168e" }, { "offset": 1, "color": "#1a96f4" }] } }, "cornersSquareOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "cornersDotOptions": { "type": "", "color": "#000000", "gradient": { "type": "linear", "rotation": 0, "colorStops": [{ "offset": 0, "color": "#f20d0d" }, { "offset": 1, "color": "#1018f4" }] } }, "cornersDotOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#000000", "color2": "#000000", "rotation": "0" } }, "backgroundOptionsHelper": { "colorType": { "single": true, "gradient": false }, "gradient": { "linear": true, "radial": false, "color1": "#ffffff", "color2": "#ffffff", "rotation": "0" } }
    };
    const qrCode = new QRCodeStyling(defaultOption);
    return {
        uri,
        qrCode: await qrCode.download()
    };
}

exports.InvoiceStatus = void 0;
(function (InvoiceStatus) {
    InvoiceStatus["WAITING"] = "waiting";
    InvoiceStatus["PAID"] = "paid";
})(exports.InvoiceStatus || (exports.InvoiceStatus = {}));
class InvoiceBuilder extends EventEmitter {
    useRaw;
    liveUpdate;
    rpc;
    ws;
    invoiceMap;
    maxHistory;
    constructor(options) {
        super();
        const { useRaw, liveUpdate, rpcEndpoint, wsEndpoint, customHeaders } = options;
        this.useRaw = useRaw;
        this.liveUpdate = liveUpdate;
        this.rpc = new RPC(rpcEndpoint, customHeaders);
        this.ws = wsEndpoint ? new WebSocket(wsEndpoint) : undefined;
        this.invoiceMap = new Map();
        this.maxHistory = options.maxHistory || "50";
        if (this.liveUpdate && this.ws) {
            this.attachWsListeners();
        }
    }
    async create(invoiceData) {
        const { recipientAddress, amountNano, label, message, roundingPercent } = invoiceData;
        if (!recipientAddress || !amountNano || roundingPercent < 0) {
            throw new Error('Invalid input data for invoice creation.');
        }
        const amountRaw = this.useRaw ? amountNano.toString() : nanoToRaw(amountNano);
        // Check for duplicates
        const existingInvoice = Array.from(this.invoiceMap.values())
            .find(invoice => invoice.address === recipientAddress && invoice.amount === amountRaw);
        if (existingInvoice) {
            // Handle duplicate (reject or update existing invoice)
            throw new Error('Invoice with the same recipient address and amount already exists.');
        }
        const qrResult = await createQr({
            address: recipientAddress,
            amount: amountRaw,
            label,
            message,
            isRaw: true
        });
        const invoiceId = uuid.v4();
        const newInvoice = {
            uri: qrResult.uri,
            qrCode: qrResult.qrCode,
            address: recipientAddress,
            amount: amountRaw,
            label,
            message,
            roundingPercent,
            status: exports.InvoiceStatus.WAITING,
            invoiceId,
        };
        this.invoiceMap.set(invoiceId, newInvoice);
        return invoiceId;
    }
    get(id) {
        return {
            id: id,
            data: this.invoiceMap.get(id)
        };
    }
    async attachWsListeners() {
        if (!this.ws)
            return;
        this.ws.send({
            "action": "subscribe",
            "topic": "confirmation",
        });
        this.ws.on("message", async (message) => {
            if (message.topic !== "confirmation" || message.message.block.subtype !== "send")
                return;
            const invoices = Array.from(this.invoiceMap.values());
            const link = message.message.block.link_as_account;
            const matchingInvoice = invoices.find(invoice => invoice.address === link);
            if (!matchingInvoice)
                return;
            const amountIn = parseFloat(rawToNano(matchingInvoice.amount));
            const amount = parseFloat(rawToNano(message.message.amount));
            const isAmountWithinRounding = Math.abs(amountIn - amount) <= (matchingInvoice.roundingPercent / 100) * Math.abs(amountIn);
            if (isAmountWithinRounding) {
                if (matchingInvoice.status === exports.InvoiceStatus.PAID)
                    return this.emit("error", { error: "Invoice already paid", invoice: matchingInvoice.invoiceId });
                this.invoiceMap.set(matchingInvoice.invoiceId, { ...matchingInvoice, status: exports.InvoiceStatus.PAID });
                this.emit('payment', this.get(matchingInvoice.invoiceId));
            }
            else {
                this.emit("error", { expectedAmount: amountIn, receivedAmount: amount, invoiceId: matchingInvoice.invoiceId, error: "Amount not within rounding" });
            }
        });
    }
    async checkStatus(id) {
        const invoice = this.invoiceMap.get(id);
        if (!invoice || invoice.status === exports.InvoiceStatus.PAID) {
            return invoice ? invoice.status : null;
        }
        const { amount, roundingPercent } = invoice;
        const amountIn = new Decimal(rawToNano(amount));
        const rpcResponse = await this.rpc.getAccountHistory(invoice.address, this.maxHistory);
        if (!rpcResponse || rpcResponse.length === 0) {
            return exports.InvoiceStatus.WAITING;
        }
        const isAmountWithinRounding = (amount) => amountIn.minus(amount).abs().lte(amountIn.times(roundingPercent / 100));
        for (const transaction of rpcResponse) {
            const receivedAmount = new Decimal(rawToNano(transaction.amount));
            if (isAmountWithinRounding(receivedAmount)) {
                this.invoiceMap.set(id, { ...invoice, status: exports.InvoiceStatus.PAID });
                return this.get(invoice.invoiceId);
            }
        }
        return exports.InvoiceStatus.WAITING;
    }
    remove(invoiceId) {
        this.invoiceMap.delete(invoiceId);
    }
}

const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('bundle.js', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
class Wallet extends EventEmitter {
    ws;
    rpc;
    storage;
    masterSeed;
    autoReceive;
    Block;
    deriveAccount;
    walletAccounts;
    constructor(masterSeed, { WS_URL, RPC_URL, WORK_SERVER, Headers, autoReceive = false }) {
        super();
        this.masterSeed = masterSeed;
        this.autoReceive = autoReceive;
        this.deriveAccount = deriveAccount;
        this.ws = new WebSocket(WS_URL);
        this.Block = () => new Block(this.rpc);
        this.rpc = new RPC(RPC_URL, Headers, WORK_SERVER);
        this.storage = new WalletStorage(this.masterSeed);
        this.walletAccounts = new Map();
        this._loadWallet();
        this.initialize();
        this.attachWsListener();
    }
    async attachWsListener() {
        if (this.autoReceive) {
            for (const [key, value] of this.walletAccounts) {
                const hashes = await this.Block().receiveAll(value.keys.privateKey);
                for (const hash of hashes) {
                    this.emit("receive", hash);
                }
            }
            this.ws.send({
                action: "subscribe",
                topic: "confirmation",
            });
            this.ws.on("message", async (message) => {
                if (message.topic === "confirmation") {
                    if (message.message.block.subtype === "send") {
                        if (this.walletAccounts.has(message.message.block.link_as_account)) {
                            const done = await this.Block().receive({ hash: message.message.hash, amount: message.message.amount }, this.walletAccounts.get(message.message.block.link_as_account).keys.privateKey);
                            this.emit("receive", done);
                        }
                    }
                }
            });
        }
        else {
            return;
        }
    }
    getAllAccounts() {
        return this.storage.getAllAccounts();
    }
    async initialize() {
        if (!(await this.isInitialized())) {
            this._searchAndLoadWallets(0, 20);
            console.log("Searching for used wallets...");
            this.setInitialized(true);
        }
        else {
            return this.emit("ready");
        }
    }
    async _loadWallet() {
        const accounts = this.storage.getAllAccounts();
        for (const account of accounts) {
            this.walletAccounts.set(account.address, account);
        }
        for (let i = 0; i < 1; i++) {
            const account = await this.deriveAccount(this.masterSeed, i);
            if (accounts.some(a => a.address === account.address))
                return;
            this.storage.addAccount(new Account(account));
            console.log("Index Account Derived.");
        }
    }
    async _searchAndLoadWallets(start, end) {
        const accounts = this.storage.getAllAccounts();
        for (let i = start; i < end; i++) {
            const account = await this.deriveAccount(this.masterSeed, i);
            if (accounts.some(a => a.address === account.address))
                continue;
            const accountHistory = await this.rpc.getAccountHistory(account.address);
            console.log(accountHistory);
            if (accountHistory.length > 0) {
                this.storage.addAccount(new Account(account));
                this.walletAccounts.set(account.address, account);
            } // else removed
        }
        this.emit("ready");
    }
    async isInitialized() {
        const db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
        const configPath = path.join(__dirname$1, `${db_init_path}.config.json`);
        try {
            const configFile = await fs$1.readFile(configPath, 'utf8');
            const config = JSON.parse(configFile);
            return config.isInitialized === true;
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                await fs$1.writeFile(configPath, JSON.stringify({ isInitialized: false }), 'utf8');
                return false;
            }
            else {
                throw error;
            }
        }
    }
    async setInitialized(value) {
        const db_init_path = crypto.scryptSync(crypto.createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
        const configPath = path.join(__dirname$1, `${db_init_path}.config.json`);
        const config = { isInitialized: value };
        await fs$1.writeFile(configPath, JSON.stringify(config), 'utf8');
    }
    async resetWallet() {
        try {
            this.storage.resetWallet();
            this.setInitialized(false);
            // fs find every file with *.config.json and ./sqlite/*.sqlite in __dirname
            const files = await fs$1.readdir(__dirname$1);
            const configFiles = files.filter(file => file.endsWith('.config.json'));
            const sqliteFiles = files.filter(file => file.endsWith('.sqlite'));
            for (const file of configFiles) {
                await fs$1.unlink(path.join(__dirname$1, file));
            }
            for (const file of sqliteFiles) {
                await fs$1.unlink(path.join(__dirname$1, file));
            }
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(`Error resetting wallet: ${e.message}`);
            }
            else {
                throw new Error('Error resetting wallet: unknown error');
            }
        }
    }
    addAccount(index) {
        if (this.walletAccounts.has(index))
            return this.storage.getAccountByIndex(index);
        const account = this.deriveAccount(this.masterSeed, index);
        this.storage.addAccount(new Account(account));
        this.walletAccounts.set(account.address, account);
        return account;
    }
    async send({ recipient, amount, from, isRaw = false }) {
        const account = Array.from(this.walletAccounts.values()).find(a => a._index === from);
        if (!account)
            throw new Error("Account not found");
        const dnz = await this.Block().send(recipient, amount, account.keys.privateKey, isRaw);
        this.emit("send", dnz);
        return dnz;
    }
    async setRepresentative({ newRepresentative, accountIndex }) {
        const accountEntry = Array.from(this.walletAccounts.values()).find(acc => acc._index === accountIndex);
        if (!accountEntry)
            throw new Error(`Account with index ${accountIndex} not found`);
        const donz = await this.Block().representative(newRepresentative, accountEntry.keys.privateKey);
        this.emit('representative', donz);
        return donz;
    }
    removeAccount(index) {
        if (index === 0)
            throw new Error("Cannot remove index account, use resetWallet() instead");
        const account = Array.from(this.walletAccounts.values()).find(a => a._index === index);
        if (!account)
            throw new Error("Account not found");
        this.storage.removeAccountByAddress(account.address);
        this.walletAccounts.delete(account.address);
    }
    getAccount(index) {
        const account = Array.from(this.walletAccounts.values()).find(a => a._index === index);
        if (!account)
            throw new Error("Account not found");
        return account;
    }
}
function randomMasterKey() {
    return crypto.randomBytes(32).toString('hex');
}

exports.InvoiceBuilder = InvoiceBuilder;
exports.RPC = RPC;
exports.Wallet = Wallet;
exports.WebSocket = WebSocket;
exports.createQr = createQr;
exports.nanoToRaw = nanoToRaw;
exports.randomMasterKey = randomMasterKey;
exports.rawToNano = rawToNano;
