"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSafeDeployer = void 0;
require("@nomiclabs/hardhat-ethers");
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const adapter_1 = require("./adapter");
const setupSafeDeployer = (payload) => {
    (0, config_1.extendEnvironment)((env) => {
        const { infuraApiKey, safe, serivceUrl } = payload;
        const { chainId } = env.network.config;
        if (!chainId) {
            throw new Error('The chainId was required in hardhat network config');
        }
        if (payload.signer instanceof ethers_1.Wallet)
            payload.signer = payload.signer.connect(env.ethers.provider);
        env.network.provider = new adapter_1.SafeProviderAdapter(env.network.provider, payload.signer, safe, chainId, infuraApiKey, serivceUrl);
    });
};
exports.setupSafeDeployer = setupSafeDeployer;
//# sourceMappingURL=index.js.map