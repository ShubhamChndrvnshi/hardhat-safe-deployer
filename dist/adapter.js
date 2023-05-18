"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeProviderAdapter = void 0;
const execution_1 = require("./execution");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
class SafeProviderAdapter {
    constructor(wrapped, safe, chainId, infuraApiKey, serviceUrl, hre) {
        this.createLibAddress = "0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4";
        this.createLibInterface = new ethers_1.utils.Interface(["function performCreate(uint256,bytes)"]);
        this.safeInterface = new ethers_1.utils.Interface(["function nonce() view returns(uint256)"]);
        this.submittedTxs = new Map();
        this.chainId = chainId;
        this.wrapped = wrapped;
        this.accounts = [];
        this.safe = ethers_1.utils.getAddress(safe);
        this.serviceUrl = serviceUrl !== null && serviceUrl !== void 0 ? serviceUrl : "https://safe-transaction.rinkeby.gnosis.io";
        // const rpcUrls = this.getRpcUrls(infuraApiKey);
        this.safeContract = new ethers_1.Contract(safe, this.safeInterface, hre.ethers.provider);
    }
    async estimateSafeTx(safe, safeTx) {
        const url = `${this.serviceUrl}/api/v1/safes/${safe}/multisig-transactions/estimations/`;
        const resp = await axios_1.default.post(url, safeTx);
        return resp.data;
    }
    async getSafeTxDetails(safeTxHash) {
        console.log("DEBUG: GNOSIS SAFE DEPLOYER getSafeTxDetails", safeTxHash);
        const url = `${this.serviceUrl}/api/v1/multisig-transactions/${safeTxHash}`;
        const resp = await axios_1.default.get(url);
        return resp.data;
    }
    async proposeTx(safeTxHash, safeTx, signature) {
        console.log("DEBUG: GNOSIS SAFE DEPLOYER request proposeTx");
        const url = `${this.serviceUrl}/api/v1/safes/${this.safe}/multisig-transactions/`;
        const data = Object.assign(Object.assign({}, safeTx), { contractTransactionHash: safeTxHash, sender: signature.signer, signature: signature.data });
        console.log("DEBUG: GNOSIS SAFE DEPLOYER request proposeTx axios req", { url, data });
        const resp = await axios_1.default.post(url, data);
        console.log("DEBUG: GNOSIS SAFE DEPLOYER request proposeTx axios resp", { resp });
        return resp.data;
    }
    sendAsync(payload, callback) {
        return this.wrapped.sendAsync(payload, callback);
    }
    async request(args) {
        var _a;
        console.log("DEBUG: GNOSIS SAFE DEPLOYER request", args);
        if (!this.signer && !this.accounts.length)
            this.accounts = await this.wrapped.send('eth_accounts');
        if (args.method === 'eth_sendTransaction' && args.params && ((_a = args.params[0].from) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === this.safe.toLowerCase()) {
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX");
            const tx = args.params[0];
            let operation = 0;
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX buildTx");
            if (!tx.to) {
                tx.to = this.createLibAddress;
                tx.data = this.createLibInterface.encodeFunctionData("performCreate", [tx.value || 0, tx.data]);
                tx.value = 0;
                operation = 1;
            }
            const nonce = (await this.safeContract.nonce()).toNumber();
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX buildSafeTransaction", {
                nonce
            });
            const safeTx = execution_1.buildSafeTransaction({
                to: ethers_1.utils.getAddress(tx.to),
                data: tx.data,
                value: tx.value,
                safeTxGas: 0,
                operation,
                nonce
            });
            const estimation = await this.estimateSafeTx(this.safe, safeTx);
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX estimateSafeTx", estimation);
            safeTx.safeTxGas = estimation.safeTxGas;
            const safeTxHash = ethers_1.utils._TypedDataEncoder.hash({
                chainId: this.chainId,
                verifyingContract: this.safe,
            }, execution_1.EIP712_SAFE_TX_TYPE, safeTx);
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX signHash");
            const signature = await execution_1.signHash(this.signer || this.wrapped, safeTxHash, this.accounts[0]);
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request sendingTX signature", signature);
            await this.proposeTx(safeTxHash, safeTx, signature);
            this.submittedTxs.set(safeTxHash, {
                from: this.safe,
                hash: safeTxHash,
                gas: 0,
                gasPrice: '0x00',
                nonce: 0,
                input: tx.data,
                value: tx.value || 0,
                to: tx.to,
                blockHash: null,
                blockNumber: null,
                transactionIndex: null,
            });
            console.log("DEBUG: GNOSIS SAFE DEPLOYER request this.submittedTxs", this.submittedTxs.get(safeTxHash));
            return safeTxHash;
        }
        if (args.method === 'eth_getTransactionByHash') {
            let txHash = args.params[0];
            if (this.submittedTxs.has(txHash)) {
                return this.submittedTxs.get(txHash);
            }
        }
        if (args.method === 'eth_getTransactionReceipt') {
            let txHash = args.params[0];
            let safeTx;
            try {
                safeTx = await this.getSafeTxDetails(txHash);
            }
            catch (e) { }
            if (safeTx === null || safeTx === void 0 ? void 0 : safeTx.transactionHash) {
                const resp = await this.wrapped.request({ method: 'eth_getTransactionReceipt', params: [safeTx.transactionHash] });
                if (!resp)
                    return resp;
                const success = resp.logs.find((log) => log.topics[0] === "0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e");
                resp.status = !!success ? "0x1" : "0x0";
                if (safeTx.to.toLowerCase() === this.createLibAddress.toLowerCase()) {
                    const creationLog = resp.logs.find((log) => log.topics[0] === "0x4db17dd5e4732fb6da34a148104a592783ca119a1e7bb8829eba6cbadef0b511");
                    resp.contractAddress = ethers_1.utils.getAddress("0x" + creationLog.data.slice(creationLog.data.length - 40));
                }
                return resp;
            }
        }
        const result = await this.wrapped.request(args);
        if (args.method === 'eth_accounts') {
            result.push(this.safe);
        }
        return result;
    }
    addListener(event, listener) {
        return this.wrapped.addListener(event, listener);
    }
    on(event, listener) {
        return this.wrapped.on(event, listener);
    }
    once(event, listener) {
        return this.wrapped.once(event, listener);
    }
    removeListener(event, listener) {
        return this.wrapped.removeListener(event, listener);
    }
    off(event, listener) {
        return this.wrapped.off(event, listener);
    }
    removeAllListeners(event) {
        return this.wrapped.removeAllListeners(event);
    }
    setMaxListeners(n) {
        return this.wrapped.setMaxListeners(n);
    }
    getMaxListeners() {
        return this.wrapped.getMaxListeners();
    }
    listeners(event) {
        return this.wrapped.listeners(event);
    }
    rawListeners(event) {
        return this.wrapped.rawListeners(event);
    }
    emit(event, ...args) {
        return this.wrapped.emit(event, ...args);
    }
    listenerCount(event) {
        return this.wrapped.listenerCount(event);
    }
    prependListener(event, listener) {
        return this.wrapped.prependListener(event, listener);
    }
    prependOnceListener(event, listener) {
        return this.wrapped.prependOnceListener(event, listener);
    }
    eventNames() {
        return this.wrapped.eventNames();
    }
    async send(method, params) {
        console.log("DEBUG: GNOSIS SAFE DEPLOYER send");
        return await this.request({ method, params });
    }
    getRpcUrls(apiKey) {
        const networks = {
            1: `https://mainnet.infura.io/v3/${apiKey}`,
            3: `https://ropsten.infura.io/v3/${apiKey}`,
            4: `https://rinkeby.infura.io/v3/${apiKey}`,
            42: `https://kovan.infura.io/v3/${apiKey}`,
            5: `https://goerli.infura.io/v3/${apiKey}`,
        };
        return networks;
    }
}
exports.SafeProviderAdapter = SafeProviderAdapter;
//# sourceMappingURL=adapter.js.map