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
var _QRDot = _interopRequireDefault(require("../figures/dot/svg/QRDot"));
var _QRCornerSquare = _interopRequireDefault(require("../figures/cornerSquare/svg/QRCornerSquare"));
var _QRCornerDot = _interopRequireDefault(require("../figures/cornerDot/svg/QRCornerDot"));
var _gradientTypes = _interopRequireDefault(require("../constants/gradientTypes"));
var _canvas = require("canvas");
var _jsdom = require("jsdom");
var dom = new _jsdom.JSDOM();
var document = dom.window.document;
var squareMask = [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]];
var dotMask = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
var QRSVG = exports["default"] = /*#__PURE__*/function () {
  //TODO don't pass all options to this class
  function QRSVG(options) {
    (0, _classCallCheck2["default"])(this, QRSVG);
    (0, _defineProperty2["default"])(this, "_element", void 0);
    (0, _defineProperty2["default"])(this, "_style", void 0);
    (0, _defineProperty2["default"])(this, "_defs", void 0);
    (0, _defineProperty2["default"])(this, "_dotsClipPath", void 0);
    (0, _defineProperty2["default"])(this, "_cornersSquareClipPath", void 0);
    (0, _defineProperty2["default"])(this, "_cornersDotClipPath", void 0);
    (0, _defineProperty2["default"])(this, "_dots", void 0);
    (0, _defineProperty2["default"])(this, "_cornerSquares", void 0);
    (0, _defineProperty2["default"])(this, "_corners", void 0);
    (0, _defineProperty2["default"])(this, "_cornerDots", void 0);
    (0, _defineProperty2["default"])(this, "_options", void 0);
    (0, _defineProperty2["default"])(this, "_qr", void 0);
    (0, _defineProperty2["default"])(this, "_image", void 0);
    this._element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._element.setAttribute("width", String(options.width));
    this._element.setAttribute("height", String(options.height));
    this._element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this._style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    this._options = options;
  }
  (0, _createClass2["default"])(QRSVG, [{
    key: "width",
    get: function get() {
      return this._options.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this._options.height;
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this._element;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _oldElement$parentNod;
      var oldElement = this._element;
      this._element = oldElement.cloneNode(false);
      oldElement === null || oldElement === void 0 || (_oldElement$parentNod = oldElement.parentNode) === null || _oldElement$parentNod === void 0 || _oldElement$parentNod.replaceChild(this._element, oldElement);
      this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      this._style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      this._element.appendChild(this._style);
      this._element.appendChild(this._defs);
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
              this._element.appendChild(this._style);
              this._element.appendChild(this._defs);
              this.clear();
              this.drawBackground();
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
              if (!this._options.image) {
                _context.next = 23;
                break;
              }
              _context.next = 23;
              return this.drawImage({
                width: drawImageSize.width,
                height: drawImageSize.height,
                count: count,
                dotSize: dotSize
              });
            case 23:
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
      var element = this._element;
      var options = this._options;
      if (element) {
        var _options$backgroundOp, _options$backgroundOp2, _options$backgroundOp3;
        var gradientOptions = (_options$backgroundOp = options.backgroundOptions) === null || _options$backgroundOp === void 0 ? void 0 : _options$backgroundOp.gradient;
        var color = (_options$backgroundOp2 = options.backgroundOptions) === null || _options$backgroundOp2 === void 0 ? void 0 : _options$backgroundOp2.color;
        if (gradientOptions) {
          this._createColor({
            options: gradientOptions,
            color: color,
            additionalRotation: 0,
            x: 0,
            y: 0,
            height: options.height,
            width: options.width,
            name: "background-color"
          });
        } else if ((_options$backgroundOp3 = options.backgroundOptions) !== null && _options$backgroundOp3 !== void 0 && _options$backgroundOp3.color) {
          this._createStyle({
            color: color,
            name: "background-color"
          });
        }
      }
    }
  }, {
    key: "drawDots",
    value: function drawDots(filter) {
      var _options$dotsOptions,
        _this2 = this;
      if (!this._qr) {
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
        svg: this._element,
        type: options.dotsOptions.type
      });
      if ((_options$dotsOptions = options.dotsOptions) !== null && _options$dotsOptions !== void 0 && _options$dotsOptions.gradient) {
        var _options$dotsOptions2;
        this._dotsClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        this._dotsClipPath.setAttribute("id", "clip-path-dot-color");
        this._defs.appendChild(this._dotsClipPath);
        this._createColor({
          options: (_options$dotsOptions2 = options.dotsOptions) === null || _options$dotsOptions2 === void 0 ? void 0 : _options$dotsOptions2.gradient,
          color: options.dotsOptions.color,
          additionalRotation: 0,
          x: xBeginning,
          y: yBeginning,
          height: count * dotSize,
          width: count * dotSize,
          name: "dot-color"
        });
      } else if (options.dotsOptions.color) {
        this._dots = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this._dots.setAttribute("class", "dot-color");
        this._element.appendChild(this._dots);
        this._createStyle({
          color: options.dotsOptions.color,
          name: "dot-color"
        });
      }
      var _loop = function _loop(i) {
        var _loop2 = function _loop2(j) {
            var _this2$_qr;
            if (filter && !filter(i, j)) {
              return 0; // continue
            }
            if (!((_this2$_qr = _this2._qr) !== null && _this2$_qr !== void 0 && _this2$_qr.isDark(i, j))) {
              return 0; // continue
            }
            var x = _this2._options.useLegacyDotRotation ? xBeginning + i * dotSize : yBeginning + j * dotSize;
            var y = _this2._options.useLegacyDotRotation ? yBeginning + j * dotSize : xBeginning + i * dotSize;
            dot.draw(x, y, dotSize, function (xOffset, yOffset) {
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
            if (dot._element && _this2._dotsClipPath) {
              _this2._dotsClipPath.appendChild(dot._element);
            } else if (dot._element && _this2._dots) {
              _this2._dots.appendChild(dot._element);
            }
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
    }
  }, {
    key: "drawCorners",
    value: function drawCorners() {
      var _this3 = this;
      if (!this._qr) {
        throw "QR code is not defined";
      }
      var element = this._element;
      var options = this._options;
      if (!element) {
        throw "Element code is not defined";
      }
      var count = this._qr.getModuleCount();
      var minSize = Math.min(options.width, options.height) - options.margin * 2;
      var dotSize = Math.floor(minSize / count);
      var cornersSquareSize = dotSize * 7;
      var cornersDotSize = dotSize * 3;
      var xBeginning = Math.floor((options.width - count * dotSize) / 2);
      var yBeginning = Math.floor((options.height - count * dotSize) / 2);
      [[0, 0, 0], [1, 0, Math.PI / 2], [0, 1, -Math.PI / 2]].forEach(function (_ref) {
        var _options$cornersSquar, _options$cornersSquar5, _options$cornersDotOp, _options$cornersDotOp5;
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
          column = _ref2[0],
          row = _ref2[1],
          rotation = _ref2[2];
        var x = xBeginning + column * dotSize * (count - 7);
        var y = yBeginning + row * dotSize * (count - 7);
        var cornersSquareClipPath = _this3._dotsClipPath;
        var cornersDotClipPath = _this3._dotsClipPath;
        if ((_options$cornersSquar = options.cornersSquareOptions) !== null && _options$cornersSquar !== void 0 && _options$cornersSquar.gradient) {
          var _options$cornersSquar2, _options$cornersSquar3;
          cornersSquareClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
          cornersSquareClipPath.setAttribute("id", "clip-path-corners-square-color-".concat(column, "-").concat(row));
          _this3._defs.appendChild(cornersSquareClipPath);
          _this3._cornersSquareClipPath = _this3._cornersDotClipPath = cornersDotClipPath = cornersSquareClipPath;
          _this3._createColor({
            options: (_options$cornersSquar2 = options.cornersSquareOptions) === null || _options$cornersSquar2 === void 0 ? void 0 : _options$cornersSquar2.gradient,
            color: (_options$cornersSquar3 = options.cornersSquareOptions) === null || _options$cornersSquar3 === void 0 ? void 0 : _options$cornersSquar3.color,
            additionalRotation: rotation,
            x: x,
            y: y,
            height: cornersSquareSize,
            width: cornersSquareSize,
            name: "corners-square-color-".concat(column, "-").concat(row)
          });
        } else {
          var _options$cornersSquar4;
          _this3._cornerSquares = document.createElementNS("http://www.w3.org/2000/svg", "g");
          _this3._cornerSquares.setAttribute("class", "corners-square-color-".concat(column, "-").concat(row));
          _this3._element.appendChild(_this3._cornerSquares);
          _this3._createStyle({
            color: (_options$cornersSquar4 = options.cornersSquareOptions) === null || _options$cornersSquar4 === void 0 ? void 0 : _options$cornersSquar4.color,
            name: "corners-square-color-".concat(column, "-").concat(row)
          });
        }
        if ((_options$cornersSquar5 = options.cornersSquareOptions) !== null && _options$cornersSquar5 !== void 0 && _options$cornersSquar5.type) {
          var _options$cornersSquar6;
          var cornersSquare = new _QRCornerSquare["default"]({
            svg: _this3._element,
            type: options.cornersSquareOptions.type
          });
          cornersSquare.draw(x, y, cornersSquareSize, rotation);
          if ((_options$cornersSquar6 = options.cornersSquareOptions) !== null && _options$cornersSquar6 !== void 0 && _options$cornersSquar6.gradient && cornersSquare._element && cornersSquareClipPath) {
            cornersSquareClipPath.appendChild(cornersSquare._element);
          } else if (cornersSquare._element && _this3._cornerSquares) {
            _this3._cornerSquares.appendChild(cornersSquare._element);
          }
        } else {
          var dot = new _QRDot["default"]({
            svg: _this3._element,
            type: options.dotsOptions.type
          });
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
              if (dot._element && _this3._cornersSquareClipPath) {
                _this3._cornersSquareClipPath.appendChild(dot._element);
              } else if (dot._element && _this3._cornerSquares) {
                _this3._cornerSquares.appendChild(dot._element);
              }
            };
            for (var j = 0; j < squareMask[i].length; j++) {
              if (_loop4(j)) continue;
            }
          };
          for (var i = 0; i < squareMask.length; i++) {
            _loop3(i);
          }
        }
        if ((_options$cornersDotOp = options.cornersDotOptions) !== null && _options$cornersDotOp !== void 0 && _options$cornersDotOp.gradient) {
          var _options$cornersDotOp2, _options$cornersDotOp3;
          cornersDotClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
          cornersDotClipPath.setAttribute("id", "clip-path-corners-dot-color-".concat(column, "-").concat(row));
          _this3._defs.appendChild(cornersDotClipPath);
          _this3._cornersDotClipPath = cornersDotClipPath;
          _this3._createColor({
            options: (_options$cornersDotOp2 = options.cornersDotOptions) === null || _options$cornersDotOp2 === void 0 ? void 0 : _options$cornersDotOp2.gradient,
            color: (_options$cornersDotOp3 = options.cornersDotOptions) === null || _options$cornersDotOp3 === void 0 ? void 0 : _options$cornersDotOp3.color,
            additionalRotation: rotation,
            x: x + dotSize * 2,
            y: y + dotSize * 2,
            height: cornersDotSize,
            width: cornersDotSize,
            name: "corners-dot-color-".concat(column, "-").concat(row)
          });
        } else {
          var _options$cornersDotOp4;
          _this3._cornerDots = document.createElementNS("http://www.w3.org/2000/svg", "g");
          _this3._cornerDots.setAttribute("class", "corners-dot-color-".concat(column, "-").concat(row));
          _this3._element.appendChild(_this3._cornerDots);
          _this3._createStyle({
            color: (_options$cornersDotOp4 = options.cornersDotOptions) === null || _options$cornersDotOp4 === void 0 ? void 0 : _options$cornersDotOp4.color,
            name: "corners-dot-color-".concat(column, "-").concat(row)
          });
        }
        if ((_options$cornersDotOp5 = options.cornersDotOptions) !== null && _options$cornersDotOp5 !== void 0 && _options$cornersDotOp5.type) {
          var _options$cornersDotOp6;
          var cornersDot = new _QRCornerDot["default"]({
            svg: _this3._element,
            type: options.cornersDotOptions.type
          });
          cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
          if ((_options$cornersDotOp6 = options.cornersDotOptions) !== null && _options$cornersDotOp6 !== void 0 && _options$cornersDotOp6.gradient && cornersDot._element && cornersDotClipPath) {
            cornersDotClipPath.appendChild(cornersDot._element);
          } else if (cornersDot._element && _this3._cornerDots) {
            _this3._cornerDots.appendChild(cornersDot._element);
          }
        } else {
          var _dot = new _QRDot["default"]({
            svg: _this3._element,
            type: options.dotsOptions.type
          });
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
              if (_dot._element && _this3._cornersDotClipPath) {
                _this3._cornersDotClipPath.appendChild(_dot._element);
              } else if (_dot._element && _this3._cornerDots) {
                _this3._cornerDots.appendChild(_dot._element);
              }
            };
            for (var j = 0; j < dotMask[_i].length; j++) {
              if (_loop6(j)) continue;
            }
          };
          for (var _i = 0; _i < dotMask.length; _i++) {
            _loop5(_i);
          }
        }
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
    value: function () {
      var _drawImage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
        var width, height, count, dotSize, options, xBeginning, yBeginning, dx, dy, dw, dh, image, base64Image;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              width = _ref3.width, height = _ref3.height, count = _ref3.count, dotSize = _ref3.dotSize;
              options = this._options;
              xBeginning = Math.floor((options.width - count * dotSize) / 2);
              yBeginning = Math.floor((options.height - count * dotSize) / 2);
              dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
              dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
              dw = width - options.imageOptions.margin * 2;
              dh = height - options.imageOptions.margin * 2;
              image = document.createElementNS("http://www.w3.org/2000/svg", "image");
              _context2.next = 11;
              return this._getBase64Image(options.image || "");
            case 11:
              base64Image = _context2.sent;
              image.setAttribute("href", base64Image);
              image.setAttribute("xlink:href", base64Image);
              image.setAttribute("x", String(dx));
              image.setAttribute("y", String(dy));
              image.setAttribute("width", "".concat(dw, "px"));
              image.setAttribute("height", "".concat(dh, "px"));
              this._element.appendChild(image);
            case 19:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function drawImage(_x2) {
        return _drawImage.apply(this, arguments);
      }
      return drawImage;
    }()
  }, {
    key: "_getImageBlob",
    value: function () {
      var _getImageBlob2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(url) {
        var resp;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetch(url);
            case 2:
              resp = _context3.sent;
              return _context3.abrupt("return", resp.blob());
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function _getImageBlob(_x3) {
        return _getImageBlob2.apply(this, arguments);
      }
      return _getImageBlob;
    }() // convert a blob to base64
  }, {
    key: "_blobToBase64",
    value: function _blobToBase64(blob) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          var dataUrl = reader.result;
          resolve(dataUrl);
        };
        reader.readAsDataURL(blob);
      });
    }
  }, {
    key: "_getBase64Image",
    value: function () {
      var _getBase64Image2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(url) {
        var blob, base64;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(url === "")) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", new Promise(function (resolve) {
                resolve("");
              }));
            case 2:
              _context4.next = 4;
              return this._getImageBlob(url);
            case 4:
              blob = _context4.sent;
              _context4.next = 7;
              return this._blobToBase64(blob);
            case 7:
              base64 = _context4.sent;
              return _context4.abrupt("return", base64);
            case 9:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function _getBase64Image(_x4) {
        return _getBase64Image2.apply(this, arguments);
      }
      return _getBase64Image;
    }()
  }, {
    key: "_createColor",
    value: function _createColor(_ref4) {
      var options = _ref4.options,
        color = _ref4.color,
        additionalRotation = _ref4.additionalRotation,
        x = _ref4.x,
        y = _ref4.y,
        height = _ref4.height,
        width = _ref4.width,
        name = _ref4.name;
      var size = width > height ? width : height;
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("height", String(height));
      rect.setAttribute("width", String(width));
      rect.setAttribute("clip-path", "url('#clip-path-".concat(name, "')"));
      if (options) {
        var gradient;
        if (options.type === _gradientTypes["default"].radial) {
          gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
          gradient.setAttribute("id", name);
          gradient.setAttribute("gradientUnits", "userSpaceOnUse");
          gradient.setAttribute("fx", String(x + width / 2));
          gradient.setAttribute("fy", String(y + height / 2));
          gradient.setAttribute("cx", String(x + width / 2));
          gradient.setAttribute("cy", String(y + height / 2));
          gradient.setAttribute("r", String(size / 2));
        } else {
          var rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
          var positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
          var x0 = x + width / 2;
          var y0 = y + height / 2;
          var x1 = x + width / 2;
          var y1 = y + height / 2;
          if (positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI || positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI) {
            x0 = x0 - width / 2;
            y0 = y0 - height / 2 * Math.tan(rotation);
            x1 = x1 + width / 2;
            y1 = y1 + height / 2 * Math.tan(rotation);
          } else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
            y0 = y0 - height / 2;
            x0 = x0 - width / 2 / Math.tan(rotation);
            y1 = y1 + height / 2;
            x1 = x1 + width / 2 / Math.tan(rotation);
          } else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
            x0 = x0 + width / 2;
            y0 = y0 + height / 2 * Math.tan(rotation);
            x1 = x1 - width / 2;
            y1 = y1 - height / 2 * Math.tan(rotation);
          } else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
            y0 = y0 + height / 2;
            x0 = x0 + width / 2 / Math.tan(rotation);
            y1 = y1 - height / 2;
            x1 = x1 - width / 2 / Math.tan(rotation);
          }
          gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
          gradient.setAttribute("id", name);
          gradient.setAttribute("gradientUnits", "userSpaceOnUse");
          gradient.setAttribute("x1", String(Math.round(x0)));
          gradient.setAttribute("y1", String(Math.round(y0)));
          gradient.setAttribute("x2", String(Math.round(x1)));
          gradient.setAttribute("y2", String(Math.round(y1)));
        }
        options.colorStops.forEach(function (_ref5) {
          var offset = _ref5.offset,
            color = _ref5.color;
          var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop.setAttribute("offset", "".concat(100 * offset, "%"));
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        });
        rect.setAttribute("fill", "url('#".concat(name, "')"));
        this._defs.appendChild(gradient);
      } else if (color) {
        rect.setAttribute("fill", color);
      }
      this._element.appendChild(rect);
    }
  }, {
    key: "_createStyle",
    value: function _createStyle(_ref6) {
      var color = _ref6.color,
        name = _ref6.name;
      this._style.innerHTML += ".".concat(name, "{ fill: ").concat(color, "; }");
    }
  }]);
  return QRSVG;
}();