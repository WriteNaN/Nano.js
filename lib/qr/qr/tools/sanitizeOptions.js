"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sanitizeOptions;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function sanitizeGradient(gradient) {
  var newGradient = _objectSpread({}, gradient);
  if (!newGradient.colorStops || !newGradient.colorStops.length) {
    throw "Field 'colorStops' is required in gradient";
  }
  if (newGradient.rotation) {
    newGradient.rotation = Number(newGradient.rotation);
  } else {
    newGradient.rotation = 0;
  }
  newGradient.colorStops = newGradient.colorStops.map(function (colorStop) {
    return _objectSpread(_objectSpread({}, colorStop), {}, {
      offset: Number(colorStop.offset)
    });
  });
  return newGradient;
}
function sanitizeOptions(options) {
  var newOptions = _objectSpread({}, options);
  newOptions.width = Number(newOptions.width);
  newOptions.height = Number(newOptions.height);
  newOptions.margin = Number(newOptions.margin);
  newOptions.imageOptions = _objectSpread(_objectSpread({}, newOptions.imageOptions), {}, {
    hideBackgroundDots: Boolean(newOptions.imageOptions.hideBackgroundDots),
    imageSize: Number(newOptions.imageOptions.imageSize),
    margin: Number(newOptions.imageOptions.margin)
  });
  if (newOptions.margin > Math.min(newOptions.width, newOptions.height)) {
    newOptions.margin = Math.min(newOptions.width, newOptions.height);
  }
  newOptions.dotsOptions = _objectSpread({}, newOptions.dotsOptions);
  if (newOptions.dotsOptions.gradient) {
    newOptions.dotsOptions.gradient = sanitizeGradient(newOptions.dotsOptions.gradient);
  }
  if (newOptions.cornersSquareOptions) {
    newOptions.cornersSquareOptions = _objectSpread({}, newOptions.cornersSquareOptions);
    if (newOptions.cornersSquareOptions.gradient) {
      newOptions.cornersSquareOptions.gradient = sanitizeGradient(newOptions.cornersSquareOptions.gradient);
    }
  }
  if (newOptions.cornersDotOptions) {
    newOptions.cornersDotOptions = _objectSpread({}, newOptions.cornersDotOptions);
    if (newOptions.cornersDotOptions.gradient) {
      newOptions.cornersDotOptions.gradient = sanitizeGradient(newOptions.cornersDotOptions.gradient);
    }
  }
  if (newOptions.backgroundOptions) {
    newOptions.backgroundOptions = _objectSpread({}, newOptions.backgroundOptions);
    if (newOptions.backgroundOptions.gradient) {
      newOptions.backgroundOptions.gradient = sanitizeGradient(newOptions.backgroundOptions.gradient);
    }
  }
  return newOptions;
}