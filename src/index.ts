import "@nomiclabs/hardhat-ethers";
import { Signer, Wallet } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { signer: Wallet | Signer , safe: string, serivceUrl: string | undefined }) => {
  extendEnvironment((env) => {
    const { safe, serivceUrl } = payload
    const { chainId } = env.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    // if(!payload.signer) payload.signer = env.ethers.provider.getSigner(0)
    // else payload.signer =  payload.signer.connect(env.network.provider)
    env.network.provider = new SafeProviderAdapter(
      env.network.provider,
      payload.signer.connect(env.ethers.provider),
      safe,
      chainId,
      serivceUrl
    )
  })
}