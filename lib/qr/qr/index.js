"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  dotTypes: true,
  cornerDotTypes: true,
  cornerSquareTypes: true,
  errorCorrectionLevels: true,
  errorCorrectionPercents: true,
  modes: true,
  qrTypes: true,
  drawTypes: true
};
Object.defineProperty(exports, "cornerDotTypes", {
  enumerable: true,
  get: function get() {
    return _cornerDotTypes["default"];
  }
});
Object.defineProperty(exports, "cornerSquareTypes", {
  enumerable: true,
  get: function get() {
    return _cornerSquareTypes["default"];
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "dotTypes", {
  enumerable: true,
  get: function get() {
    return _dotTypes["default"];
  }
});
Object.defineProperty(exports, "drawTypes", {
  enumerable: true,
  get: function get() {
    return _drawTypes["default"];
  }
});
Object.defineProperty(exports, "errorCorrectionLevels", {
  enumerable: true,
  get: function get() {
    return _errorCorrectionLevels["default"];
  }
});
Object.defineProperty(exports, "errorCorrectionPercents", {
  enumerable: true,
  get: function get() {
    return _errorCorrectionPercents["default"];
  }
});
Object.defineProperty(exports, "modes", {
  enumerable: true,
  get: function get() {
    return _modes["default"];
  }
});
Object.defineProperty(exports, "qrTypes", {
  enumerable: true,
  get: function get() {
    return _qrTypes["default"];
  }
});
var _QRCodeStyling = _interopRequireDefault(require("./core/QRCodeStyling"));
var _dotTypes = _interopRequireDefault(require("./constants/dotTypes"));
var _cornerDotTypes = _interopRequireDefault(require("./constants/cornerDotTypes"));
var _cornerSquareTypes = _interopRequireDefault(require("./constants/cornerSquareTypes"));
var _errorCorrectionLevels = _interopRequireDefault(require("./constants/errorCorrectionLevels"));
var _errorCorrectionPercents = _interopRequireDefault(require("./constants/errorCorrectionPercents"));
var _modes = _interopRequireDefault(require("./constants/modes"));
var _qrTypes = _interopRequireDefault(require("./constants/qrTypes"));
var _drawTypes = _interopRequireDefault(require("./constants/drawTypes"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});
var _default = exports["default"] = _QRCodeStyling["default"];