"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAKING_ABI = exports.ERC20_ABI = exports.CHECK_AND_SEND_ABI = void 0;
exports.CHECK_AND_SEND_ABI = [{
        "inputs": [{
                "internalType": "address",
                "name": "_target",
                "type": "address"
            }, { "internalType": "bytes", "name": "_payload", "type": "bytes" }, {
                "internalType": "bytes32",
                "name": "_resultMatch",
                "type": "bytes32"
            }], "name": "check32BytesAndSend", "outputs": [], "stateMutability": "payable", "type": "function"
    }, {
        "inputs": [{ "internalType": "address[]", "name": "_targets", "type": "address[]" }, {
                "internalType": "bytes[]",
                "name": "_payloads",
                "type": "bytes[]"
            }, { "internalType": "bytes32[]", "name": "_resultMatches", "type": "bytes32[]" }],
        "name": "check32BytesAndSendMulti",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "_target", "type": "address" }, {
                "internalType": "bytes",
                "name": "_payload",
                "type": "bytes"
            }, { "internalType": "bytes", "name": "_resultMatch", "type": "bytes" }],
        "name": "checkBytesAndSend",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address[]", "name": "_targets", "type": "address[]" }, {
                "internalType": "bytes[]",
                "name": "_payloads",
                "type": "bytes[]"
            }, { "internalType": "bytes[]", "name": "_resultMatches", "type": "bytes[]" }],
        "name": "checkBytesAndSendMulti",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }];
exports.ERC20_ABI = [];
exports.STAKING_ABI = [];
//# sourceMappingURL=abi.js.map