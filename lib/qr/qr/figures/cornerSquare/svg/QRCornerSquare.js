"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _cornerSquareTypes = _interopRequireDefault(require("../../../constants/cornerSquareTypes"));
var _jsdom = require("jsdom");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var dom = new _jsdom.JSDOM();
var document = dom.window.document;
var QRCornerSquare = exports["default"] = /*#__PURE__*/function () {
  function QRCornerSquare(_ref) {
    var svg = _ref.svg,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRCornerSquare);
    (0, _defineProperty2["default"])(this, "_element", void 0);
    (0, _defineProperty2["default"])(this, "_svg", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._svg = svg;
    this._type = type;
  }
  (0, _createClass2["default"])(QRCornerSquare, [{
    key: "draw",
    value: function draw(x, y, size, rotation) {
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
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this._element.setAttribute("clip-rule", "evenodd");
          _this._element.setAttribute("d", "M ".concat(x + size / 2, " ").concat(y) + // M cx, y //  Move to top of ring
          "a ".concat(size / 2, " ").concat(size / 2, " 0 1 0 0.1 0") + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
          "z" + // Z // Close the outer shape
          "m 0 ".concat(dotSize) + // m -1 outerRadius-innerRadius // Move to top point of inner radius
          "a ".concat(size / 2 - dotSize, " ").concat(size / 2 - dotSize, " 0 1 1 -0.1 0") + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
          "Z" // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
          );
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
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this2._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this2._element.setAttribute("clip-rule", "evenodd");
          _this2._element.setAttribute("d", "M ".concat(x, " ").concat(y) + "v ".concat(size) + "h ".concat(size) + "v ".concat(-size) + "z" + "M ".concat(x + dotSize, " ").concat(y + dotSize) + "h ".concat(size - 2 * dotSize) + "v ".concat(size - 2 * dotSize) + "h ".concat(-size + 2 * dotSize) + "z");
        }
      }));
    }
  }, {
    key: "_basicExtraRounded",
    value: function _basicExtraRounded(args) {
      var _this3 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      var dotSize = size / 7;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this3._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this3._element.setAttribute("clip-rule", "evenodd");
          _this3._element.setAttribute("d", "M ".concat(x, " ").concat(y + 2.5 * dotSize) + "v ".concat(2 * dotSize) + "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(dotSize * 2.5, " ").concat(dotSize * 2.5) + "h ".concat(2 * dotSize) + "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(dotSize * 2.5, " ").concat(-dotSize * 2.5) + "v ".concat(-2 * dotSize) + "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(-dotSize * 2.5, " ").concat(-dotSize * 2.5) + "h ".concat(-2 * dotSize) + "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(-dotSize * 2.5, " ").concat(dotSize * 2.5) + "M ".concat(x + 2.5 * dotSize, " ").concat(y + dotSize) + "h ".concat(2 * dotSize) + "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(dotSize * 1.5, " ").concat(dotSize * 1.5) + "v ".concat(2 * dotSize) + "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(-dotSize * 1.5, " ").concat(dotSize * 1.5) + "h ".concat(-2 * dotSize) + "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(-dotSize * 1.5, " ").concat(-dotSize * 1.5) + "v ".concat(-2 * dotSize) + "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(dotSize * 1.5, " ").concat(-dotSize * 1.5));
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
  }, {
    key: "_drawExtraRounded",
    value: function _drawExtraRounded(_ref5) {
      var x = _ref5.x,
        y = _ref5.y,
        size = _ref5.size,
        rotation = _ref5.rotation;
      this._basicExtraRounded({
        x: x,
        y: y,
        size: size,
        rotation: rotation
      });
    }
  }]);
  return QRCornerSquare;
}();