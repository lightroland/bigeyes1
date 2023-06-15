import { providers } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "./Base";
export declare class ClaimReward extends Base {
    private _sender;
    private _recipient;
    private _tokenContract;
    constructor(provider: providers.JsonRpcProvider, sender: string, recipient: string, _tokenAddress: string);
    description(): Promise<string>;
    getSponsoredTransactions(): Promise<Array<TransactionRequest>>;
    private getTokenBalance;
}
