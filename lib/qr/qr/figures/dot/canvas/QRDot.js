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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var QRDot = exports["default"] = /*#__PURE__*/function () {
  function QRDot(_ref) {
    var context = _ref.context,
      type = _ref.type;
    (0, _classCallCheck2["default"])(this, QRDot);
    (0, _defineProperty2["default"])(this, "_context", void 0);
    (0, _defineProperty2["default"])(this, "_type", void 0);
    this._context = context;
    this._type = type;
  }
  (0, _createClass2["default"])(QRDot, [{
    key: "draw",
    value: function draw(x, y, size, getNeighbor) {
      var context = this._context;
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
        context: context,
        getNeighbor: getNeighbor
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

    //if rotation === 0 - right side is rounded
  }, {
    key: "_basicSideRounded",
    value: function _basicSideRounded(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
          context.lineTo(-size / 2, size / 2);
          context.lineTo(-size / 2, -size / 2);
          context.lineTo(0, -size / 2);
        }
      }));
    }

    //if rotation === 0 - top right corner is rounded
  }, {
    key: "_basicCornerRounded",
    value: function _basicCornerRounded(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(0, 0, size / 2, -Math.PI / 2, 0);
          context.lineTo(size / 2, size / 2);
          context.lineTo(-size / 2, size / 2);
          context.lineTo(-size / 2, -size / 2);
          context.lineTo(0, -size / 2);
        }
      }));
    }

    //if rotation === 0 - top right corner is rounded
  }, {
    key: "_basicCornerExtraRounded",
    value: function _basicCornerExtraRounded(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
          context.lineTo(-size / 2, size / 2);
          context.lineTo(-size / 2, -size / 2);
        }
      }));
    }
  }, {
    key: "_basicCornersRounded",
    value: function _basicCornersRounded(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(0, 0, size / 2, -Math.PI / 2, 0);
          context.lineTo(size / 2, size / 2);
          context.lineTo(0, size / 2);
          context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
          context.lineTo(-size / 2, -size / 2);
          context.lineTo(0, -size / 2);
        }
      }));
    }
  }, {
    key: "_basicCornersExtraRounded",
    value: function _basicCornersExtraRounded(args) {
      var size = args.size,
        context = args.context;
      this._rotateFigure(_objectSpread(_objectSpread({}, args), {}, {
        draw: function draw() {
          context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
          context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
        }
      }));
    }
  }, {
    key: "_drawDot",
    value: function _drawDot(_ref3) {
      var x = _ref3.x,
        y = _ref3.y,
        size = _ref3.size,
        context = _ref3.context;
      this._basicDot({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: 0
      });
    }
  }, {
    key: "_drawSquare",
    value: function _drawSquare(_ref4) {
      var x = _ref4.x,
        y = _ref4.y,
        size = _ref4.size,
        context = _ref4.context;
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: 0
      });
    }
  }, {
    key: "_drawRounded",
    value: function _drawRounded(_ref5) {
      var x = _ref5.x,
        y = _ref5.y,
        size = _ref5.size,
        context = _ref5.context,
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
          context: context,
          rotation: 0
        });
        return;
      }
      if (neighborsCount > 2 || leftNeighbor && rightNeighbor || topNeighbor && bottomNeighbor) {
        this._basicSquare({
          x: x,
          y: y,
          size: size,
          context: context,
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
          context: context,
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
          context: context,
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
        context = _ref6.context,
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
          context: context,
          rotation: 0
        });
        return;
      }
      if (neighborsCount > 2 || leftNeighbor && rightNeighbor || topNeighbor && bottomNeighbor) {
        this._basicSquare({
          x: x,
          y: y,
          size: size,
          context: context,
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
          context: context,
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
          context: context,
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
        context = _ref7.context,
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
          context: context,
          rotation: Math.PI / 2
        });
        return;
      }
      if (!leftNeighbor && !topNeighbor) {
        this._basicCornerRounded({
          x: x,
          y: y,
          size: size,
          context: context,
          rotation: -Math.PI / 2
        });
        return;
      }
      if (!rightNeighbor && !bottomNeighbor) {
        this._basicCornerRounded({
          x: x,
          y: y,
          size: size,
          context: context,
          rotation: Math.PI / 2
        });
        return;
      }
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: 0
      });
    }
  }, {
    key: "_drawClassyRounded",
    value: function _drawClassyRounded(_ref8) {
      var x = _ref8.x,
        y = _ref8.y,
        size = _ref8.size,
        context = _ref8.context,
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
          context: context,
          rotation: Math.PI / 2
        });
        return;
      }
      if (!leftNeighbor && !topNeighbor) {
        this._basicCornerExtraRounded({
          x: x,
          y: y,
          size: size,
          context: context,
          rotation: -Math.PI / 2
        });
        return;
      }
      if (!rightNeighbor && !bottomNeighbor) {
        this._basicCornerExtraRounded({
          x: x,
          y: y,
          size: size,
          context: context,
          rotation: Math.PI / 2
        });
        return;
      }
      this._basicSquare({
        x: x,
        y: y,
        size: size,
        context: context,
        rotation: 0
      });
    }
  }]);
  return QRDot;
}();