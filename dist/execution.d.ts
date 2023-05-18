import { BigNumber } from "@ethersproject/bignumber";
import { EthereumProvider } from "hardhat/types";
export declare const EIP712_SAFE_TX_TYPE: {
    SafeTx: {
        type: string;
        name: string;
    }[];
};
export interface MetaTransaction {
    to: string;
    value: string | number | BigNumber;
    data: string;
    operation: number;
}
export interface SafeTransaction extends MetaTransaction {
    safeTxGas: string | number;
    baseGas: string | number;
    gasPrice: string | number;
    gasToken: string;
    refundReceiver: string;
    nonce: string | number;
}
export interface SafeSignature {
    signer: string;
    data: string;
}
export declare const signHash: (provider: EthereumProvider, hash: string, from: string) => Promise<SafeSignature>;
export declare const buildSafeTransaction: (template: {
    to: string;
    value?: BigNumber | number | string;
    data?: string;
    operation?: number;
    safeTxGas?: number | string;
    baseGas?: number | string;
    gasPrice?: number | string;
    gasToken?: string;
    refundReceiver?: string;
    nonce: number;
}) => SafeTransaction;
//# sourceMappingURL=execution.d.ts.map