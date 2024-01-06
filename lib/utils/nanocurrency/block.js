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
var _multiNanoWeb = require("multi-nano-web");
var _nanocurrency = _interopRequireDefault(require("nanocurrency"));
var _convert = require("../convert");
/** 

* credits to my bro [Benskalz](https://github.com/Benskalz/simple-nano-wallet-js/blob/main/wallet/wallet.js) to help me with this <3

*/
var Block = exports["default"] = /*#__PURE__*/function () {
  function Block(rpc) {
    (0, _classCallCheck2["default"])(this, Block);
    (0, _defineProperty2["default"])(this, "rpc", void 0);
    (0, _defineProperty2["default"])(this, "amount", void 0);
    this.rpc = rpc;
  }
  (0, _createClass2["default"])(Block, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(toAddress, amount, privateKey) {
        var isRaw,
          publicKey,
          address,
          account_info,
          data,
          signedBlock,
          _publicKey,
          _address,
          _account_info,
          _data,
          _signedBlock,
          _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              isRaw = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
              if (!isRaw) {
                _context.next = 26;
                break;
              }
              this.amount = amount;
              publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
              address = _nanocurrency["default"].deriveAddress(publicKey, {
                useNanoPrefix: true
              });
              _context.next = 7;
              return this.rpc.account_info(address);
            case 7:
              account_info = _context.sent;
              if (!account_info.error) {
                _context.next = 10;
                break;
              }
              throw new Error("Error from RPC", account_info.error);
            case 10:
              _context.t0 = account_info.balance;
              _context.t1 = address;
              _context.t2 = toAddress;
              _context.t3 = account_info.representative;
              _context.t4 = this.amount.toString();
              _context.t5 = account_info.frontier;
              _context.next = 18;
              return this.rpc.work_generate(account_info.frontier);
            case 18:
              _context.t6 = _context.sent;
              data = {
                walletBalanceRaw: _context.t0,
                fromAddress: _context.t1,
                toAddress: _context.t2,
                representativeAddress: _context.t3,
                amountRaw: _context.t4,
                frontier: _context.t5,
                work: _context.t6
              };
              signedBlock = _multiNanoWeb.block.send(data, privateKey);
              _context.next = 23;
              return this.rpc.process(signedBlock);
            case 23:
              return _context.abrupt("return", _context.sent);
            case 26:
              this.amount = parseInt((0, _convert.nanoToRaw)(amount));
              _publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
              _address = _nanocurrency["default"].deriveAddress(_publicKey, {
                useNanoPrefix: true
              });
              _context.next = 31;
              return this.rpc.account_info(_address);
            case 31:
              _account_info = _context.sent;
              if (!_account_info.error) {
                _context.next = 34;
                break;
              }
              throw new Error("Error from RPC", _account_info.error);
            case 34:
              _context.t7 = _account_info.balance;
              _context.t8 = _address;
              _context.t9 = toAddress;
              _context.t10 = _account_info.representative;
              _context.t11 = this.amount.toString();
              _context.t12 = _account_info.frontier;
              _context.next = 42;
              return this.rpc.work_generate(_account_info.frontier);
            case 42:
              _context.t13 = _context.sent;
              _data = {
                walletBalanceRaw: _context.t7,
                fromAddress: _context.t8,
                toAddress: _context.t9,
                representativeAddress: _context.t10,
                amountRaw: _context.t11,
                frontier: _context.t12,
                work: _context.t13
              };
              _signedBlock = _multiNanoWeb.block.send(_data, privateKey);
              _context.next = 47;
              return this.rpc.process(_signedBlock);
            case 47:
              return _context.abrupt("return", _context.sent);
            case 48:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x, _x2, _x3) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "representative",
    value: function () {
      var _representative = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(repAddress, privateKey) {
        var publicKey, address, account_info, toSign, signedBlock;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
              address = _nanocurrency["default"].deriveAddress(publicKey, {
                useNanoPrefix: true
              });
              _context2.next = 4;
              return this.rpc.account_info(address);
            case 4:
              account_info = _context2.sent;
              if (!(account_info.error === "Account not found")) {
                _context2.next = 7;
                break;
              }
              throw new Error("Account has to be opened before changing representative!");
            case 7:
              _context2.t0 = account_info.balance;
              _context2.t1 = repAddress;
              _context2.t2 = address;
              _context2.t3 = account_info.frontier;
              _context2.next = 13;
              return this.rpc.work_generate(account_info.frontier);
            case 13:
              _context2.t4 = _context2.sent;
              toSign = {
                walletBalanceRaw: _context2.t0,
                representativeAddress: _context2.t1,
                address: _context2.t2,
                frontier: _context2.t3,
                work: _context2.t4
              };
              signedBlock = _multiNanoWeb.block.representative(toSign, privateKey);
              _context2.next = 18;
              return this.rpc.process(signedBlock);
            case 18:
              return _context2.abrupt("return", _context2.sent);
            case 19:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function representative(_x4, _x5) {
        return _representative.apply(this, arguments);
      }
      return representative;
    }()
  }, {
    key: "receive",
    value: function () {
      var _receive = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(pendingTx, privateKey) {
        var openRep,
          publicKey,
          address,
          account_info,
          data,
          signedBlock,
          r,
          _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              openRep = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "nano_1gmor8qytb6os131yriu3xwt6a8wukaos3eg9yfno1x5kpm6uwgowqix89cq";
              publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
              address = _nanocurrency["default"].deriveAddress(publicKey, {
                useNanoPrefix: true
              });
              _context3.next = 5;
              return this.rpc.account_info(address);
            case 5:
              account_info = _context3.sent;
              data = {
                toAddress: address,
                transactionHash: pendingTx.hash,
                amountRaw: pendingTx.amount.toString(),
                walletBalanceRaw: "0",
                frontier: "0",
                representativeAddress: openRep
              };
              if (!(account_info.error === "Account not found")) {
                _context3.next = 16;
                break;
              }
              //console.log("proceeding to open acc");
              data.walletBalanceRaw = "0";
              data.representativeAddress = openRep;
              data.frontier = "0".repeat(64);
              _context3.next = 13;
              return this.rpc.work_generate(publicKey);
            case 13:
              data.work = _context3.sent;
              _context3.next = 22;
              break;
            case 16:
              data.walletBalanceRaw = account_info.balance;
              data.representativeAddress = account_info.representative;
              data.frontier = account_info.frontier;
              _context3.next = 21;
              return this.rpc.work_generate(account_info.frontier);
            case 21:
              data.work = _context3.sent;
            case 22:
              signedBlock = _multiNanoWeb.block.receive(data, privateKey);
              _context3.next = 25;
              return this.rpc.process(signedBlock, "receive");
            case 25:
              r = _context3.sent;
              return _context3.abrupt("return", r);
            case 27:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function receive(_x6, _x7) {
        return _receive.apply(this, arguments);
      }
      return receive;
    }()
  }, {
    key: "receiveAll",
    value: function () {
      var _receiveAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(privateKey) {
        var publicKey, address, done, receivable, transaction, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
              address = _nanocurrency["default"].deriveAddress(publicKey, {
                useNanoPrefix: true
              });
              done = [];
            case 3:
              if (!true) {
                _context4.next = 22;
                break;
              }
              _context4.next = 6;
              return this.rpc.receivable(address);
            case 6:
              receivable = _context4.sent;
              if (!(Object.keys(receivable).length === 0)) {
                _context4.next = 9;
                break;
              }
              return _context4.abrupt("break", 22);
            case 9:
              transaction = {
                hash: Object.keys(receivable)[0],
                amount: receivable[Object.keys(receivable)[0]]
              };
              _context4.prev = 10;
              _context4.next = 13;
              return this.receive(transaction, privateKey);
            case 13:
              result = _context4.sent;
              done.push(result);
              _context4.next = 20;
              break;
            case 17:
              _context4.prev = 17;
              _context4.t0 = _context4["catch"](10);
              throw _context4.t0;
            case 20:
              _context4.next = 3;
              break;
            case 22:
              return _context4.abrupt("return", done);
            case 23:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[10, 17]]);
      }));
      function receiveAll(_x8) {
        return _receiveAll.apply(this, arguments);
      }
      return receiveAll;
    }()
  }]);
  return Block;
}();