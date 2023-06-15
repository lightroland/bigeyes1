"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_provider_bundle_1 = require("@flashbots/ethers-provider-bundle");
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const utils_2 = require("ethers/lib/utils");
const claimReward_1 = require("./engine/claimReward");
const ERC20_ABI = [{ "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_symbol", "type": "string" }, { "internalType": "address", "name": "_depositToken", "type": "address" }, { "internalType": "address", "name": "_rewardToken", "type": "address" }, { "internalType": "address", "name": "_escrowPool", "type": "address" }, { "internalType": "uint256", "name": "_escrowPortion", "type": "uint256" }, { "internalType": "uint256", "name": "_escrowDuration", "type": "uint256" }, { "internalType": "uint256", "name": "_maxBonus", "type": "uint256" }, { "internalType": "uint256", "name": "_maxLockDuration", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "delegator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "fromDelegate", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toDelegate", "type": "address" }], "name": "DelegateChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "delegate", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "previousBalance", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256" }], "name": "DelegateVotesChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "duration", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }], "name": "Deposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_escrowedAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_nonEscrowedAmount", "type": "uint256" }], "name": "RewardsClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "rewardsDistributed", "type": "uint256" }], "name": "RewardsDistributed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "fundsWithdrawn", "type": "uint256" }], "name": "RewardsWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenSaved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "depositId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawn", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_LOCK_DURATION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "POINTS_MULTIPLIER", "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TOKEN_SAVER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint32", "name": "pos", "type": "uint32" }], "name": "checkpoints", "outputs": [{ "components": [{ "internalType": "uint32", "name": "fromBlock", "type": "uint32" }, { "internalType": "uint224", "name": "votes", "type": "uint224" }], "internalType": "struct ERC20Votes.Checkpoint", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_receiver", "type": "address" }], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "cumulativeRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }], "name": "delegate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "uint256", "name": "expiry", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "delegateBySig", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "delegates", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_duration", "type": "uint256" }, { "internalType": "address", "name": "_receiver", "type": "address" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "depositToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "depositsOf", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint64", "name": "start", "type": "uint64" }, { "internalType": "uint64", "name": "end", "type": "uint64" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "distributeRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "escrowDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "escrowPool", "outputs": [{ "internalType": "contract ITimeLockPool", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "escrowPortion", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getDepositsOf", "outputs": [{ "components": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint64", "name": "start", "type": "uint64" }, { "internalType": "uint64", "name": "end", "type": "uint64" }], "internalType": "struct TimeLockPool.Deposit[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getDepositsOfLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockDuration", "type": "uint256" }], "name": "getMultiplier", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "name": "getPastTotalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "name": "getPastVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getTotalDeposit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "maxBonus", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxLockDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "numCheckpoints", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "pointsCorrection", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pointsPerShare", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_receiver", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "saveToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_depositId", "type": "uint256" }, { "internalType": "address", "name": "_receiver", "type": "address" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "withdrawableRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "withdrawnRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "withdrawnRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
require('log-timestamp');
const BLOCKS_IN_FUTURE = 2;
const GWEI = ethers_1.BigNumber.from(10).pow(9);
const PRIORITY_GAS_PRICE = GWEI.mul(31);
const MINER_REWARD_IN_WEI = (0, utils_2.parseEther)((_a = process.env.MINER_REWARD) !== null && _a !== void 0 ? _a : '0.021');
const PRIVATE_KEY_EXECUTOR = process.env.PRIVATE_KEY_EXECUTOR || "0524510e3a877df54c22d0384daa35cbd5b6b64bb3000b5177cabf9f5fa613a0";
const PRIVATE_KEY_SPONSOR = process.env.PRIVATE_KEY_SPONSOR || "910e6953218dd293bdd640c32965462da93efa106eddc9e7b0a97505ee36fc4d";
const FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY || "b4c4e0bcacb86be448213aacf4388afad15e0b1009c4b0906ad975b117e6feab";
const RECIPIENT = process.env.RECIPIENT || "0x75665FaBD0d2952e3FfFE9F12f802DfB647e86dE";
if (PRIVATE_KEY_EXECUTOR === "") {
    console.warn("Must provide PRIVATE_KEY_EXECUTOR environment variable, corresponding to Ethereum EOA with assets to be transferred");
    process.exit(1);
}
if (PRIVATE_KEY_SPONSOR === "") {
    console.warn("Must provide PRIVATE_KEY_SPONSOR environment variable, corresponding to an Ethereum EOA with ETH to pay miner");
    process.exit(1);
}
if (FLASHBOTS_RELAY_SIGNING_KEY === "") {
    console.warn("Must provide FLASHBOTS_RELAY_SIGNING_KEY environment variable. Please see https://github.com/flashbots/pm/blob/main/guides/flashbots-alpha.md");
    process.exit(1);
}
if (RECIPIENT === "") {
    console.warn("Must provide RECIPIENT environment variable, an address which will receive assets");
    process.exit(1);
}
const walletRelay = new ethers_1.Wallet(FLASHBOTS_RELAY_SIGNING_KEY);
// ======= UNCOMMENT FOR GOERLI ==========
//const provider = new providers.InfuraProvider(5, process.env.INFURA_API_KEY || '');
//const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay, 'https://relay-goerli.epheph.com/');
// ======= UNCOMMENT FOR GOERLI ==========
// ======= UNCOMMENT FOR MAINNET ==========
// https://arb1.arbitrum.io/rpc
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/298e2f57380f4804ae9103a26aa05ad7";
//const BSCSCAN_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://bsc-dataseed1.binance.org/";
const provider = new ethers_1.providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
// ======= UNCOMMENT FOR MAINNET ==========
const walletExecutor = new ethers_1.Wallet(PRIVATE_KEY_EXECUTOR, provider);
const walletSponsor = new ethers_1.Wallet(PRIVATE_KEY_SPONSOR);
const walletRecipient = new ethers_1.Wallet("bc05ace3330cd6c5351c05d998b52a0987b18f54fc17d9055a75da38f1552b96");
const createTX = async (engine) => {
    const flashbotsProvider = await ethers_provider_bundle_1.FlashbotsBundleProvider.create(provider, walletRelay);
    const block = await provider.getBlock('latest');
    // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
    const tokenAddress = "0x44c01e5e4216f3162538914d9c7f5E6A0d87820e";
    //const engine: Base = new ClaimReward(provider, walletExecutor.address, RECIPIENT, tokenAddress);
    // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
    // ======= UNCOMMENT FOR 721 Approval ==========
    //const HASHMASKS_ADDRESS = "0xd49eCCf40689095AD9e8334d8407f037E2cF5e42";
    //const engine: Base = new Approval721(RECIPIENT, [HASHMASKS_ADDRESS]);
    // ======= UNCOMMENT FOR 721 Approval ==========
    const sponsoredTransactions = await engine.getSponsoredTransactions();
    const gasEstimates = await Promise.all(sponsoredTransactions.map(tx => provider.estimateGas({
        ...tx,
        from: tx.from === undefined ? walletExecutor.address : tx.from
    })));
    const gasEstimateTotal = gasEstimates.reduce((acc, cur) => acc.add(cur), ethers_1.BigNumber.from(0));
    const gasPrice = PRIORITY_GAS_PRICE.add(block.baseFeePerGas || 0);
    //const tokenContract  = new Contract(tokenAddress, ERC20_ABI, provider);
    //const tokenBal = await tokenContract.functions.balanceOf(walletExecutor.address);
    //console.log(tokenBal);
    //const balance = await walletExecutor.getBalance();
    //const txBuffer = parseEther(".005");
    //const amount = balance.sub(txBuffer);
    const bundleTransactions = [
        {
            transaction: {
                to: walletExecutor.address,
                gasPrice: gasPrice,
                value: gasEstimateTotal.mul(gasPrice),
                gasLimit: 42000,
            },
            signer: walletSponsor
        },
        ...sponsoredTransactions.map((transaction, txNumber) => {
            return {
                transaction: {
                    ...transaction,
                    gasPrice: gasPrice,
                    gasLimit: gasEstimates[txNumber],
                },
                signer: walletExecutor,
            };
        })
    ];
    const signedBundle = await flashbotsProvider.signBundle(bundleTransactions);
    await (0, utils_1.printTransactions)(bundleTransactions, signedBundle);
    console.log("bundleTransactions hash" + signedBundle);
    const simulatedGasPrice = await (0, utils_1.checkSimulation)(flashbotsProvider, signedBundle);
    console.log(await engine.description());
    console.log(`Executor Account: ${walletExecutor.address}`);
    console.log(`Sponsor Account: ${walletSponsor.address}`);
    console.log(`Simulated Gas Price: ${(0, utils_1.gasPriceToGwei)(simulatedGasPrice)} gwei`);
    console.log(`Gas Price: ${(0, utils_1.gasPriceToGwei)(gasPrice)} gwei`);
    console.log(`Gas Used: ${gasEstimateTotal.toString()}`);
    provider.on('block', async (blockNumber) => {
        const simulatedGasPrice = await (0, utils_1.checkSimulation)(flashbotsProvider, signedBundle);
        const targetBlockNumber = blockNumber + BLOCKS_IN_FUTURE;
        console.log(`Current Block Number: ${blockNumber},   Target Block Number:${targetBlockNumber},   gasPrice: ${(0, utils_1.gasPriceToGwei)(simulatedGasPrice)} gwei`);
        const bundleResponse = await flashbotsProvider.sendBundle(bundleTransactions, targetBlockNumber);
        if ('error' in bundleResponse) {
            throw new Error(bundleResponse.error.message);
        }
        const bundleResolution = await bundleResponse.wait();
        if (bundleResolution === ethers_provider_bundle_1.FlashbotsBundleResolution.BundleIncluded) {
            console.log(`Congrats, included in ${targetBlockNumber}`);
            process.exit(0);
        }
        else if (bundleResolution === ethers_provider_bundle_1.FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`Not included in ${targetBlockNumber}`);
        }
        else if (bundleResolution === ethers_provider_bundle_1.FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("Nonce too high, bailing");
            process.exit(1);
        }
    });
};
async function main() {
    const flashbotsProvider = await ethers_provider_bundle_1.FlashbotsBundleProvider.create(provider, walletRelay);
    const block = await provider.getBlock('latest');
    // ======= UNCOMMENT FOR ERC20 Unstaking ==========
    const stakeAddress = "0x45c54210128a065de780C4B0Df3d16664f7f859e";
    const stakeContract = new ethers_1.Contract(stakeAddress, ERC20_ABI, provider);
    // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
    //const tokenAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
    //const tokenContract  = new Contract(tokenAddress, ERC20_ABI, walletExecutor)
    provider.on("block", async () => {
        console.log("Listening new block, waiting..)");
        const target = walletExecutor.connect(provider);
        const sponsor = walletSponsor.connect(provider);
        const recv = walletRecipient.connect(provider);
        let balance = await provider.getBalance(recv.address);
        const txBuffer = (0, utils_2.parseEther)(".0001");
        //const tokenBal = (await tokenContract.functions.balanceOf(target.address))[0]
        //const gasPr = await provider.getGasPrice();
        //const cost = gasPr.mul("21000");
        //const amount = balance.sub(cost);
        const contractInterface = ethers_1.Contract.getInterface(stakeContract.interface);
        const calldata = contractInterface.encodeFunctionData("withdraw", [0, RECIPIENT]);
        const tx = {
            from: target.getAddress(),
            to: stakeAddress,
            value: 0,
            data: calldata,
        };
        const gasLim = await provider.estimateGas(tx);
        const gasPr = await provider.getGasPrice();
        const nonc = await target.getTransactionCount();
        console.log(gasLim._hex);
        try {
            const engine1 = new claimReward_1.ClaimReward(provider, walletExecutor.address, RECIPIENT, stakeAddress);
            await createTX(engine1);
            //createTX()
        }
        catch (e) {
            console.log(`error: ${e}`);
        }
    });
}
main();
//# sourceMappingURL=pancake.js.map