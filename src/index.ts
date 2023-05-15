import "@nomiclabs/hardhat-ethers";
import { Signer, Wallet } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { EthereumProvider } from "hardhat/types";
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { signer: Wallet | EthereumProvider, safe: string, serivceUrl: string | undefined, infuraApiKey: string }) => {
  extendEnvironment((env) => {
    const { infuraApiKey, safe, serivceUrl } = payload
    const { chainId } = env.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    if(payload.signer instanceof Wallet) payload.signer = payload.signer.connect(env.ethers.provider)

    env.network.provider = new SafeProviderAdapter(
      env.network.provider,
      payload.signer,
      safe,
      chainId,
      infuraApiKey,
      serivceUrl
    )
  })
}