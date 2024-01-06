"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = downloadURI;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
function downloadURI(_x, _x2) {
  return _downloadURI.apply(this, arguments);
}
function _downloadURI() {
  _downloadURI = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(uri, name) {
    var resp;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _axios["default"].get(uri);
        case 2:
          resp = _context.sent;
          return _context.abrupt("return", Buffer.from(resp.data));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _downloadURI.apply(this, arguments);
}