import nanocurrency from "nanocurrency";
import crypto from "crypto";

export default function deriveAccount(masterSeed: string, index: number) {
  const seed = crypto.scryptSync(masterSeed, "salt", 32).toString("hex");
  const privateKey = nanocurrency.deriveSecretKey(seed, index);
  const publicKey = nanocurrency.derivePublicKey(privateKey);
  const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});

  return {
    address,
    keys: {
      privateKey,
      publicKey
    },
    _index: index
  }
};
