"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getMode;
var _modes = _interopRequireDefault(require("../constants/modes"));
function getMode(data) {
  switch (true) {
    case /^[0-9]*$/.test(data):
      return _modes["default"].numeric;
    case /^[0-9A-Z $%*+\-./:]*$/.test(data):
      return _modes["default"].alphanumeric;
    default:
      return _modes["default"]["byte"];
  }
}