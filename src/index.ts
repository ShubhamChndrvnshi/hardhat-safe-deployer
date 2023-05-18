import "@nomiclabs/hardhat-ethers";
import { Signer, Wallet } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { EthereumProvider } from "hardhat/types";
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { safe: string, serivceUrl: string, infuraApiKey: string }) => {
  extendEnvironment((env) => {
    const { infuraApiKey, safe, serivceUrl } = payload
    const { chainId } = env.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    env.network.provider = new SafeProviderAdapter(
      env.network.provider,
      safe,
      chainId,
      infuraApiKey,
      String(serivceUrl),
      env
    )
  })
}