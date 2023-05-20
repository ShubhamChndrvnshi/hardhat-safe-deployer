import "@nomiclabs/hardhat-ethers";
import { Wallet } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { safe: string, serivceUrl: string, signer?: Wallet }) => {
  extendEnvironment((hre) => {
    const { safe, serivceUrl, signer } = payload
    const { chainId } = hre.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    hre.network.provider = new SafeProviderAdapter(
      hre,
      safe,
      chainId,
      serivceUrl,
      signer ? signer.connect(hre.ethers.provider) : undefined
    )
  })
}

(() => {
  const { DEPLOYER_SAFE, SAFE_SERVICE_URL, PRIV_KEY } = process.env
  if (PRIV_KEY && DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL, signer: new Wallet(PRIV_KEY) })
  else if (DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL })
})()