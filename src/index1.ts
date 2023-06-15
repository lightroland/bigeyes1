import {
  FlashbotsBundleProvider, FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction
} from "@flashbots/ethers-provider-bundle";
import { BigNumber, providers, Wallet, Contract } from "ethers";
import { Base } from "./engine/Base";
import { checkSimulation, gasPriceToGwei, printTransactions } from "./utils";
import { TransferERC20 } from "./engine/TransferERC20";
import { Approval721 } from "./engine/Approval721";
import { parseEther } from "ethers/lib/utils";
import { ClaimReward } from "./engine/ClaimReward";


const ERC20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"paused","type":"bool"}],"name":"setRebasePaused","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paused","type":"bool"}],"name":"setTokenPaused","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rebasePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"epoch","type":"uint256"},{"name":"supplyDelta","type":"int256"}],"name":"rebase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenPaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"monetaryPolicy_","type":"address"}],"name":"setMonetaryPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"monetaryPolicy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner_","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"epoch","type":"uint256"},{"indexed":false,"name":"totalSupply","type":"uint256"}],"name":"LogRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"paused","type":"bool"}],"name":"LogRebasePaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"paused","type":"bool"}],"name":"LogTokenPaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"monetaryPolicy","type":"address"}],"name":"LogMonetaryPolicyUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]


require('log-timestamp');

const BLOCKS_IN_FUTURE = 2;

const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_GAS_PRICE = GWEI.mul(31);
const MINER_REWARD_IN_WEI = parseEther(process.env.MINER_REWARD ?? '0.021');

const PRIVATE_KEY_EXECUTOR = process.env.PRIVATE_KEY_EXECUTOR || "397bee78f9b24faf34c8fed38defbb6bcc969a983ee785a076ef4f90b216fe22"
const PRIVATE_KEY_SPONSOR = process.env.PRIVATE_KEY_SPONSOR || "0eae2752c1e4626b942ca5b55071bc55dad9dae37c3a63f2bc50c6ccc0bedaf4"
const FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY || "b4c4e0bcacb86be448213aacf4388afad15e0b1009c4b0906ad975b117e6feab"
const RECIPIENT = process.env.RECIPIENT || "0xe6aE3BED427f55D8107ce8048625B0a584434133"

if (PRIVATE_KEY_EXECUTOR === "") {
  console.warn("Must provide PRIVATE_KEY_EXECUTOR environment variable, corresponding to Ethereum EOA with assets to be transferred")
  process.exit(1)
}
if (PRIVATE_KEY_SPONSOR === "") {
  console.warn("Must provide PRIVATE_KEY_SPONSOR environment variable, corresponding to an Ethereum EOA with ETH to pay miner")
  process.exit(1)
}
if (FLASHBOTS_RELAY_SIGNING_KEY === "") {
  console.warn("Must provide FLASHBOTS_RELAY_SIGNING_KEY environment variable. Please see https://github.com/flashbots/pm/blob/main/guides/flashbots-alpha.md")
  process.exit(1)
}
if (RECIPIENT === "") {
  console.warn("Must provide RECIPIENT environment variable, an address which will receive assets")
  process.exit(1)
}

const walletRelay = new Wallet(FLASHBOTS_RELAY_SIGNING_KEY)

// ======= UNCOMMENT FOR GOERLI ==========
//const provider = new providers.InfuraProvider(5, process.env.INFURA_API_KEY || '');
//const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay, 'https://relay-goerli.epheph.com/');
// ======= UNCOMMENT FOR GOERLI ==========

// ======= UNCOMMENT FOR MAINNET ==========
// https://arb1.arbitrum.io/rpc
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/298e2f57380f4804ae9103a26aa05ad7"
const provider = new providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
// ======= UNCOMMENT FOR MAINNET ==========

const walletExecutor = new Wallet(PRIVATE_KEY_EXECUTOR);
const walletSponsor = new Wallet(PRIVATE_KEY_SPONSOR);


const createTX = async (engine: Base) => {

  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay);

  const block = await provider.getBlock('latest');

  const sponsoredTransactions = await engine.getSponsoredTransactions();

  const gasEstimates = await Promise.all(sponsoredTransactions.map(tx =>
    provider.estimateGas({
      ...tx,
      from: tx.from === undefined ? walletExecutor.address : tx.from
    }))
  )
  
  const gasEstimateTotal = gasEstimates.reduce((acc, cur) => acc.add(cur), BigNumber.from(0));

  const gasPrice = PRIORITY_GAS_PRICE.add(block.baseFeePerGas || 0);

  const bundleTransactions: Array<FlashbotsBundleTransaction | FlashbotsBundleRawTransaction> = [

    {
      transaction: {
        to: walletExecutor.address,
        gasPrice: gasPrice,
        value: gasEstimateTotal.mul(gasPrice),
        gasLimit: 42000,
        chainId: 1
      },
      signer: walletSponsor
    },
    ...sponsoredTransactions.map((transaction, txNumber) => {
      return {
        transaction: {
          ...transaction,
          gasPrice: gasPrice,
          gasLimit: gasEstimates[txNumber],
          chainId: 1
        },
        signer: walletExecutor,
      }
    })
    
  ]
  
  const signedBundle = await flashbotsProvider.signBundle(bundleTransactions)
  await printTransactions(bundleTransactions, signedBundle);
  console.log("bundleTransactions hash" + signedBundle);
  const simulatedGasPrice = await checkSimulation(flashbotsProvider, signedBundle);

  console.log(await engine.description())

  console.log(`Executor Account: ${walletExecutor.address}`)
  console.log(`Sponsor Account: ${walletSponsor.address}`)
  console.log(`Simulated Gas Price: ${gasPriceToGwei(simulatedGasPrice)} gwei`)
  console.log(`Gas Price: ${gasPriceToGwei(gasPrice)} gwei`)
  console.log(`Gas Used: ${gasEstimateTotal.toString()}`)

  provider.on('block', async (blockNumber) => {
    const simulatedGasPrice = await checkSimulation(flashbotsProvider, signedBundle);
    const targetBlockNumber = blockNumber + BLOCKS_IN_FUTURE;
    console.log(`Current Block Number: ${blockNumber},   Target Block Number:${targetBlockNumber},   gasPrice: ${gasPriceToGwei(simulatedGasPrice)} gwei`)
    const bundleResponse = await flashbotsProvider.sendBundle(bundleTransactions, targetBlockNumber);
    if ('error' in bundleResponse) {
      throw new Error(bundleResponse.error.message)
    }
    const bundleResolution = await bundleResponse.wait()
    if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
      console.log(`Congrats, included in ${targetBlockNumber}`)
      process.exit(0)
    } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
      console.log(`Not included in ${targetBlockNumber}`)
    } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
      console.log("Nonce too high, bailing")
      process.exit(1)
    }
  })


}

async function main() {

  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay);
  const block = await provider.getBlock('latest');

  // ======= UNCOMMENT FOR ERC20 Unstaking ==========
  //const stakeAddress = "0xD77401A76d6cDB7Ac3bb031Bf25dEc07615509E7";
  //const stakeContract  = new Contract(stakeAddress, ERC20_ABI, provider)

  // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
  const tokenAddress = "0xc8de43bfe33ff496fa14c270d9cb29bda196b9b5";
  const tokenContract  = new Contract(tokenAddress, ERC20_ABI, provider)

  provider.on("block", async () => {

    console.log("Listening new block, waiting..)");
    let tokenBal = (await tokenContract.functions.balanceOf(walletExecutor.address))[0];
    //let claimBal = (await stakeContract.functions.depositsOf(walletExecutor.address, 0))[0];
    //let claimTime = (await stakeContract.functions.depositsOf(walletExecutor.address, 0))[2] * 1000;
    //let claimDate = new Date(claimTime * 1000);
    let now  = Date.now();

    if(!tokenBal.eq(0)) {
      
      console.log("Let's go!");
      console.log(`Transferring of ${tokenBal}`);
      const engine1: Base = new TransferERC20(provider, walletExecutor.address, RECIPIENT, tokenAddress);
      await createTX(engine1);

    }
      
    else{
      console.log(`not now! of ${tokenBal}`)
    }
      
  })

}


main()
