"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _calculateImageSize = _interopRequireDefault(require("../tools/calculateImageSize"));
var _errorCorrectionPercents = _interopRequireDefault(require("../constants/errorCorrectionPercents"));
var _QRDot = _interopRequireDefault(require("../figures/dot/canvas/QRDot"));
var _QRCornerSquare = _interopRequireDefault(require("../figures/cornerSquare/canvas/QRCornerSquare"));
var _QRCornerDot = _interopRequireDefault(require("../figures/cornerDot/canvas/QRCornerDot"));
var _gradientTypes = _interopRequireDefault(require("../constants/gradientTypes"));
var _canvas = require("canvas");
var squareMask = [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]];
var dotMask = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
var QRCanvas = exports["default"] = /*#__PURE__*/function () {
  //TODO don't pass all options to this class
  function QRCanvas(options) {
    (0, _classCallCheck2["default"])(this, QRCanvas);
    (0, _defineProperty2["default"])(this, "_canvas", void 0);
    (0, _defineProperty2["default"])(this, "_options", void 0);
    (0, _defineProperty2["default"])(this, "_qr", void 0);
    (0, _defineProperty2["default"])(this, "_image", void 0);
    // @ts-ignore
    this._canvas = (0, _canvas.createCanvas)(options.width, options.height);
    this._canvas.width = options.width;
    this._canvas.height = options.height;
    this._options = options;
  }
  (0, _createClass2["default"])(QRCanvas, [{
    key: "context",
    get: function get() {
      return this._canvas.getContext("2d");
    }
  }, {
    key: "width",
    get: function get() {
      return this._canvas.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this._canvas.height;
    }
  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this._canvas;
    }
  }, {
    key: "clear",
    value: function clear() {
      var canvasContext = this.context;
      if (canvasContext) {
        canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }
  }, {
    key: "drawQR",
    value: function () {
      var _drawQR = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(qr) {
        var _this = this;
        var count, minSize, dotSize, drawImageSize, _this$_options, imageOptions, qrOptions, coverLevel, maxHiddenDots;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              count = qr.getModuleCount();
              minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
              dotSize = Math.floor(minSize / count);
              drawImageSize = {
                hideXDots: 0,
                hideYDots: 0,
                width: 0,
                height: 0
              };
              this._qr = qr;
              if (!this._options.image) {
                _context.next = 14;
                break;
              }
              _context.next = 8;
              return this.loadImage();
            case 8:
              if (this._image) {
                _context.next = 10;
                break;
              }
              return _context.abrupt("return");
            case 10:
              _this$_options = this._options, imageOptions = _this$_options.imageOptions, qrOptions = _this$_options.qrOptions;
              coverLevel = imageOptions.imageSize * _errorCorrectionPercents["default"][qrOptions.errorCorrectionLevel];
              maxHiddenDots = Math.floor(coverLevel * count * count);
              drawImageSize = (0, _calculateImageSize["default"])({
                originalWidth: this._image.width,
                originalHeight: this._image.height,
                maxHiddenDots: maxHiddenDots,
                maxHiddenAxisDots: count - 14,
                dotSize: dotSize
              });
            case 14:
              this.clear();
              this.drawBackground();

              //Draw the dots with the given filter function
              this.drawDots(function (i, j) {
                var _squareMask$i, _squareMask, _squareMask$i2, _dotMask$i, _dotMask, _dotMask$i2;
                if (_this._options.imageOptions.hideBackgroundDots) {
                  if (i >= (count - drawImageSize.hideXDots) / 2 && i < (count + drawImageSize.hideXDots) / 2 && j >= (count - drawImageSize.hideYDots) / 2 && j < (count + drawImageSize.hideYDots) / 2) {
                    return false;
                  }
                }
                if ((_squareMask$i = squareMask[i]) !== null && _squareMask$i !== void 0 && _squareMask$i[j] || (_squareMask = squareMask[i - count + 7]) !== null && _squareMask !== void 0 && _squareMask[j] || (_squareMask$i2 = squareMask[i]) !== null && _squareMask$i2 !== void 0 && _squareMask$i2[j - count + 7]) {
                  return false;
                }
                if ((_dotMask$i = dotMask[i]) !== null && _dotMask$i !== void 0 && _dotMask$i[j] || (_dotMask = dotMask[i - count + 7]) !== null && _dotMask !== void 0 && _dotMask[j] || (_dotMask$i2 = dotMask[i]) !== null && _dotMask$i2 !== void 0 && _dotMask$i2[j - count + 7]) {
                  return false;
                }
                return true;
              });
              this.drawCorners();
              if (this._options.image) {
                this.drawImage({
                  width: drawImageSize.width,
                  height: drawImageSize.height,
                  count: count,
                  dotSize: dotSize
                });
              }
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function drawQR(_x) {
        return _drawQR.apply(this, arguments);
      }
      return drawQR;
    }()
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      var canvasContext = this.context;
      var options = this._options;
      if (canvasContext) {
        if (options.backgroundOptions.gradient) {
          var gradientOptions = options.backgroundOptions.gradient;
          var gradient = this._createGradient({
            context: canvasContext,
            options: gradientOptions,
            additionalRotation: 0,
            x: 0,
            y: 0,
            size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
          });
          gradientOptions.colorStops.forEach(function (_ref) {
            var offset = _ref.offset,
              color = _ref.color;
            gradient.addColorStop(offset, color);
          });
          canvasContext.fillStyle = gradient;
        } else if (options.backgroundOptions.color) {
          canvasContext.fillStyle = options.backgroundOptions.color;
        }
        canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }
  }, {
    key: "drawDots",
    value: function drawDots(filter) {
      var _this2 = this;
      if (!this._qr) {
        throw "QR code is not defined";
      }
      var canvasContext = this.context;
      if (!canvasContext) {
        throw "QR code is not defined";
      }
      var options = this._options;
      var count = this._qr.getModuleCount();
      if (count > options.width || count > options.height) {
        throw "The canvas is too small.";
      }
      var minSize = Math.min(options.width, options.height) - options.margin * 2;
      var dotSize = Math.floor(minSize / count);
      var xBeginning = Math.floor((options.width - count * dotSize) / 2);
      var yBeginning = Math.floor((options.height - count * dotSize) / 2);
      var dot = new _QRDot["default"]({
        context: canvasContext,
        type: options.dotsOptions.type
      });
      canvasContext.beginPath();
      var _loop = function _loop(i) {
        var _loop2 = function _loop2(j) {
            if (filter && !filter(i, j)) {
              return 0; // continue
            }
            if (!_this2._qr.isDark(i, j)) {
              return 0; // continue
            }
            var x = _this2._options.useLegacyDotRotation ? xBeginning + i * dotSize : yBeginning + j * dotSize;
            var y = _this2._options.useLegacyDotRotation ? yBeginning + j * dotSize : xBeginning + i * dotSize;
            dot.draw(x, y, dotSize,
            //Get neighbor function
            function (xOffset, yOffset) {
              //Out of bounds check

              if (_this2._options.useLegacyDotRotation) {
                if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count) return false;
                if (filter && !filter(i + xOffset, j + yOffset)) return false;
                return !!_this2._qr && _this2._qr.isDark(i + xOffset, j + yOffset);
              } else {
                if (j + xOffset < 0 || i + yOffset < 0 || j + xOffset >= count || i + yOffset >= count) return false;
                if (filter && !filter(j + xOffset, i + yOffset)) return false;
                return !!_this2._qr && _this2._qr.isDark(i + yOffset, j + xOffset);
              }
            });
          },
          _ret;
        for (var j = 0; j < count; j++) {
          _ret = _loop2(j);
          if (_ret === 0) continue;
        }
      };
      for (var i = 0; i < count; i++) {
        _loop(i);
      }
      if (options.dotsOptions.gradient) {
        var gradientOptions = options.dotsOptions.gradient;
        var gradient = this._createGradient({
          context: canvasContext,
          options: gradientOptions,
          additionalRotation: 0,
          x: xBeginning,
          y: yBeginning,
          size: count * dotSize
        });
        gradientOptions.colorStops.forEach(function (_ref2) {
          var offset = _ref2.offset,
            color = _ref2.color;
          gradient.addColorStop(offset, color);
        });
        canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
      } else if (options.dotsOptions.color) {
        canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
      }
      canvasContext.fill("evenodd");
    }
  }, {
    key: "drawCorners",
    value: function drawCorners(filter) {
      var _this3 = this;
      if (!this._qr) {
        throw "QR code is not defined";
      }
      var canvasContext = this.context;
      if (!canvasContext) {
        throw "QR code is not defined";
      }
      var options = this._options;
      var count = this._qr.getModuleCount();
      var minSize = Math.min(options.width, options.height) - options.margin * 2;
      var dotSize = Math.floor(minSize / count);
      var cornersSquareSize = dotSize * 7;
      var cornersDotSize = dotSize * 3;
      var xBeginning = Math.floor((options.width - count * dotSize) / 2);
      var yBeginning = Math.floor((options.height - count * dotSize) / 2);
      [[0, 0, 0], [1, 0, Math.PI / 2], [0, 1, -Math.PI / 2]].forEach(function (_ref3) {
        var _options$cornersSquar, _options$cornersSquar3, _options$cornersSquar4, _options$cornersDotOp, _options$cornersDotOp3, _options$cornersDotOp4;
        var _ref4 = (0, _slicedToArray2["default"])(_ref3, 3),
          column = _ref4[0],
          row = _ref4[1],
          rotation = _ref4[2];
        if (filter && !filter(column, row)) {
          return;
        }
        var x = xBeginning + column * dotSize * (count - 7);
        var y = yBeginning + row * dotSize * (count - 7);
        if ((_options$cornersSquar = options.cornersSquareOptions) !== null && _options$cornersSquar !== void 0 && _options$cornersSquar.type) {
          var _options$cornersSquar2;
          var cornersSquare = new _QRCornerSquare["default"]({
            context: canvasContext,
            type: (_options$cornersSquar2 = options.cornersSquareOptions) === null || _options$cornersSquar2 === void 0 ? void 0 : _options$cornersSquar2.type
          });
          canvasContext.beginPath();
          cornersSquare.draw(x, y, cornersSquareSize, rotation);
        } else {
          var dot = new _QRDot["default"]({
            context: canvasContext,
            type: options.dotsOptions.type
          });
          canvasContext.beginPath();
          var _loop3 = function _loop3(i) {
            var _loop4 = function _loop4(j) {
              var _squareMask$i3;
              if (!((_squareMask$i3 = squareMask[i]) !== null && _squareMask$i3 !== void 0 && _squareMask$i3[j])) {
                return 1; // continue
              }
              dot.draw(x + i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) {
                var _squareMask2;
                return !!((_squareMask2 = squareMask[i + xOffset]) !== null && _squareMask2 !== void 0 && _squareMask2[j + yOffset]);
              });
            };
            for (var j = 0; j < squareMask[i].length; j++) {
              if (_loop4(j)) continue;
            }
          };
          for (var i = 0; i < squareMask.length; i++) {
            _loop3(i);
          }
        }
        if ((_options$cornersSquar3 = options.cornersSquareOptions) !== null && _options$cornersSquar3 !== void 0 && _options$cornersSquar3.gradient) {
          var gradientOptions = options.cornersSquareOptions.gradient;
          var gradient = _this3._createGradient({
            context: canvasContext,
            options: gradientOptions,
            additionalRotation: rotation,
            x: x,
            y: y,
            size: cornersSquareSize
          });
          gradientOptions.colorStops.forEach(function (_ref5) {
            var offset = _ref5.offset,
              color = _ref5.color;
            gradient.addColorStop(offset, color);
          });
          canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
        } else if ((_options$cornersSquar4 = options.cornersSquareOptions) !== null && _options$cornersSquar4 !== void 0 && _options$cornersSquar4.color) {
          canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
        }
        canvasContext.fill("evenodd");
        if ((_options$cornersDotOp = options.cornersDotOptions) !== null && _options$cornersDotOp !== void 0 && _options$cornersDotOp.type) {
          var _options$cornersDotOp2;
          var cornersDot = new _QRCornerDot["default"]({
            context: canvasContext,
            type: (_options$cornersDotOp2 = options.cornersDotOptions) === null || _options$cornersDotOp2 === void 0 ? void 0 : _options$cornersDotOp2.type
          });
          canvasContext.beginPath();
          cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
        } else {
          var _dot = new _QRDot["default"]({
            context: canvasContext,
            type: options.dotsOptions.type
          });
          canvasContext.beginPath();
          var _loop5 = function _loop5(_i) {
            var _loop6 = function _loop6(j) {
              var _dotMask$_i;
              if (!((_dotMask$_i = dotMask[_i]) !== null && _dotMask$_i !== void 0 && _dotMask$_i[j])) {
                return 1; // continue
              }
              _dot.draw(x + _i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) {
                var _dotMask2;
                return !!((_dotMask2 = dotMask[_i + xOffset]) !== null && _dotMask2 !== void 0 && _dotMask2[j + yOffset]);
              });
            };
            for (var j = 0; j < dotMask[_i].length; j++) {
              if (_loop6(j)) continue;
            }
          };
          for (var _i = 0; _i < dotMask.length; _i++) {
            _loop5(_i);
          }
        }
        if ((_options$cornersDotOp3 = options.cornersDotOptions) !== null && _options$cornersDotOp3 !== void 0 && _options$cornersDotOp3.gradient) {
          var _gradientOptions = options.cornersDotOptions.gradient;
          var _gradient = _this3._createGradient({
            context: canvasContext,
            options: _gradientOptions,
            additionalRotation: rotation,
            x: x + dotSize * 2,
            y: y + dotSize * 2,
            size: cornersDotSize
          });
          _gradientOptions.colorStops.forEach(function (_ref6) {
            var offset = _ref6.offset,
              color = _ref6.color;
            _gradient.addColorStop(offset, color);
          });
          canvasContext.fillStyle = canvasContext.strokeStyle = _gradient;
        } else if ((_options$cornersDotOp4 = options.cornersDotOptions) !== null && _options$cornersDotOp4 !== void 0 && _options$cornersDotOp4.color) {
          canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersDotOptions.color;
        }
        canvasContext.fill("evenodd");
      });
    }
  }, {
    key: "loadImage",
    value: function loadImage() {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        var options = _this4._options;
        var image = new _canvas.Image();
        if (!options.image) {
          return reject("Image is not defined");
        }
        if (typeof options.imageOptions.crossOrigin === "string") {
          // @ts-ignore
          image.crossOrigin = options.imageOptions.crossOrigin;
        }

        // @ts-ignore
        _this4._image = image;
        image.onload = function () {
          resolve();
        };
        image.src = options.image;
      });
    }
  }, {
    key: "drawImage",
    value: function drawImage(_ref7) {
      var width = _ref7.width,
        height = _ref7.height,
        count = _ref7.count,
        dotSize = _ref7.dotSize;
      var canvasContext = this.context;
      if (!canvasContext) {
        throw "canvasContext is not defined";
      }
      if (!this._image) {
        throw "image is not defined";
      }
      var options = this._options;
      var xBeginning = Math.floor((options.width - count * dotSize) / 2);
      var yBeginning = Math.floor((options.height - count * dotSize) / 2);
      var dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
      var dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
      var dw = width - options.imageOptions.margin * 2;
      var dh = height - options.imageOptions.margin * 2;
      canvasContext.drawImage(this._image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
    }
  }, {
    key: "_createGradient",
    value: function _createGradient(_ref8) {
      var context = _ref8.context,
        options = _ref8.options,
        additionalRotation = _ref8.additionalRotation,
        x = _ref8.x,
        y = _ref8.y,
        size = _ref8.size;
      var gradient;
      if (options.type === _gradientTypes["default"].radial) {
        gradient = context.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
      } else {
        var rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
        var positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
        var x0 = x + size / 2;
        var y0 = y + size / 2;
        var x1 = x + size / 2;
        var y1 = y + size / 2;
        if (positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI || positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI) {
          x0 = x0 - size / 2;
          y0 = y0 - size / 2 * Math.tan(rotation);
          x1 = x1 + size / 2;
          y1 = y1 + size / 2 * Math.tan(rotation);
        } else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
          y0 = y0 - size / 2;
          x0 = x0 - size / 2 / Math.tan(rotation);
          y1 = y1 + size / 2;
          x1 = x1 + size / 2 / Math.tan(rotation);
        } else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
          x0 = x0 + size / 2;
          y0 = y0 + size / 2 * Math.tan(rotation);
          x1 = x1 - size / 2;
          y1 = y1 - size / 2 * Math.tan(rotation);
        } else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
          y0 = y0 + size / 2;
          x0 = x0 + size / 2 / Math.tan(rotation);
          y1 = y1 - size / 2;
          x1 = x1 - size / 2 / Math.tan(rotation);
        }
        gradient = context.createLinearGradient(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
      }
      return gradient;
    }
  }]);
  return QRCanvas;
}();