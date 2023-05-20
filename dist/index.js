"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSafeDeployer = void 0;
require("@nomiclabs/hardhat-ethers");
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const adapter_1 = require("./adapter");
const setupSafeDeployer = (payload) => {
    config_1.extendEnvironment((hre) => {
        const { safe, serivceUrl, signer } = payload;
        hre.network.provider = new adapter_1.SafeProviderAdapter(hre, safe, serivceUrl, signer ? signer.connect(hre.ethers.provider) : undefined);
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