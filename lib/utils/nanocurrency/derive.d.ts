export default function deriveAccount(masterSeed: string, index: number): {
    address: string;
    keys: {
        privateKey: string;
        publicKey: string;
    };
    _index: number;
};
