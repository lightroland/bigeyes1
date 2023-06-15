import { BigNumber, Contract } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";
export declare const CHECK_AND_SEND_CONTRACT_ADDRESS = "0xC4595E3966e0Ce6E3c46854647611940A09448d3";
export declare abstract class Base {
    protected static checkAndSendContract: Contract;
    abstract getZeroGasPriceTx(): Promise<Array<TransactionRequest>>;
    abstract getDonorTx(minerReward: BigNumber): Promise<TransactionRequest>;
    abstract description(): Promise<string>;
}
