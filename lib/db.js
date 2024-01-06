"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Account = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));
var _path = _interopRequireDefault(require("path"));
var _crypto = _interopRequireDefault(require("crypto"));
var _gracefulGoodbye = _interopRequireDefault(require("graceful-goodbye"));
var _uuid = require("uuid");
var _fs = _interopRequireDefault(require("fs"));
var _url = require("url");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /**

* better-sqlite3 embedded localstorage

*/
require('@babel/register')({
  extensions: ['.js', '.ts']
});
// @ts-ignore
global.__filename = typeof __filename !== 'undefined' ? __filename : (0, _url.fileURLToPath)(require('url').pathToFileURL(__filename).toString());
global.__dirname = typeof __dirname !== 'undefined' ? __dirname : require('path').dirname(global.__filename);
var WalletStorage = /*#__PURE__*/function () {
  function WalletStorage(encryptionKey) {
    var _this = this;
    (0, _classCallCheck2["default"])(this, WalletStorage);
    (0, _defineProperty2["default"])(this, "encryptionKey", void 0);
    (0, _defineProperty2["default"])(this, "db", void 0);
    (0, _defineProperty2["default"])(this, "db_path", void 0);
    (0, _defineProperty2["default"])(this, "db_init_path", void 0);
    this.encryptionKey = encryptionKey;
    this.db_init_path = _crypto["default"].scryptSync(_crypto["default"].createHash("sha256").update(encryptionKey).digest("hex"), "salt", 16).toString("hex");
    this.db_path = _path["default"].join(__dirname, 'sqlite', "".concat(this.db_init_path, ".sqlite"));
    _fs["default"].mkdirSync(_path["default"].dirname(this.db_path), {
      recursive: true
    });
    if (!_fs["default"].existsSync(this.db_path)) _fs["default"].writeFileSync(this.db_path, '');
    this.db = new _betterSqlite["default"](this.db_path);
    this.initialize();
    (0, _gracefulGoodbye["default"])( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            console.log("gracefully closed wallet connection");
            _this.closeConnection();
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
  }
  (0, _createClass2["default"])(WalletStorage, [{
    key: "initialize",
    value: function initialize() {
      try {
        //db.exec('ALTER TABLE accounts ADD COLUMN address TEXT;'); debug
        this.db.exec("CREATE TABLE IF NOT EXISTS accounts (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        address TEXT,\n        keys BLOB,\n        _id TEXT,\n        _index INTEGER\n      );");
        //console.log('Database initialized.');
      } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
      }
    }
  }, {
    key: "addAccount",
    value: function addAccount(account) {
      try {
        var _id = (0, _uuid.v4)();
        var encryptedKeys = this.encryptData(JSON.stringify(account.keys));
        var stmt = this.db.prepare('INSERT INTO accounts (_id, address, keys, _index) VALUES (?, ?, ?, ?)');
        stmt.run(_id, account.address, encryptedKeys, account._index);
        return _id;
      } catch (error) {
        console.error('Error adding account:', error);
        return '';
      }
    }
  }, {
    key: "getAccount",
    value: function getAccount(accountId) {
      try {
        var stmt = this.db.prepare('SELECT * FROM accounts WHERE _id = ?');
        var _account = stmt.get(accountId);
        if (_account) {
          _account.keys = JSON.parse(this.decryptData(_account.keys));
          return _account;
        }
        return null;
      } catch (error) {
        console.error('Error getting account:', error);
        return null;
      }
    }
  }, {
    key: "getAccountByAddress",
    value: function getAccountByAddress(address) {
      try {
        var stmt = this.db.prepare('SELECT * FROM accounts WHERE address = ?');
        var _account2 = stmt.get(address);
        if (_account2) {
          _account2.keys = JSON.parse(this.decryptData(_account2.keys));
          return _account2;
        }
        return null;
      } catch (error) {
        console.error('Error getting account by address:', error);
        return null;
      }
    }
  }, {
    key: "getAccountByIndex",
    value: function getAccountByIndex(index) {
      try {
        var stmt = this.db.prepare('SELECT * FROM accounts WHERE _index = ?');
        var _account3 = stmt.get(index);
        if (_account3) {
          _account3.keys = JSON.parse(this.decryptData(_account3.keys));
          return _account3;
        }
        return null;
      } catch (error) {
        console.error('Error getting account by address:', error);
        return null;
      }
    }
  }, {
    key: "removeAccountByAddress",
    value: function removeAccountByAddress(address) {
      try {
        var stmt = this.db.prepare('DELETE FROM accounts WHERE address = ?');
        stmt.run(address);
      } catch (error) {
        console.error('Error removing account by address:', error);
      }
    }
  }, {
    key: "getAllAccounts",
    value: function getAllAccounts() {
      var _this2 = this;
      try {
        var stmt = this.db.prepare('SELECT * FROM accounts');
        return stmt.all().map(function (account) {
          return _objectSpread(_objectSpread({}, account), {}, {
            keys: JSON.parse(_this2.decryptData(account.keys))
          });
        });
      } catch (error) {
        console.error('Error getting all accounts:', error);
        return [];
      }
    }
  }, {
    key: "resetWallet",
    value: function resetWallet() {
      try {
        this.db.exec('DROP TABLE IF EXISTS accounts');
        console.log('Cleaned db');
        this.db.exec("CREATE TABLE IF NOT EXISTS accounts (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        address TEXT,\n        keys BLOB,\n        _id TEXT,\n        _index INTEGER\n      );");
      } catch (error) {
        console.error('Error deleting entire wallet:', error);
      }
    }
  }, {
    key: "closeConnection",
    value: function closeConnection() {
      try {
        this.db.close();
        //console.log('Database connection closed.');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }, {
    key: "encryptData",
    value: function encryptData(data) {
      var iv = _crypto["default"].randomBytes(16);
      var cipher = _crypto["default"].createCipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
      var encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher["final"]('hex');
      return Buffer.concat([iv, Buffer.from(encrypted, 'hex')]);
    }
  }, {
    key: "decryptData",
    value: function decryptData(encryptedData) {
      var iv = encryptedData.subarray(0, 16);
      var actualEncryptedData = encryptedData.subarray(16);
      var decipher = _crypto["default"].createDecipheriv('aes-256-cbc', this.generateKey(this.encryptionKey), iv);
      var decrypted = decipher.update(actualEncryptedData.toString('hex'), 'hex', 'utf8');
      decrypted += decipher["final"]('utf8');
      return decrypted;
    }
  }, {
    key: "generateKey",
    value: function generateKey(pass) {
      var key = _crypto["default"].scryptSync(pass, Buffer.from(_crypto["default"].createHash('sha512').update(pass).digest('hex')).subarray(0, 16), 32);
      return key;
    }
  }]);
  return WalletStorage;
}();
var Account = exports.Account = /*#__PURE__*/(0, _createClass2["default"])(function Account(_ref2) {
  var address = _ref2.address,
    keys = _ref2.keys,
    _index = _ref2._index;
  (0, _classCallCheck2["default"])(this, Account);
  (0, _defineProperty2["default"])(this, "id", void 0);
  (0, _defineProperty2["default"])(this, "address", void 0);
  (0, _defineProperty2["default"])(this, "_index", void 0);
  (0, _defineProperty2["default"])(this, "keys", void 0);
  this.address = address;
  this.keys = keys;
  this._index = _index;
});
var _default = exports["default"] = WalletStorage;