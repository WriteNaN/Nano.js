"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nanoToRaw = nanoToRaw;
exports.rawToNano = rawToNano;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
function nanoToRaw(amount) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var value = new _bignumber["default"](amount.toString());
  return value.shiftedBy(decimal).toFixed(0);
}
;
function rawToNano(amount) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var value = new _bignumber["default"](amount.toString());
  return value.shiftedBy(-decimal).toFixed(decimal, 1);
}
;