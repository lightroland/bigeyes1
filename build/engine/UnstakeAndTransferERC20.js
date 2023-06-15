"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnstakeAndTransferERC20 = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const base1_1 = require("./base1");
const abi_1 = require("../abi");
class UnstakeAndTransferERC20 extends base1_1.Base {
    constructor(provider, sender, recipient, _tokenAddress, _stakingAddress, _tokenBalance, _nonce) {
        super();
        if (!(0, utils_1.isAddress)(sender))
            throw new Error("Bad Address");
        if (!(0, utils_1.isAddress)(recipient))
            throw new Error("Bad Address");
        this._sender = sender;
        this._provider = provider;
        this._recipient = recipient;
        this._tokenBalance = _tokenBalance;
        this._stakingContract = new ethers_1.Contract(_stakingAddress, abi_1.STAKING_ABI, provider);
        this._tokenContract = new ethers_1.Contract(_tokenAddress, abi_1.ERC20_ABI, provider);
        this._nonce = _nonce;
    }
    async description() {
        return `Unstake ${this._tokenBalance.toString()}@${this._tokenContract.address} of ${this._sender} from ${this._stakingContract.address} and transfer to ${this._recipient}`;
    }
    async getZeroGasPriceTx() {
        const unstakeTx = {
            ...(await this._stakingContract.populateTransaction.withdrawUnstakedBalance(this._tokenBalance)),
            gasPrice: ethers_1.BigNumber.from(0),
            gasLimit: ethers_1.BigNumber.from(120000),
            nonce: this._nonce,
        };
        const transferTx = {
            ...(await this._tokenContract.populateTransaction.transfer(this._recipient, this._tokenBalance)),
            gasPrice: ethers_1.BigNumber.from(0),
            gasLimit: ethers_1.BigNumber.from(80000),
            nonce: this._nonce === undefined ? undefined : this._nonce + 1,
        };
        return [unstakeTx, transferTx];
    }
    async getTokenBalance(tokenHolder) {
        return (await this._tokenContract.functions.balanceOf(tokenHolder))[0];
    }
    async getDonorTx(minerReward) {
        var _a;
        const checkTargets = [this._tokenContract.address];
        const checkPayloads = [this._tokenContract.interface.encodeFunctionData('balanceOf', [this._recipient])];
        const expectedBalance = (_a = this._tokenBalance) !== null && _a !== void 0 ? _a : (await this.getTokenBalance(this._sender)).add(await this.getTokenBalance(this._recipient));
        const checkMatches = [this._tokenContract.interface.encodeFunctionResult('balanceOf', [expectedBalance])];
        return {
            ...(await base1_1.Base.checkAndSendContract.populateTransaction.check32BytesAndSendMulti(checkTargets, checkPayloads, checkMatches)),
            value: minerReward,
            gasPrice: ethers_1.BigNumber.from(0),
            gasLimit: ethers_1.BigNumber.from(400000),
        };
    }
}
exports.UnstakeAndTransferERC20 = UnstakeAndTransferERC20;
//# sourceMappingURL=UnstakeAndTransferERC20.js.map