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
    var svg = _ref.svg,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRCornerDot);
    (0, _defineProperty2["default"])(this, "_element", void 0);
    (0, _defineProperty2["default"])(this, "_svg", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._svg = svg;
    this._type = type;
  }
  (0, _createClass2["default"])(QRCornerDot, [{
    key: "draw",
    value: function draw(x, y, size, rotation) {
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
        rotation: rotation
      });
    }
  }, {
    key: "_rotateFigure",
    value: function _rotateFigure(_ref2) {
      var _this$_element;
      var x = _ref2.x,
        y = _ref2.y,
        size = _ref2.size,
        _ref2$rotation = _ref2.rotation,
        rotation = _ref2$rotation === void 0 ? 0 : _ref2$rotation,
        draw = _ref2.draw;
      var cx = x + size / 2;
      var cy = y + size / 2;
      draw();
      (_this$_element = this._element) === null || _this$_element === void 0 || _this$_element.setAttribute("transform", "rotate(".concat(180 * rotation / Math.PI, ",").concat(cx, ",").concat(cy, ")"));
    }
  }, {
    key: "_basicDot",
    value: function _basicDot(args) {
      var _this = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this._element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          _this._element.setAttribute("cx", String(x + size / 2));
          _this._element.setAttribute("cy", String(y + size / 2));
          _this._element.setAttribute("r", String(size / 2));
        }
      }));
    }
  }, {
    key: "_basicSquare",
    value: function _basicSquare(args) {
      var _this2 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this2._element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          _this2._element.setAttribute("x", String(x));
          _this2._element.setAttribute("y", String(y));
          _this2._element.setAttribute("width", String(size));
          _this2._element.setAttribute("height", String(size));
        }
      }));
    }
  }, {
    key: "_drawDot",
    value: function _drawDot(_ref3) {
      var x = _ref3.x,
        y = _ref3.y,
        size = _ref3.size,
        rotation = _ref3.rotation;
      this._basicDot({
        x: x,
        y: y,
        size: size,
        rotation: rotation
      });
    }
  }, {
    key: "_drawSquare",
    value: function _drawSquare(_ref4) {
      var x = _ref4.x,
        y = _ref4.y,
        size = _ref4.size,
        rotation = _ref4.rotation;
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        rotation: rotation
      });
    }
  }]);
  return QRCornerDot;
}();