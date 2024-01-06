"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));
var _ws = _interopRequireDefault(require("ws"));
var _reconnectingWebsocket = _interopRequireDefault(require("reconnecting-websocket"));
var _events = _interopRequireDefault(require("events"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
var _websocket = /*#__PURE__*/new WeakMap();
var WebSocket = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(WebSocket, _EventEmitter);
  var _super = _createSuper(WebSocket);
  /** 
  * Opens websocket connection and listens for events
  * @param {string} url - The URL of the websocket server.
  */
  function WebSocket(url) {
    var _this;
    (0, _classCallCheck2["default"])(this, WebSocket);
    _this = _super.call(this);
    _classPrivateFieldInitSpec((0, _assertThisInitialized2["default"])(_this), _websocket, {
      writable: true,
      value: void 0
    });
    if (!url.startsWith("ws://") && !url.startsWith("wss://")) throw new Error("Invalid WS URL");
    (0, _classPrivateFieldSet2["default"])((0, _assertThisInitialized2["default"])(_this), _websocket, new _reconnectingWebsocket["default"](url, [], {
      WebSocket: _ws["default"]
    }));
    (0, _classPrivateFieldGet2["default"])((0, _assertThisInitialized2["default"])(_this), _websocket).onerror = function (error) {
      return _this.emit("error", error);
    };
    (0, _classPrivateFieldGet2["default"])((0, _assertThisInitialized2["default"])(_this), _websocket).onclose = function (event) {
      return _this.emit("close", event);
    };
    (0, _classPrivateFieldGet2["default"])((0, _assertThisInitialized2["default"])(_this), _websocket).onopen = function () {
      return _this.emit("ready");
    };
    (0, _classPrivateFieldGet2["default"])((0, _assertThisInitialized2["default"])(_this), _websocket).onmessage = function (event) {
      return _this.emit("message", JSON.parse(event.data));
    };
    return _this;
  }
  (0, _createClass2["default"])(WebSocket, [{
    key: "send",
    value: function send(json) {
      (0, _classPrivateFieldGet2["default"])(this, _websocket).send(JSON.stringify(json));
    }
  }]);
  return WebSocket;
}(_events["default"]);
var _default = exports["default"] = WebSocket;