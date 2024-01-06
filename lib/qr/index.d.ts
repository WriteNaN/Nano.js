export declare function addressToQr(address: string, options?: Record<string, any>): Promise<any>;
export default function createQr(data: {
    address: string;
    amount: number;
    label?: string;
    message?: string;
    isRaw: boolean;
}): Promise<{
    uri: string;
    qrCode: any;
}>;
