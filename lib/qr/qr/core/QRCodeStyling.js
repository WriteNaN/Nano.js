"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _getMode = _interopRequireDefault(require("../tools/getMode"));
var _merge = _interopRequireDefault(require("../tools/merge"));
var _downloadURI = _interopRequireDefault(require("../tools/downloadURI"));
var _QRCanvas = _interopRequireDefault(require("./QRCanvas"));
var _QRSVG = _interopRequireDefault(require("./QRSVG"));
var _drawTypes = _interopRequireDefault(require("../constants/drawTypes"));
var _QROptions = _interopRequireDefault(require("./QROptions"));
var _sanitizeOptions = _interopRequireDefault(require("../tools/sanitizeOptions"));
var _qrcodeGenerator = _interopRequireDefault(require("qrcode-generator"));
var QRCodeStyling = exports["default"] = /*#__PURE__*/function () {
  function QRCodeStyling(options) {
    (0, _classCallCheck2["default"])(this, QRCodeStyling);
    (0, _defineProperty2["default"])(this, "_options", void 0);
    (0, _defineProperty2["default"])(this, "_container", void 0);
    (0, _defineProperty2["default"])(this, "_canvas", void 0);
    (0, _defineProperty2["default"])(this, "_svg", void 0);
    (0, _defineProperty2["default"])(this, "_qr", void 0);
    (0, _defineProperty2["default"])(this, "_canvasDrawingPromise", void 0);
    (0, _defineProperty2["default"])(this, "_svgDrawingPromise", void 0);
    this._options = options ? (0, _sanitizeOptions["default"])((0, _merge["default"])(_QROptions["default"], options)) : _QROptions["default"];
    this.update();
  }
  (0, _createClass2["default"])(QRCodeStyling, [{
    key: "_getQRStylingElement",
    value: function () {
      var _getQRStylingElement2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(extension) {
        var promise, svg, _promise, canvas;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (this._qr) {
                _context.next = 2;
                break;
              }
              throw "QR code is empty";
            case 2:
              if (!(extension.toLowerCase() === "svg")) {
                _context.next = 9;
                break;
              }
              if (this._svg && this._svgDrawingPromise) {
                svg = this._svg;
                promise = this._svgDrawingPromise;
              } else {
                svg = new _QRSVG["default"](this._options);
                promise = svg.drawQR(this._qr);
              }
              _context.next = 6;
              return promise;
            case 6:
              return _context.abrupt("return", svg);
            case 9:
              if (this._canvas && this._canvasDrawingPromise) {
                canvas = this._canvas;
                _promise = this._canvasDrawingPromise;
              } else {
                canvas = new _QRCanvas["default"](this._options);
                _promise = canvas.drawQR(this._qr);
              }
              _context.next = 12;
              return _promise;
            case 12:
              return _context.abrupt("return", canvas);
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function _getQRStylingElement(_x) {
        return _getQRStylingElement2.apply(this, arguments);
      }
      return _getQRStylingElement;
    }()
  }, {
    key: "update",
    value: function update(options) {
      QRCodeStyling._clearContainer(this._container);
      this._options = options ? (0, _sanitizeOptions["default"])((0, _merge["default"])(this._options, options)) : this._options;
      if (!this._options.data) {
        return;
      }
      this._qr = (0, _qrcodeGenerator["default"])(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
      this._qr.addData(this._options.data, this._options.qrOptions.mode || (0, _getMode["default"])(this._options.data));
      this._qr.make();
      if (this._options.type === _drawTypes["default"].canvas) {
        this._canvas = new _QRCanvas["default"](this._options);
        this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
        this._svgDrawingPromise = undefined;
        this._svg = undefined;
      } else {
        this._svg = new _QRSVG["default"](this._options);
        this._svgDrawingPromise = this._svg.drawQR(this._qr);
        this._canvasDrawingPromise = undefined;
        this._canvas = undefined;
      }
      this.append(this._container);
    }
  }, {
    key: "append",
    value: function append(container) {
      if (!container) {
        return;
      }
      if (typeof container.appendChild !== "function") {
        throw "Container should be a single DOM node";
      }
      if (this._options.type === _drawTypes["default"].canvas) {
        if (this._canvas) {
          container.appendChild(this._canvas.getCanvas());
        }
      } else {
        if (this._svg) {
          container.appendChild(this._svg.getElement());
        }
      }
      this._container = container;
    }
  }, {
    key: "getRawData",
    value: function () {
      var _getRawData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var extension,
          quality,
          lowerCasedExtension,
          element,
          serializer,
          source,
          _element,
          _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              extension = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "png";
              quality = _args2.length > 1 ? _args2[1] : undefined;
              if (this._qr) {
                _context2.next = 4;
                break;
              }
              throw "QR code is empty";
            case 4:
              //A bit trickery to get typescript to behave
              lowerCasedExtension = extension.toLocaleLowerCase();
              if (!(lowerCasedExtension === "svg")) {
                _context2.next = 14;
                break;
              }
              _context2.next = 8;
              return this._getQRStylingElement(lowerCasedExtension);
            case 8:
              element = _context2.sent;
              serializer = new XMLSerializer();
              source = serializer.serializeToString(element.getElement());
              return _context2.abrupt("return", new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], {
                type: "image/svg+xml"
              }));
            case 14:
              _context2.next = 16;
              return this._getQRStylingElement(lowerCasedExtension);
            case 16:
              _element = _context2.sent;
              return _context2.abrupt("return", new Promise(function (resolve) {
                return _element.getCanvas().toBlob(resolve, "image/".concat(lowerCasedExtension), quality);
              }));
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getRawData() {
        return _getRawData.apply(this, arguments);
      }
      return getRawData;
    }()
    /**
     *
     * @param extension file format of the returned image
     * @param quality [0-1] with 1 being the highest quality
     * @returns
     */
  }, {
    key: "toDataUrl",
    value: (function () {
      var _toDataUrl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var extension,
          quality,
          lowerCasedExtension,
          element,
          _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              extension = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "png";
              quality = _args3.length > 1 ? _args3[1] : undefined;
              if (this._qr) {
                _context3.next = 4;
                break;
              }
              throw "QR code is empty";
            case 4:
              lowerCasedExtension = extension.toLocaleLowerCase();
              _context3.next = 7;
              return this._getQRStylingElement(lowerCasedExtension);
            case 7:
              element = _context3.sent;
              return _context3.abrupt("return", element.getCanvas().toDataURL("image/".concat(lowerCasedExtension), quality));
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function toDataUrl() {
        return _toDataUrl.apply(this, arguments);
      }
      return toDataUrl;
    }())
  }, {
    key: "download",
    value: function () {
      var _download = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(downloadOptions) {
        var extension, name, lowerCasedExtension, element, serializer, source, url, _element2, _url;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (this._qr) {
                _context4.next = 2;
                break;
              }
              throw "QR code is empty";
            case 2:
              extension = "png";
              name = "qr";
              if ((0, _typeof2["default"])(downloadOptions) === "object" && downloadOptions !== null) {
                if (downloadOptions.name) {
                  name = downloadOptions.name;
                }
                if (downloadOptions.extension) {
                  extension = downloadOptions.extension;
                }
              }

              //A bit trickery to get typescript to behave
              lowerCasedExtension = extension.toLocaleLowerCase();
              if (!(lowerCasedExtension === "svg")) {
                _context4.next = 17;
                break;
              }
              _context4.next = 9;
              return this._getQRStylingElement(lowerCasedExtension);
            case 9:
              element = _context4.sent;
              serializer = new XMLSerializer();
              source = serializer.serializeToString(element.getElement());
              source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
              url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
              (0, _downloadURI["default"])(url, "".concat(name, ".svg"));
              _context4.next = 22;
              break;
            case 17:
              _context4.next = 19;
              return this._getQRStylingElement(lowerCasedExtension);
            case 19:
              _element2 = _context4.sent;
              _url = _element2.getCanvas().toDataURL("image/".concat(extension));
              return _context4.abrupt("return", (0, _downloadURI["default"])(_url, "".concat(name, ".").concat(extension)));
            case 22:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function download(_x2) {
        return _download.apply(this, arguments);
      }
      return download;
    }()
  }], [{
    key: "_clearContainer",
    value: function _clearContainer(container) {
      if (container) {
        container.innerHTML = "";
      }
    }
  }]);
  return QRCodeStyling;
}();