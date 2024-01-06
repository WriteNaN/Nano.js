"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _qrTypes = _interopRequireDefault(require("../constants/qrTypes"));
var _drawTypes = _interopRequireDefault(require("../constants/drawTypes"));
var _errorCorrectionLevels = _interopRequireDefault(require("../constants/errorCorrectionLevels"));
var defaultOptions = {
  type: _drawTypes["default"].canvas,
  width: 300,
  height: 300,
  data: "",
  margin: 0,
  qrOptions: {
    typeNumber: _qrTypes["default"][0],
    mode: undefined,
    errorCorrectionLevel: _errorCorrectionLevels["default"].Q
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
var _default = exports["default"] = defaultOptions;