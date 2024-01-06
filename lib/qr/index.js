"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressToQr = addressToQr;
exports["default"] = createQr;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _qr = _interopRequireDefault(require("./qr"));
var _convert = require("../utils/convert");
function addressToQr(_x, _x2) {
  return _addressToQr.apply(this, arguments);
}
function _addressToQr() {
  _addressToQr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(address, options) {
    var qrC, qrCode;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!options) {
            _context.next = 7;
            break;
          }
          qrC = new _qr["default"](options);
          _context.next = 4;
          return qrC.download();
        case 4:
          return _context.abrupt("return", _context.sent);
        case 7:
          // @ts-ignore
          qrCode = new _qr["default"]({
            "width": 300,
            "height": 300,
            "data": "nano:".concat(address),
            "margin": 0,
            "qrOptions": {
              "typeNumber": "0",
              "mode": "Byte",
              "errorCorrectionLevel": "Q"
            },
            "imageOptions": {
              "hideBackgroundDots": true,
              "imageSize": 0.5,
              "margin": 0
            },
            "dotsOptions": {
              "type": "extra-rounded",
              "color": "#6a1a4c",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#d06caa"
                }, {
                  "offset": 1,
                  "color": "#2880c3"
                }]
              }
            },
            "backgroundOptions": {
              "color": "transparent"
            },
            "image": "https://raw.githubusercontent.com/WriteNaN/Nano.js/main/src/assets/nano.png",
            "dotsOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#6a1a4c",
                "color2": "#6a1a4c",
                "rotation": "0"
              }
            },
            "cornersSquareOptions": {
              "type": "extra-rounded",
              "color": "#000000",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#e3168e"
                }, {
                  "offset": 1,
                  "color": "#1a96f4"
                }]
              }
            },
            "cornersSquareOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
              }
            },
            "cornersDotOptions": {
              "type": "",
              "color": "#000000",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#f20d0d"
                }, {
                  "offset": 1,
                  "color": "#1018f4"
                }]
              }
            },
            "cornersDotOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
              }
            },
            "backgroundOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#ffffff",
                "color2": "#ffffff",
                "rotation": "0"
              }
            }
          });
          _context.next = 10;
          return qrCode.download();
        case 10:
          return _context.abrupt("return", _context.sent);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _addressToQr.apply(this, arguments);
}
function createQr(_x3) {
  return _createQr.apply(this, arguments);
}
function _createQr() {
  _createQr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var uriBase, queryParams, uri, defaultOption, qrCode;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          uriBase = "nano:".concat(data.address);
          queryParams = ["amount=".concat(data.isRaw ? data.amount : (0, _convert.nanoToRaw)(data.amount))];
          if (data.label) queryParams.push("label=".concat(encodeURIComponent(data.label)));
          if (data.message) queryParams.push("message=".concat(encodeURIComponent(data.message)));
          uri = "".concat(uriBase, "?").concat(queryParams.join('&'));
          defaultOption = {
            "width": 300,
            "height": 300,
            "data": uri,
            "margin": 0,
            "qrOptions": {
              "typeNumber": "0",
              "mode": "Byte",
              "errorCorrectionLevel": "L"
            },
            "imageOptions": {
              "hideBackgroundDots": true,
              "imageSize": data.isRaw ? 0.5 : 0.5,
              "margin": 0
            },
            "dotsOptions": {
              "type": "extra-rounded",
              "color": "#6a1a4c",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#d06caa"
                }, {
                  "offset": 1,
                  "color": "#2880c3"
                }]
              }
            },
            "backgroundOptions": {
              "color": "transparent"
            },
            "image": "https://raw.githubusercontent.com/WriteNaN/Nano.js/main/src/assets/nano.png",
            "dotsOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#6a1a4c",
                "color2": "#6a1a4c",
                "rotation": "0"
              }
            },
            "cornersSquareOptions": {
              "type": "extra-rounded",
              "color": "#000000",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#e3168e"
                }, {
                  "offset": 1,
                  "color": "#1a96f4"
                }]
              }
            },
            "cornersSquareOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
              }
            },
            "cornersDotOptions": {
              "type": "",
              "color": "#000000",
              "gradient": {
                "type": "linear",
                "rotation": 0,
                "colorStops": [{
                  "offset": 0,
                  "color": "#f20d0d"
                }, {
                  "offset": 1,
                  "color": "#1018f4"
                }]
              }
            },
            "cornersDotOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
              }
            },
            "backgroundOptionsHelper": {
              "colorType": {
                "single": true,
                "gradient": false
              },
              "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#ffffff",
                "color2": "#ffffff",
                "rotation": "0"
              }
            }
          }; // @ts-ignore
          qrCode = new _qr["default"](defaultOption);
          _context2.t0 = uri;
          _context2.next = 10;
          return qrCode.download();
        case 10:
          _context2.t1 = _context2.sent;
          return _context2.abrupt("return", {
            uri: _context2.t0,
            qrCode: _context2.t1
          });
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _createQr.apply(this, arguments);
}