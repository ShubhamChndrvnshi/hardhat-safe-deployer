import "@nomiclabs/hardhat-ethers";
import { Wallet } from "ethers";
import { EthereumProvider } from "hardhat/types";
export declare const setupSafeDeployer: (payload: {
    signer: Wallet | EthereumProvider;
    safe: string;
    serivceUrl: string | undefined;
    infuraApiKey: string;
}) => void;
//# sourceMappingURL=index.d.ts.map