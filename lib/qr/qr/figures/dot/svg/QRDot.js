"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _dotTypes = _interopRequireDefault(require("../../../constants/dotTypes"));
var _jsdom = require("jsdom");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var dom = new _jsdom.JSDOM();
var document = dom.window.document;
var QRDot = exports["default"] = /*#__PURE__*/function () {
  function QRDot(_ref) {
    var svg = _ref.svg,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRDot);
    (0, _defineProperty2["default"])(this, "_element", void 0);
    (0, _defineProperty2["default"])(this, "_svg", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._svg = svg;
    this._type = type;
  }
  (0, _createClass2["default"])(QRDot, [{
    key: "draw",
    value: function draw(x, y, size, getNeighbor) {
      var type = this._type;
      var drawFunction;
      switch (type) {
        case _dotTypes["default"].dots:
          drawFunction = this._drawDot;
          break;
        case _dotTypes["default"].classy:
          drawFunction = this._drawClassy;
          break;
        case _dotTypes["default"].classyRounded:
          drawFunction = this._drawClassyRounded;
          break;
        case _dotTypes["default"].rounded:
          drawFunction = this._drawRounded;
          break;
        case _dotTypes["default"].extraRounded:
          drawFunction = this._drawExtraRounded;
          break;
        case _dotTypes["default"].square:
        default:
          drawFunction = this._drawSquare;
      }
      drawFunction.call(this, {
        x: x,
        y: y,
        size: size,
        getNeighbor: getNeighbor
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

    //if rotation === 0 - right side is rounded
  }, {
    key: "_basicSideRounded",
    value: function _basicSideRounded(args) {
      var _this3 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this3._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this3._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
          "v ".concat(size) + //draw line to left bottom corner
          "h ".concat(size / 2) + //draw line to left bottom corner + half of size right
          "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, 0 ").concat(-size) // draw rounded corner
          );
        }
      }));
    }

    //if rotation === 0 - top right corner is rounded
  }, {
    key: "_basicCornerRounded",
    value: function _basicCornerRounded(args) {
      var _this4 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this4._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this4._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
          "v ".concat(size) + //draw line to left bottom corner
          "h ".concat(size) + //draw line to right bottom corner
          "v ".concat(-size / 2) + //draw line to right bottom corner + half of size top
          "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(-size / 2, " ").concat(-size / 2) // draw rounded corner
          );
        }
      }));
    }

    //if rotation === 0 - top right corner is rounded
  }, {
    key: "_basicCornerExtraRounded",
    value: function _basicCornerExtraRounded(args) {
      var _this5 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this5._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this5._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
          "v ".concat(size) + //draw line to left bottom corner
          "h ".concat(size) + //draw line to right bottom corner
          "a ".concat(size, " ").concat(size, ", 0, 0, 0, ").concat(-size, " ").concat(-size) // draw rounded top right corner
          );
        }
      }));
    }

    //if rotation === 0 - left bottom and right top corners are rounded
  }, {
    key: "_basicCornersRounded",
    value: function _basicCornersRounded(args) {
      var _this6 = this;
      var size = args.size,
        x = args.x,
        y = args.y;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          _this6._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          _this6._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to left top position
          "v ".concat(size / 2) + //draw line to left top corner + half of size bottom
          "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(size / 2, " ").concat(size / 2) + // draw rounded left bottom corner
          "h ".concat(size / 2) + //draw line to right bottom corner
          "v ".concat(-size / 2) + //draw line to right bottom corner + half of size top
          "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(-size / 2, " ").concat(-size / 2) // draw rounded right top corner
          );
        }
      }));
    }
  }, {
    key: "_drawDot",
    value: function _drawDot(_ref3) {
      var x = _ref3.x,
        y = _ref3.y,
        size = _ref3.size;
      this._basicDot({
        x: x,
        y: y,
        size: size,
        rotation: 0
      });
    }
  }, {
    key: "_drawSquare",
    value: function _drawSquare(_ref4) {
      var x = _ref4.x,
        y = _ref4.y,
        size = _ref4.size;
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        rotation: 0
      });
    }
  }, {
    key: "_drawRounded",
    value: function _drawRounded(_ref5) {
      var x = _ref5.x,
        y = _ref5.y,
        size = _ref5.size,
        getNeighbor = _ref5.getNeighbor;
      var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
      var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
      var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
      var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
      var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
      if (neighborsCount === 0) {
        this._basicDot({
          x: x,
          y: y,
          size: size,
          rotation: 0
        });
        return;
      }
      if (neighborsCount > 2 || leftNeighbor && rightNeighbor || topNeighbor && bottomNeighbor) {
        this._basicSquare({
          x: x,
          y: y,
          size: size,
          rotation: 0
        });
        return;
      }
      if (neighborsCount === 2) {
        var rotation = 0;
        if (leftNeighbor && topNeighbor) {
          rotation = Math.PI / 2;
        } else if (topNeighbor && rightNeighbor) {
          rotation = Math.PI;
        } else if (rightNeighbor && bottomNeighbor) {
          rotation = -Math.PI / 2;
        }
        this._basicCornerRounded({
          x: x,
          y: y,
          size: size,
          rotation: rotation
        });
        return;
      }
      if (neighborsCount === 1) {
        var _rotation = 0;
        if (topNeighbor) {
          _rotation = Math.PI / 2;
        } else if (rightNeighbor) {
          _rotation = Math.PI;
        } else if (bottomNeighbor) {
          _rotation = -Math.PI / 2;
        }
        this._basicSideRounded({
          x: x,
          y: y,
          size: size,
          rotation: _rotation
        });
        return;
      }
    }
  }, {
    key: "_drawExtraRounded",
    value: function _drawExtraRounded(_ref6) {
      var x = _ref6.x,
        y = _ref6.y,
        size = _ref6.size,
        getNeighbor = _ref6.getNeighbor;
      var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
      var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
      var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
      var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
      var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
      if (neighborsCount === 0) {
        this._basicDot({
          x: x,
          y: y,
          size: size,
          rotation: 0
        });
        return;
      }
      if (neighborsCount > 2 || leftNeighbor && rightNeighbor || topNeighbor && bottomNeighbor) {
        this._basicSquare({
          x: x,
          y: y,
          size: size,
          rotation: 0
        });
        return;
      }
      if (neighborsCount === 2) {
        var rotation = 0;
        if (leftNeighbor && topNeighbor) {
          rotation = Math.PI / 2;
        } else if (topNeighbor && rightNeighbor) {
          rotation = Math.PI;
        } else if (rightNeighbor && bottomNeighbor) {
          rotation = -Math.PI / 2;
        }
        this._basicCornerExtraRounded({
          x: x,
          y: y,
          size: size,
          rotation: rotation
        });
        return;
      }
      if (neighborsCount === 1) {
        var _rotation2 = 0;
        if (topNeighbor) {
          _rotation2 = Math.PI / 2;
        } else if (rightNeighbor) {
          _rotation2 = Math.PI;
        } else if (bottomNeighbor) {
          _rotation2 = -Math.PI / 2;
        }
        this._basicSideRounded({
          x: x,
          y: y,
          size: size,
          rotation: _rotation2
        });
        return;
      }
    }
  }, {
    key: "_drawClassy",
    value: function _drawClassy(_ref7) {
      var x = _ref7.x,
        y = _ref7.y,
        size = _ref7.size,
        getNeighbor = _ref7.getNeighbor;
      var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
      var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
      var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
      var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
      var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
      if (neighborsCount === 0) {
        this._basicCornersRounded({
          x: x,
          y: y,
          size: size,
          rotation: Math.PI / 2
        });
        return;
      }
      if (!leftNeighbor && !topNeighbor) {
        this._basicCornerRounded({
          x: x,
          y: y,
          size: size,
          rotation: -Math.PI / 2
        });
        return;
      }
      if (!rightNeighbor && !bottomNeighbor) {
        this._basicCornerRounded({
          x: x,
          y: y,
          size: size,
          rotation: Math.PI / 2
        });
        return;
      }
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        rotation: 0
      });
    }
  }, {
    key: "_drawClassyRounded",
    value: function _drawClassyRounded(_ref8) {
      var x = _ref8.x,
        y = _ref8.y,
        size = _ref8.size,
        getNeighbor = _ref8.getNeighbor;
      var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
      var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
      var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
      var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
      var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
      if (neighborsCount === 0) {
        this._basicCornersRounded({
          x: x,
          y: y,
          size: size,
          rotation: Math.PI / 2
        });
        return;
      }
      if (!leftNeighbor && !topNeighbor) {
        this._basicCornerExtraRounded({
          x: x,
          y: y,
          size: size,
          rotation: -Math.PI / 2
        });
        return;
      }
      if (!rightNeighbor && !bottomNeighbor) {
        this._basicCornerExtraRounded({
          x: x,
          y: y,
          size: size,
          rotation: Math.PI / 2
        });
        return;
      }
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        rotation: 0
      });
    }
  }]);
  return QRDot;
}();