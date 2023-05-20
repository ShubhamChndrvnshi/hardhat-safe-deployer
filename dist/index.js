"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSafeDeployer = void 0;
require("@nomiclabs/hardhat-ethers");
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const adapter_1 = require("./adapter");
const setupSafeDeployer = (payload) => {
    config_1.extendEnvironment((hre) => {
        let { safe, serivceUrl, signer } = payload;
        const { chainId } = hre.network.config;
        if (!chainId) {
            throw new Error('The chainId was required in hardhat network config');
        }
        if (!signer)
            signer = hre.ethers.provider.getSigner(0);
        if (signer instanceof ethers_1.Wallet)
            signer = signer.connect(hre.ethers.provider);
        const signerFromEthersLib = hre.ethers.provider.getSigner(0);
        console.log({
            signer: signerFromEthersLib
        });
        hre.network.provider = new adapter_1.SafeProviderAdapter(hre.network.provider, safe, chainId, String(serivceUrl), hre, signer);
    });
};
exports.setupSafeDeployer = setupSafeDeployer;
(() => {
    const { DEPLOYER_SAFE, SAFE_SERVICE_URL, PRIV_KEY } = process.env;
    if (PRIV_KEY && DEPLOYER_SAFE && SAFE_SERVICE_URL)
        exports.setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL, signer: new ethers_1.Wallet(PRIV_KEY) });
    else if (DEPLOYER_SAFE && SAFE_SERVICE_URL)
        exports.setupSafeDeployer({ safe: DEPLOYER_SAFE, serivceUrl: SAFE_SERVICE_URL });
})();
//# sourceMappingURL=index.js.map