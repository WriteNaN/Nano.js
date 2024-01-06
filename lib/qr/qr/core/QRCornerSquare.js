"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _cornerSquareTypes = _interopRequireDefault(require("../constants/cornerSquareTypes"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var QRCornerSquare = exports["default"] = /*#__PURE__*/function () {
  function QRCornerSquare(_ref) {
    var context = _ref.context,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRCornerSquare);
    (0, _defineProperty2["default"])(this, "_context", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._context = context;
    this._type = type;
  }
  (0, _createClass2["default"])(QRCornerSquare, [{
    key: "draw",
    value: function draw(x, y, size, rotation) {
      var context = this._context;
      var type = this._type;
      var drawFunction;
      switch (type) {
        case _cornerSquareTypes["default"].square:
          drawFunction = this._drawSquare;
          break;
        case _cornerSquareTypes["default"].extraRounded:
          drawFunction = this._drawExtraRounded;
          break;
        case _cornerSquareTypes["default"].dot:
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
        rotation = _ref2.rotation,
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
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(0, 0, size / 2, 0, Math.PI * 2);
          context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
        }
      }));
    }
  }, {
    key: "_basicSquare",
    value: function _basicSquare(args) {
      var size = args.size,
        context = args.context;
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.rect(-size / 2, -size / 2, size, size);
          context.rect(-size / 2 + dotSize, -size / 2 + dotSize, size - 2 * dotSize, size - 2 * dotSize);
        }
      }));
    }
  }, {
    key: "_basicExtraRounded",
    value: function _basicExtraRounded(args) {
      var size = args.size,
        context = args.context;
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
          context.lineTo(dotSize, -3.5 * dotSize);
          context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
          context.lineTo(3.5 * dotSize, -dotSize);
          context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
          context.lineTo(-dotSize, 3.5 * dotSize);
          context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
          context.lineTo(-3.5 * dotSize, -dotSize);
          context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
          context.lineTo(dotSize, -2.5 * dotSize);
          context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
          context.lineTo(2.5 * dotSize, -dotSize);
          context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
          context.lineTo(-dotSize, 2.5 * dotSize);
          context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
          context.lineTo(-2.5 * dotSize, -dotSize);
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
  }, {
    key: "_drawExtraRounded",
    value: function _drawExtraRounded(_ref5) {
      var x = _ref5.x,
        y = _ref5.y,
        size = _ref5.size,
        context = _ref5.context,
        rotation = _ref5.rotation;
      this._basicExtraRounded({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: rotation
      });
    }
  }]);
  return QRCornerSquare;
}();