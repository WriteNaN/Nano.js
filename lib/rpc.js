"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/** 

* Thanks to https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/ - adapted to use with typescript

*/

var fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (error) {
  fetch = require('node-fetch');
}
var RPC = /*#__PURE__*/function () {
  /** 
  * Initializes the RPC client for blockchain queries.
  * @param {string} RPC_URL - The URL of the RPC endpoint.
  * @param {string} WORK_URL - The URL of the work server used to generate work; falls back to RPC if not provided.
  * @param {Record<string, any>} customHeaders - Optional headers for authentication.
  */
  function RPC(RPC_URL) {
    var customHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var WORK_URL = arguments.length > 2 ? arguments[2] : undefined;
    (0, _classCallCheck2["default"])(this, RPC);
    (0, _defineProperty2["default"])(this, "rpcURL", void 0);
    (0, _defineProperty2["default"])(this, "worURL", void 0);
    (0, _defineProperty2["default"])(this, "headerAuth", void 0);
    this.rpcURL = RPC_URL;
    this.worURL = WORK_URL || RPC_URL;
    this.headerAuth = customHeaders;
  }
  (0, _createClass2["default"])(RPC, [{
    key: "account_info",
    value: function () {
      var _account_info = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(account) {
        var params;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              params = {
                action: "account_info",
                account: account,
                representative: "true"
              };
              return _context.abrupt("return", this.req(params));
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function account_info(_x) {
        return _account_info.apply(this, arguments);
      }
      return account_info;
    }()
  }, {
    key: "work_generate",
    value: function () {
      var _work_generate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(hash) {
        var params, r;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              params = {
                action: "work_generate",
                hash: hash
              };
              _context2.next = 3;
              return this.req(params);
            case 3:
              r = _context2.sent;
              if (r.work) {
                _context2.next = 6;
                break;
              }
              throw new Error("work_generate failed on ".concat(this.worURL, ": ").concat(JSON.stringify(r)));
            case 6:
              return _context2.abrupt("return", r.work);
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function work_generate(_x2) {
        return _work_generate.apply(this, arguments);
      }
      return work_generate;
    }()
  }, {
    key: "receivable",
    value: function () {
      var _receivable = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(account) {
        var params, r;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              params = {
                action: "pending",
                account: account,
                threshold: "1"
              };
              _context3.next = 3;
              return this.req(params);
            case 3:
              r = _context3.sent;
              return _context3.abrupt("return", r.blocks || []);
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function receivable(_x3) {
        return _receivable.apply(this, arguments);
      }
      return receivable;
    }()
  }, {
    key: "getAccountHistory",
    value: function () {
      var _getAccountHistory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(account) {
        var params, r;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              params = {
                action: "account_history",
                account: account,
                count: "2"
              };
              _context4.next = 3;
              return this.req(params);
            case 3:
              r = _context4.sent;
              return _context4.abrupt("return", r.history || []);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getAccountHistory(_x4) {
        return _getAccountHistory.apply(this, arguments);
      }
      return getAccountHistory;
    }()
  }, {
    key: "process",
    value: function () {
      var _process = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(block, subtype) {
        var params;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              params = {
                action: "process",
                json_block: "true",
                subtype: subtype,
                block: block
              };
              return _context5.abrupt("return", this.req(params));
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function process(_x5, _x6) {
        return _process.apply(this, arguments);
      }
      return process;
    }()
  }, {
    key: "req",
    value: function () {
      var _req = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(params) {
        var url, response, data;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              url = params.action === "work_generate" ? this.worURL : this.rpcURL;
              _context6.prev = 1;
              _context6.next = 4;
              return fetch(url, {
                method: "POST",
                headers: _objectSpread(_objectSpread({}, this.headerAuth), {}, {
                  'Content-Type': 'application/json'
                }),
                body: JSON.stringify(params)
              });
            case 4:
              response = _context6.sent;
              if (response.ok) {
                _context6.next = 7;
                break;
              }
              throw new Error("HTTP error: ".concat(response.statusText));
            case 7:
              _context6.next = 9;
              return response.json();
            case 9:
              data = _context6.sent;
              return _context6.abrupt("return", data);
            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](1);
              if (!(_context6.t0 instanceof Error)) {
                _context6.next = 19;
                break;
              }
              throw new Error("RPC error: ".concat(_context6.t0.message));
            case 19:
              throw new Error("RPC error: ".concat(_context6.t0));
            case 20:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[1, 13]]);
      }));
      function req(_x7) {
        return _req.apply(this, arguments);
      }
      return req;
    }()
  }]);
  return RPC;
}();
var _default = exports["default"] = RPC;