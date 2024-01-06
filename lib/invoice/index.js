"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvoiceStatus = void 0;
Object.defineProperty(exports, "createQr", {
  enumerable: true,
  get: function get() {
    return _qr["default"];
  }
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _qr = _interopRequireDefault(require("../qr"));
var _ws = _interopRequireDefault(require("../ws"));
var _convert = require("../utils/convert");
var _rpc = _interopRequireDefault(require("../rpc"));
var _events = _interopRequireDefault(require("events"));
var _uuid = require("uuid");
var _decimal = _interopRequireDefault(require("decimal.js"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var InvoiceStatus = exports.InvoiceStatus = /*#__PURE__*/function (InvoiceStatus) {
  InvoiceStatus["WAITING"] = "waiting";
  InvoiceStatus["PAID"] = "paid";
  return InvoiceStatus;
}(InvoiceStatus || {});
var InvoiceBuilder = exports["default"] = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(InvoiceBuilder, _EventEmitter);
  var _super = _createSuper(InvoiceBuilder);
  function InvoiceBuilder(options) {
    var _this;
    (0, _classCallCheck2["default"])(this, InvoiceBuilder);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "useRaw", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "liveUpdate", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "rpc", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ws", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "invoiceMap", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "maxHistory", void 0);
    var useRaw = options.useRaw,
      liveUpdate = options.liveUpdate,
      rpcEndpoint = options.rpcEndpoint,
      wsEndpoint = options.wsEndpoint,
      customHeaders = options.customHeaders;
    _this.useRaw = useRaw;
    _this.liveUpdate = liveUpdate;
    _this.rpc = new _rpc["default"](rpcEndpoint, customHeaders);
    _this.ws = wsEndpoint ? new _ws["default"](wsEndpoint) : undefined;
    _this.invoiceMap = new Map();
    _this.maxHistory = options.maxHistory || "50";
    if (_this.liveUpdate && _this.ws) {
      _this.attachWsListeners();
    }
    return _this;
  }
  (0, _createClass2["default"])(InvoiceBuilder, [{
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(invoiceData) {
        var recipientAddress, amountNano, label, message, roundingPercent, amountRaw, existingInvoice, qrResult, invoiceId, newInvoice;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              recipientAddress = invoiceData.recipientAddress, amountNano = invoiceData.amountNano, label = invoiceData.label, message = invoiceData.message, roundingPercent = invoiceData.roundingPercent;
              if (!(!recipientAddress || !amountNano || roundingPercent < 0)) {
                _context.next = 3;
                break;
              }
              throw new Error('Invalid input data for invoice creation.');
            case 3:
              amountRaw = this.useRaw ? amountNano.toString() : (0, _convert.nanoToRaw)(amountNano); // Check for duplicates
              existingInvoice = Array.from(this.invoiceMap.values()).find(function (invoice) {
                return invoice.address === recipientAddress && invoice.amount === amountRaw;
              });
              if (!existingInvoice) {
                _context.next = 7;
                break;
              }
              throw new Error('Invoice with the same recipient address and amount already exists.');
            case 7:
              _context.next = 9;
              return (0, _qr["default"])({
                address: recipientAddress,
                // @ts-ignore
                amount: amountRaw,
                label: label,
                message: message,
                isRaw: true
              });
            case 9:
              qrResult = _context.sent;
              invoiceId = (0, _uuid.v4)();
              newInvoice = {
                uri: qrResult.uri,
                qrCode: qrResult.qrCode,
                address: recipientAddress,
                amount: amountRaw,
                label: label,
                message: message,
                roundingPercent: roundingPercent,
                status: InvoiceStatus.WAITING,
                invoiceId: invoiceId
              };
              this.invoiceMap.set(invoiceId, newInvoice);
              return _context.abrupt("return", invoiceId);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function create(_x) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function get(id) {
      return {
        id: id,
        data: this.invoiceMap.get(id)
      };
    }
  }, {
    key: "attachWsListeners",
    value: function () {
      var _attachWsListeners = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _this2 = this;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (this.ws) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              this.ws.send({
                "action": "subscribe",
                "topic": "confirmation"
              });
              this.ws.on("message", /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
                  var invoices, link, matchingInvoice, amountIn, amount, isAmountWithinRounding;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(message.topic !== "confirmation" || message.message.block.subtype !== "send")) {
                          _context2.next = 2;
                          break;
                        }
                        return _context2.abrupt("return");
                      case 2:
                        invoices = Array.from(_this2.invoiceMap.values());
                        link = message.message.block.link_as_account;
                        matchingInvoice = invoices.find(function (invoice) {
                          return invoice.address === link;
                        });
                        if (matchingInvoice) {
                          _context2.next = 7;
                          break;
                        }
                        return _context2.abrupt("return");
                      case 7:
                        amountIn = parseFloat((0, _convert.rawToNano)(matchingInvoice.amount));
                        amount = parseFloat((0, _convert.rawToNano)(message.message.amount));
                        isAmountWithinRounding = Math.abs(amountIn - amount) <= matchingInvoice.roundingPercent / 100 * Math.abs(amountIn);
                        if (!isAmountWithinRounding) {
                          _context2.next = 17;
                          break;
                        }
                        if (!(matchingInvoice.status === InvoiceStatus.PAID)) {
                          _context2.next = 13;
                          break;
                        }
                        return _context2.abrupt("return", _this2.emit("error", {
                          error: "Invoice already paid",
                          invoice: matchingInvoice.invoiceId
                        }));
                      case 13:
                        _this2.invoiceMap.set(matchingInvoice.invoiceId, _objectSpread(_objectSpread({}, matchingInvoice), {}, {
                          status: InvoiceStatus.PAID
                        }));
                        _this2.emit('payment', _this2.get(matchingInvoice.invoiceId));
                        _context2.next = 18;
                        break;
                      case 17:
                        _this2.emit("error", {
                          expectedAmount: amountIn,
                          receivedAmount: amount,
                          invoiceId: matchingInvoice.invoiceId,
                          error: "Amount not within rounding"
                        });
                      case 18:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function attachWsListeners() {
        return _attachWsListeners.apply(this, arguments);
      }
      return attachWsListeners;
    }()
  }, {
    key: "checkStatus",
    value: function () {
      var _checkStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
        var invoice, amount, roundingPercent, amountIn, rpcResponse, isAmountWithinRounding, _iterator, _step, transaction, receivedAmount;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              invoice = this.invoiceMap.get(id);
              if (!(!invoice || invoice.status === InvoiceStatus.PAID)) {
                _context4.next = 3;
                break;
              }
              return _context4.abrupt("return", invoice ? invoice.status : null);
            case 3:
              amount = invoice.amount, roundingPercent = invoice.roundingPercent;
              amountIn = new _decimal["default"]((0, _convert.rawToNano)(amount));
              _context4.next = 7;
              return this.rpc.getAccountHistory(invoice.address);
            case 7:
              rpcResponse = _context4.sent;
              if (!(!rpcResponse || rpcResponse.length === 0)) {
                _context4.next = 10;
                break;
              }
              return _context4.abrupt("return", InvoiceStatus.WAITING);
            case 10:
              isAmountWithinRounding = function isAmountWithinRounding(amount) {
                return amountIn.minus(amount).abs().lte(amountIn.times(roundingPercent / 100));
              };
              _iterator = _createForOfIteratorHelper(rpcResponse);
              _context4.prev = 12;
              _iterator.s();
            case 14:
              if ((_step = _iterator.n()).done) {
                _context4.next = 22;
                break;
              }
              transaction = _step.value;
              receivedAmount = new _decimal["default"]((0, _convert.rawToNano)(transaction.amount));
              if (!isAmountWithinRounding(receivedAmount)) {
                _context4.next = 20;
                break;
              }
              this.invoiceMap.set(id, _objectSpread(_objectSpread({}, invoice), {}, {
                status: InvoiceStatus.PAID
              }));
              return _context4.abrupt("return", this.get(invoice.invoiceId));
            case 20:
              _context4.next = 14;
              break;
            case 22:
              _context4.next = 27;
              break;
            case 24:
              _context4.prev = 24;
              _context4.t0 = _context4["catch"](12);
              _iterator.e(_context4.t0);
            case 27:
              _context4.prev = 27;
              _iterator.f();
              return _context4.finish(27);
            case 30:
              return _context4.abrupt("return", InvoiceStatus.WAITING);
            case 31:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[12, 24, 27, 30]]);
      }));
      function checkStatus(_x3) {
        return _checkStatus.apply(this, arguments);
      }
      return checkStatus;
    }()
  }, {
    key: "remove",
    value: function remove(invoiceId) {
      this.invoiceMap["delete"](invoiceId);
    }
  }]);
  return InvoiceBuilder;
}(_events["default"]);