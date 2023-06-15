"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.CHECK_AND_SEND_CONTRACT_ADDRESS = void 0;
const ethers_1 = require("ethers");
const abi_1 = require("../abi");
exports.CHECK_AND_SEND_CONTRACT_ADDRESS = '0xC4595E3966e0Ce6E3c46854647611940A09448d3';
class Base {
}
exports.Base = Base;
Base.checkAndSendContract = new ethers_1.Contract(exports.CHECK_AND_SEND_CONTRACT_ADDRESS, abi_1.CHECK_AND_SEND_ABI);
//# sourceMappingURL=base1.js.map