import { BrowserProvider, ethers } from 'ethers';
import axios from 'axios';
import { CHAIN_URL, CHAIN_RPC_URL } from "../../constant";
const JSONBigInt = require('json-bigint');

const contractAbi = [
  // ToDo
];

const contractAddress = "0xYourEthereumContractAddress";

const chain_api = async () => {
  const provider = new ethers.JsonRpcProvider(CHAIN_URL);
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  return contract;
};

const ethereum_wallet_injector = async () => {
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return signer;
};

const swapTokens = async (intactWalletAddress, amountIn, path, recipient) => {
  const signer = await ethereum_wallet_injector();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  const tx = await contract.swapExactTokensForTokens(
    ethers.parseUnits(amountIn.toString(), 18),
    0, 
    path,
    recipient,
    Math.floor(Date.now() / 1000) + 60 * 20 
  );  

  console.log(`Transacción enviada: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Transacción confirmada en el bloque: ${receipt.blockNumber}`);
};

const ethereum_getAmountOutPrice = async (tokenNumber, poolA, poolB) => {
  const contract = await chain_api();
  const result = await contract.getAmountOutPrice(
    BigInt(tokenNumber),
    [BigInt(poolA), BigInt(poolB)]
  );
  return ethers.parseUnits(result, 18);
};

const ethereum_EstimateOutToken = async (inputNumber, tokenA, tokenB) => {
  const contract = await chain_api();
  const result = await contract.getEstimateOutToken(
    BigInt(inputNumber),
    BigInt(tokenA),
    BigInt(tokenB)
  );
  return ethers.parseUnits(result, 18);
};

const ethereum_getEstimateLpToken = async (tokenA, amountA, tokenB, amountB) => {
  const contract = await chain_api();
  const result = await contract.getEstimateLpToken(
    BigInt(tokenA),
    BigInt(amountA),
    BigInt(tokenB),
    BigInt(amountB)
  );
  return ethers.parseUnits(result, 18);
};

const cropData = (value, decimals) => {
  const bigIntValue = BigInt(value);
  const formattedValue = ethers.formatUnits(bigIntValue, decimals);
  return parseFloat(formattedValue).toFixed(decimals);
};


export {
  chain_api,
  ethereum_wallet_injector,
  swapTokens,
  ethereum_getAmountOutPrice,
  ethereum_EstimateOutToken,
  ethereum_getEstimateLpToken,
};
