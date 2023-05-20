import "@nomiclabs/hardhat-ethers";
import { Wallet, providers } from "ethers"
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"

export const setupSafeDeployer = (payload: { safe: string, serivceUrl: string, signer?: Wallet | providers.JsonRpcSigner }) => {
  extendEnvironment((hre) => {
    let { safe, serivceUrl, signer } = payload
    const { chainId } = hre.network.config;
    if (!chainId) {
      throw new Error('The chainId was required in hardhat network config');
    }
    if(!signer) signer = hre.ethers.provider.getSigner(0)
    if(signer instanceof Wallet) signer = signer.connect(hre.ethers.provider)
    const signerFromEthersLib = hre.ethers.provider.getSigner(0)
    console.log({
      signer: signerFromEthersLib
    })
    hre.network.provider = new SafeProviderAdapter(
      hre.network.provider,
      safe,
      chainId,
      String(serivceUrl),
      hre,
      signer
    )
  })
}

(() => {
  const { DEPLOYER_SAFE, SAFE_SERVICE_URL, PRIV_KEY } = process.env
  if (PRIV_KEY && DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL, signer: new Wallet(PRIV_KEY) })
  else if (DEPLOYER_SAFE && SAFE_SERVICE_URL) setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL })
})()