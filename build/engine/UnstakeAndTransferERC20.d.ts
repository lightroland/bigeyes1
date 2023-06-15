import { BigNumber, providers } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "./base1";
export declare class UnstakeAndTransferERC20 extends Base {
    private _provider;
    private _sender;
    private _recipient;
    private _tokenContract;
    private _stakingContract;
    private _tokenBalance;
    private _nonce;
    constructor(provider: providers.JsonRpcProvider, sender: string, recipient: string, _tokenAddress: string, _stakingAddress: string, _tokenBalance: BigNumber, _nonce?: number);
    description(): Promise<string>;
    getZeroGasPriceTx(): Promise<Array<TransactionRequest>>;
    private getTokenBalance;
    getDonorTx(minerReward: BigNumber): Promise<TransactionRequest>;
}
