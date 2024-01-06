"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "InvoiceBuilder", {
  enumerable: true,
  get: function get() {
    return _invoice["default"];
  }
});
Object.defineProperty(exports, "InvoiceStatus", {
  enumerable: true,
  get: function get() {
    return _invoice.InvoiceStatus;
  }
});
Object.defineProperty(exports, "RPC", {
  enumerable: true,
  get: function get() {
    return _rpc["default"];
  }
});
exports.Wallet = void 0;
Object.defineProperty(exports, "WebSocket", {
  enumerable: true,
  get: function get() {
    return _ws["default"];
  }
});
Object.defineProperty(exports, "createQr", {
  enumerable: true,
  get: function get() {
    return _invoice.createQr;
  }
});
Object.defineProperty(exports, "nanoToRaw", {
  enumerable: true,
  get: function get() {
    return _convert.nanoToRaw;
  }
});
Object.defineProperty(exports, "rawToNano", {
  enumerable: true,
  get: function get() {
    return _convert.rawToNano;
  }
});
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rpc = _interopRequireDefault(require("./rpc"));
var _ws = _interopRequireDefault(require("./ws"));
var _db = _interopRequireWildcard(require("./db"));
var _events = _interopRequireDefault(require("events"));
var _index = require("./utils/nanocurrency/index");
var _convert = require("./utils/convert");
var _promises = _interopRequireDefault(require("fs/promises"));
var _path = _interopRequireDefault(require("path"));
var _crypto = _interopRequireDefault(require("crypto"));
var _invoice = _interopRequireWildcard(require("./invoice"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
require('@babel/register')({
  extensions: ['.js', '.ts']
});
// @ts-ignore
global.__filename = typeof __filename !== 'undefined' ? __filename : require('url').fileURLToPath(require('url').pathToFileURL(__filename).toString());
global.__dirname = typeof __dirname !== 'undefined' ? __dirname : _path["default"].dirname(__filename);
var Wallet = exports.Wallet = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(Wallet, _EventEmitter);
  var _super = _createSuper(Wallet);
  function Wallet(masterSeed, _ref) {
    var _this;
    var WS_URL = _ref.WS_URL,
      RPC_URL = _ref.RPC_URL,
      WORK_SERVER = _ref.WORK_SERVER,
      Headers = _ref.Headers,
      _ref$autoReceive = _ref.autoReceive,
      autoReceive = _ref$autoReceive === void 0 ? false : _ref$autoReceive;
    (0, _classCallCheck2["default"])(this, Wallet);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ws", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "rpc", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "storage", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "masterSeed", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "autoReceive", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "Block", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "deriveAccount", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "walletAccounts", void 0);
    _this.masterSeed = masterSeed;
    _this.autoReceive = autoReceive;
    _this.deriveAccount = _index.deriveAccount;
    _this.ws = new _ws["default"](WS_URL);
    _this.Block = function () {
      return new _index.Block(_this.rpc);
    };
    _this.rpc = new _rpc["default"](RPC_URL, Headers, WORK_SERVER);
    _this.storage = new _db["default"](_this.masterSeed);
    _this.walletAccounts = new Map();
    _this._loadWallet();
    _this.initialize();
    _this.attachWsListener();
    return _this;
  }
  (0, _createClass2["default"])(Wallet, [{
    key: "attachWsListener",
    value: function () {
      var _attachWsListener = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;
        var _iterator, _step, _step$value, key, value, hashes, _iterator2, _step2, hash;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.autoReceive) {
                _context2.next = 25;
                break;
              }
              _iterator = _createForOfIteratorHelper(this.walletAccounts);
              _context2.prev = 2;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context2.next = 13;
                break;
              }
              _step$value = (0, _slicedToArray2["default"])(_step.value, 2), key = _step$value[0], value = _step$value[1];
              _context2.next = 8;
              return this.Block().receiveAll(value.keys.privateKey);
            case 8:
              hashes = _context2.sent;
              _iterator2 = _createForOfIteratorHelper(hashes);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  hash = _step2.value;
                  this.emit("receive", hash);
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            case 11:
              _context2.next = 4;
              break;
            case 13:
              _context2.next = 18;
              break;
            case 15:
              _context2.prev = 15;
              _context2.t0 = _context2["catch"](2);
              _iterator.e(_context2.t0);
            case 18:
              _context2.prev = 18;
              _iterator.f();
              return _context2.finish(18);
            case 21:
              this.ws.send({
                action: "subscribe",
                topic: "confirmation"
              });
              this.ws.on("message", /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message) {
                  var done;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        if (!(message.topic === "confirmation")) {
                          _context.next = 7;
                          break;
                        }
                        if (!(message.message.block.subtype === "send")) {
                          _context.next = 7;
                          break;
                        }
                        if (!_this2.walletAccounts.has(message.message.block.link_as_account)) {
                          _context.next = 7;
                          break;
                        }
                        _context.next = 5;
                        return _this2.Block().receive({
                          hash: message.message.hash,
                          amount: message.message.amount
                        }, _this2.walletAccounts.get(message.message.block.link_as_account).keys.privateKey);
                      case 5:
                        done = _context.sent;
                        _this2.emit("receive", done);
                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }());
              _context2.next = 26;
              break;
            case 25:
              return _context2.abrupt("return");
            case 26:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 15, 18, 21]]);
      }));
      function attachWsListener() {
        return _attachWsListener.apply(this, arguments);
      }
      return attachWsListener;
    }()
  }, {
    key: "getAllAccounts",
    value: function getAllAccounts() {
      return this.storage.getAllAccounts();
    }
  }, {
    key: "initialize",
    value: function () {
      var _initialize = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.isInitialized();
            case 2:
              if (_context3.sent) {
                _context3.next = 8;
                break;
              }
              this._searchAndLoadWallets(0, 20);
              console.log("Searching for used wallets...");
              this.setInitialized(true);
              _context3.next = 9;
              break;
            case 8:
              return _context3.abrupt("return", this.emit("ready"));
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "_loadWallet",
    value: function () {
      var _loadWallet2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var _this3 = this;
        var accounts, _iterator3, _step3, account, _loop, _ret, i;
        return _regenerator["default"].wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              accounts = this.storage.getAllAccounts();
              _iterator3 = _createForOfIteratorHelper(accounts);
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  account = _step3.value;
                  this.walletAccounts.set(account.address, account);
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                var account;
                return _regenerator["default"].wrap(function _loop$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return _this3.deriveAccount(_this3.masterSeed, i);
                    case 2:
                      account = _context4.sent;
                      if (!accounts.some(function (a) {
                        return a.address === account.address;
                      })) {
                        _context4.next = 5;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: void 0
                      });
                    case 5:
                      _this3.storage.addAccount(new _db.Account(account));
                      console.log("Index Account Derived.");
                    case 7:
                    case "end":
                      return _context4.stop();
                  }
                }, _loop);
              });
              i = 0;
            case 5:
              if (!(i < 1)) {
                _context5.next = 13;
                break;
              }
              return _context5.delegateYield(_loop(), "t0", 7);
            case 7:
              _ret = _context5.t0;
              if (!_ret) {
                _context5.next = 10;
                break;
              }
              return _context5.abrupt("return", _ret.v);
            case 10:
              i++;
              _context5.next = 5;
              break;
            case 13:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this);
      }));
      function _loadWallet() {
        return _loadWallet2.apply(this, arguments);
      }
      return _loadWallet;
    }()
  }, {
    key: "_searchAndLoadWallets",
    value: function () {
      var _searchAndLoadWallets2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(start, end) {
        var _this4 = this;
        var accounts, _loop2, i;
        return _regenerator["default"].wrap(function _callee5$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              accounts = this.storage.getAllAccounts();
              _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
                var account, accountHistory;
                return _regenerator["default"].wrap(function _loop2$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2;
                      return _this4.deriveAccount(_this4.masterSeed, i);
                    case 2:
                      account = _context6.sent;
                      if (!accounts.some(function (a) {
                        return a.address === account.address;
                      })) {
                        _context6.next = 5;
                        break;
                      }
                      return _context6.abrupt("return", 1);
                    case 5:
                      _context6.next = 7;
                      return _this4.rpc.getAccountHistory(account.address);
                    case 7:
                      accountHistory = _context6.sent;
                      console.log(accountHistory);
                      if (accountHistory.length > 0) {
                        _this4.storage.addAccount(new _db.Account(account));
                        _this4.walletAccounts.set(account.address, account);
                      } // else removed
                    case 10:
                    case "end":
                      return _context6.stop();
                  }
                }, _loop2);
              });
              i = start;
            case 3:
              if (!(i < end)) {
                _context7.next = 10;
                break;
              }
              return _context7.delegateYield(_loop2(), "t0", 5);
            case 5:
              if (!_context7.t0) {
                _context7.next = 7;
                break;
              }
              return _context7.abrupt("continue", 7);
            case 7:
              i++;
              _context7.next = 3;
              break;
            case 10:
              this.emit("ready");
            case 11:
            case "end":
              return _context7.stop();
          }
        }, _callee5, this);
      }));
      function _searchAndLoadWallets(_x2, _x3) {
        return _searchAndLoadWallets2.apply(this, arguments);
      }
      return _searchAndLoadWallets;
    }()
  }, {
    key: "isInitialized",
    value: function () {
      var _isInitialized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var db_init_path, configPath, configFile, config;
        return _regenerator["default"].wrap(function _callee6$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              db_init_path = _crypto["default"].scryptSync(_crypto["default"].createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
              configPath = _path["default"].join(__dirname, "".concat(db_init_path, ".config.json"));
              _context8.prev = 2;
              _context8.next = 5;
              return _promises["default"].readFile(configPath, 'utf8');
            case 5:
              configFile = _context8.sent;
              config = JSON.parse(configFile);
              return _context8.abrupt("return", config.isInitialized === true);
            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8["catch"](2);
              if (!(_context8.t0 instanceof Error && 'code' in _context8.t0 && _context8.t0.code === 'ENOENT')) {
                _context8.next = 18;
                break;
              }
              _context8.next = 15;
              return _promises["default"].writeFile(configPath, JSON.stringify({
                isInitialized: false
              }), 'utf8');
            case 15:
              return _context8.abrupt("return", false);
            case 18:
              throw _context8.t0;
            case 19:
            case "end":
              return _context8.stop();
          }
        }, _callee6, this, [[2, 10]]);
      }));
      function isInitialized() {
        return _isInitialized.apply(this, arguments);
      }
      return isInitialized;
    }()
  }, {
    key: "setInitialized",
    value: function () {
      var _setInitialized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(value) {
        var db_init_path, configPath, config;
        return _regenerator["default"].wrap(function _callee7$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              db_init_path = _crypto["default"].scryptSync(_crypto["default"].createHash("sha256").update(this.masterSeed).digest("hex"), "salt", 16).toString("hex");
              configPath = _path["default"].join(__dirname, "".concat(db_init_path, ".config.json"));
              config = {
                isInitialized: value
              };
              _context9.next = 5;
              return _promises["default"].writeFile(configPath, JSON.stringify(config), 'utf8');
            case 5:
            case "end":
              return _context9.stop();
          }
        }, _callee7, this);
      }));
      function setInitialized(_x4) {
        return _setInitialized.apply(this, arguments);
      }
      return setInitialized;
    }()
  }, {
    key: "resetWallet",
    value: function () {
      var _resetWallet = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        var files, configFiles, sqliteFiles, _iterator4, _step4, file, _iterator5, _step5, _file;
        return _regenerator["default"].wrap(function _callee8$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              this.storage.resetWallet();
              this.setInitialized(false);
              // fs find every file with *.config.json and ./sqlite/*.sqlite in __dirname
              _context10.next = 5;
              return _promises["default"].readdir(__dirname);
            case 5:
              files = _context10.sent;
              configFiles = files.filter(function (file) {
                return file.endsWith('.config.json');
              });
              sqliteFiles = files.filter(function (file) {
                return file.endsWith('.sqlite');
              });
              _iterator4 = _createForOfIteratorHelper(configFiles);
              _context10.prev = 9;
              _iterator4.s();
            case 11:
              if ((_step4 = _iterator4.n()).done) {
                _context10.next = 17;
                break;
              }
              file = _step4.value;
              _context10.next = 15;
              return _promises["default"].unlink(_path["default"].join(__dirname, file));
            case 15:
              _context10.next = 11;
              break;
            case 17:
              _context10.next = 22;
              break;
            case 19:
              _context10.prev = 19;
              _context10.t0 = _context10["catch"](9);
              _iterator4.e(_context10.t0);
            case 22:
              _context10.prev = 22;
              _iterator4.f();
              return _context10.finish(22);
            case 25:
              _iterator5 = _createForOfIteratorHelper(sqliteFiles);
              _context10.prev = 26;
              _iterator5.s();
            case 28:
              if ((_step5 = _iterator5.n()).done) {
                _context10.next = 34;
                break;
              }
              _file = _step5.value;
              _context10.next = 32;
              return _promises["default"].unlink(_path["default"].join(__dirname, _file));
            case 32:
              _context10.next = 28;
              break;
            case 34:
              _context10.next = 39;
              break;
            case 36:
              _context10.prev = 36;
              _context10.t1 = _context10["catch"](26);
              _iterator5.e(_context10.t1);
            case 39:
              _context10.prev = 39;
              _iterator5.f();
              return _context10.finish(39);
            case 42:
              _context10.next = 51;
              break;
            case 44:
              _context10.prev = 44;
              _context10.t2 = _context10["catch"](0);
              if (!(_context10.t2 instanceof Error)) {
                _context10.next = 50;
                break;
              }
              throw new Error("Error resetting wallet: ".concat(_context10.t2.message));
            case 50:
              throw new Error('Error resetting wallet: unknown error');
            case 51:
            case "end":
              return _context10.stop();
          }
        }, _callee8, this, [[0, 44], [9, 19, 22, 25], [26, 36, 39, 42]]);
      }));
      function resetWallet() {
        return _resetWallet.apply(this, arguments);
      }
      return resetWallet;
    }()
  }, {
    key: "addAccount",
    value: function addAccount(index) {
      if (this.walletAccounts.has(index)) return this.storage.getAccountByIndex(index);
      var account = this.deriveAccount(this.masterSeed, index);
      this.storage.addAccount(new _db.Account(account));
      this.walletAccounts.set(account.address, account);
      return account;
    }
  }, {
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref3) {
        var recipient, amount, from, _ref3$isRaw, isRaw, account, dnz;
        return _regenerator["default"].wrap(function _callee9$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              recipient = _ref3.recipient, amount = _ref3.amount, from = _ref3.from, _ref3$isRaw = _ref3.isRaw, isRaw = _ref3$isRaw === void 0 ? false : _ref3$isRaw;
              account = Array.from(this.walletAccounts.values()).find(function (a) {
                return a._index === from;
              });
              if (account) {
                _context11.next = 4;
                break;
              }
              throw new Error("Account not found");
            case 4:
              _context11.next = 6;
              return this.Block().send(recipient, amount, account.keys.privateKey, isRaw);
            case 6:
              dnz = _context11.sent;
              this.emit("send", dnz);
              return _context11.abrupt("return", dnz);
            case 9:
            case "end":
              return _context11.stop();
          }
        }, _callee9, this);
      }));
      function send(_x5) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "setRepresentative",
    value: function () {
      var _setRepresentative = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_ref4) {
        var newRepresentative, accountIndex, accountEntry, donz;
        return _regenerator["default"].wrap(function _callee10$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              newRepresentative = _ref4.newRepresentative, accountIndex = _ref4.accountIndex;
              accountEntry = Array.from(this.walletAccounts.values()).find(function (acc) {
                return acc._index === accountIndex;
              });
              if (accountEntry) {
                _context12.next = 4;
                break;
              }
              throw new Error("Account with index ".concat(accountIndex, " not found"));
            case 4:
              _context12.next = 6;
              return this.Block().representative(newRepresentative, accountEntry.keys.privateKey);
            case 6:
              donz = _context12.sent;
              this.emit('representative', donz);
              return _context12.abrupt("return", donz);
            case 9:
            case "end":
              return _context12.stop();
          }
        }, _callee10, this);
      }));
      function setRepresentative(_x6) {
        return _setRepresentative.apply(this, arguments);
      }
      return setRepresentative;
    }()
  }, {
    key: "removeAccount",
    value: function removeAccount(index) {
      if (index === 0) throw new Error("Cannot remove index account, use resetWallet() instead");
      var account = Array.from(this.walletAccounts.values()).find(function (a) {
        return a._index === index;
      });
      if (!account) throw new Error("Account not found");
      this.storage.removeAccountByAddress(account.address);
      this.walletAccounts["delete"](account.address);
    }
  }, {
    key: "getAccount",
    value: function getAccount(index) {
      var account = Array.from(this.walletAccounts.values()).find(function (a) {
        return a._index === index;
      });
      if (!account) throw new Error("Account not found");
      return account;
    }
  }]);
  return Wallet;
}(_events["default"]);