import { EthereumProvider, HardhatRuntimeEnvironment, JsonRpcRequest, JsonRpcResponse, RequestArguments } from "hardhat/types";
import { SafeSignature, SafeTransaction } from "./execution";
import { Contract, utils } from "ethers";
import { SafeEthersSigner } from '@safe-global/safe-ethers-adapters';
import { EthersAdapter } from '@safe-global/protocol-kit';
export declare class SafeProviderAdapter implements EthereumProvider {
    chainId: number;
    createLibAddress: string;
    createLibInterface: utils.Interface;
    safeInterface: utils.Interface;
    safeContract: Contract;
    safe: string;
    serviceUrl: string;
    submittedTxs: Map<string, any>;
    wrapped: any;
    accounts: string[];
    ethAdapter: EthersAdapter;
    safeSigner: SafeEthersSigner | undefined;
    hhProvider: EthereumProvider;
    constructor(wrapped: any, safe: string, chainId: number, infuraApiKey: string, serviceUrl: string, hre: HardhatRuntimeEnvironment);
    estimateSafeTx(safe: string, safeTx: SafeTransaction): Promise<any>;
    getSafeTxDetails(safeTxHash: string): Promise<any>;
    proposeTx(safeTxHash: string, safeTx: SafeTransaction, signature: SafeSignature): Promise<String>;
    sendAsync(payload: JsonRpcRequest, callback: (error: any, response: JsonRpcResponse) => void): void;
    request(args: RequestArguments): Promise<unknown>;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    listenerCount(event: string | symbol): number;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    eventNames(): (string | symbol)[];
    send(method: string, params: any): Promise<any>;
    private getRpcUrls;
    private static getSafeEthersAdapter;
    getGnosisSigner(): Promise<SafeEthersSigner>;
}
//# sourceMappingURL=adapter.d.ts.map