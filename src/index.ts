import "@nomiclabs/hardhat-ethers";
import { Wallet } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { safe: string, serivceUrl: string, signer?: Wallet }) => {
  extendEnvironment((env) => {
    const { safe, serivceUrl, signer } = payload
    const { chainId } = env.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    env.network.provider = new SafeProviderAdapter(
      env.network.provider,
      safe,
      chainId,
      String(serivceUrl),
      env,
      signer ? signer.connect(env.ethers.provider) : undefined
    )
  })
}

(() => {
  const { DEPLOYER_SAFE, SAFE_SERVICE_URL, PRIV_KEY } = process.env
  if (PRIV_KEY && DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL, signer: new Wallet(PRIV_KEY) })
  else if (DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL })
})()