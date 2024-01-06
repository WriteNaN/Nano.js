"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = deriveAccount;
var _nanocurrency = _interopRequireDefault(require("nanocurrency"));
var _crypto = _interopRequireDefault(require("crypto"));
function deriveAccount(masterSeed, index) {
  var seed = _crypto["default"].scryptSync(masterSeed, "salt", 32).toString("hex");
  var privateKey = _nanocurrency["default"].deriveSecretKey(seed, index);
  var publicKey = _nanocurrency["default"].derivePublicKey(privateKey);
  var address = _nanocurrency["default"].deriveAddress(publicKey, {
    useNanoPrefix: true
  });
  return {
    address: address,
    keys: {
      privateKey: privateKey,
      publicKey: publicKey
    },
    _index: index
  };
}
;