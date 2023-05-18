"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSafeTransaction = exports.signHash = exports.EIP712_SAFE_TX_TYPE = void 0;
const bytes_1 = require("@ethersproject/bytes");
const strings_1 = require("@ethersproject/strings");
const constants_1 = require("@ethersproject/constants");
const bytes_2 = require("@ethersproject/bytes");
exports.EIP712_SAFE_TX_TYPE = {
    // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
    SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
};
const signHash = async (signer, hash, from) => {
    if (!signer.signMessage && from)
        signer.signMessage = (message) => new Promise((resolve, reject) => {
            const data = ((typeof (message) === "string") ? strings_1.toUtf8Bytes(message) : message);
            const address = from;
            try {
                resolve(signer.send("personal_sign", [bytes_2.hexlify(data), address.toLowerCase()]));
            }
            catch (error) {
                reject(error);
            }
        });
    const typedDataHash = bytes_1.arrayify(hash);
    return {
        signer: from || await signer.getAddress(),
        data: (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20")
    };
};
exports.signHash = signHash;
const buildSafeTransaction = (template) => {
    return {
        to: template.to,
        value: template.value || 0,
        data: template.data || "0x",
        operation: template.operation || 0,
        safeTxGas: template.safeTxGas || 0,
        baseGas: template.baseGas || 0,
        gasPrice: template.gasPrice || 0,
        gasToken: template.gasToken || constants_1.AddressZero,
        refundReceiver: template.refundReceiver || constants_1.AddressZero,
        nonce: template.nonce
    };
};
exports.buildSafeTransaction = buildSafeTransaction;
//# sourceMappingURL=execution.js.map