"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _cornerDotTypes = _interopRequireDefault(require("../../../constants/cornerDotTypes"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var QRCornerDot = exports["default"] = /*#__PURE__*/function () {
  function QRCornerDot(_ref) {
    var context = _ref.context,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRCornerDot);
    (0, _defineProperty2["default"])(this, "_context", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._context = context;
    this._type = type;
  }
  (0, _createClass2["default"])(QRCornerDot, [{
    key: "draw",
    value: function draw(x, y, size, rotation) {
      var context = this._context;
      var type = this._type;
      var drawFunction;
      switch (type) {
        case _cornerDotTypes["default"].square:
          drawFunction = this._drawSquare;
          break;
        case _cornerDotTypes["default"].dot:
        default:
          drawFunction = this._drawDot;
      }
      drawFunction.call(this, {
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: rotation
      });
    }
  }, {
    key: "_rotateFigure",
    value: function _rotateFigure(_ref2) {
      var x = _ref2.x,
        y = _ref2.y,
        size = _ref2.size,
        context = _ref2.context,
        _ref2$rotation = _ref2.rotation,
        rotation = _ref2$rotation === void 0 ? 0 : _ref2$rotation,
        draw = _ref2.draw;
      var cx = x + size / 2;
      var cy = y + size / 2;
      context.translate(cx, cy);
      rotation && context.rotate(rotation);
      draw();
      context.closePath();
      rotation && context.rotate(-rotation);
      context.translate(-cx, -cy);
    }
  }, {
    key: "_basicDot",
    value: function _basicDot(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(0, 0, size / 2, 0, Math.PI * 2);
        }
      }));
    }
  }, {
    key: "_basicSquare",
    value: function _basicSquare(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.rect(-size / 2, -size / 2, size, size);
        }
      }));
    }
  }, {
    key: "_drawDot",
    value: function _drawDot(_ref3) {
      var x = _ref3.x,
        y = _ref3.y,
        size = _ref3.size,
        context = _ref3.context,
        rotation = _ref3.rotation;
      this._basicDot({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: rotation
      });
    }
  }, {
    key: "_drawSquare",
    value: function _drawSquare(_ref4) {
      var x = _ref4.x,
        y = _ref4.y,
        size = _ref4.size,
        context = _ref4.context,
        rotation = _ref4.rotation;
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: rotation
      });
    }
  }]);
  return QRCornerDot;
}();