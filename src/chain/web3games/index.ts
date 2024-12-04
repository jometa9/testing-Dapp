import { BrowserProvider, ethers } from 'ethers';
import axios from 'axios';
import { CHAIN_URL, CHAIN_RPC_URL } from "../../constant";
const JSONBigInt = require('json-bigint');

// ABI del contrato en Ethereum
const contractAbi = [
  // Añade el ABI de tu contrato Ethereum aquí
];

// Dirección del contrato en Ethereum
const contractAddress = "0xYourEthereumContractAddress";

// Conexión al nodo de Ethereum
const chain_api = async () => {
  const provider = new ethers.JsonRpcProvider(CHAIN_URL);
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  return contract; // Devuelve la instancia del contrato
};

// Gestión de cuentas y firma
const ethereum_wallet_injector = async () => {
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Solicitar acceso a la cuenta
  const signer = provider.getSigner(); // Obtener el signer conectado
  return signer;
};

// Intercambiar tokens usando el contrato Ethereum
const swapTokens = async (intactWalletAddress, amountIn, path, recipient) => {
  const signer = await ethereum_wallet_injector(); // Obtiene el signer
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  // Llama a la función de intercambio (suponiendo un método `swapExactTokensForTokens` en el contrato)
  const tx = await contract.swapExactTokensForTokens(
    ethers.parseUnits(amountIn.toString(), 18), // Cantidad de entrada
    0, // Cantidad mínima de salida (ajusta según sea necesario)
    path, // Ruta de tokens (IDs o direcciones)
    recipient, // Dirección del receptor
    Math.floor(Date.now() / 1000) + 60 * 20 // Fecha límite (20 minutos)
  );  

  console.log(`Transacción enviada: ${tx.hash}`);
  const receipt = await tx.wait(); // Espera la confirmación
  console.log(`Transacción confirmada en el bloque: ${receipt.blockNumber}`);
};

// Obtener precio de salida estimado
const ethereum_getAmountOutPrice = async (tokenNumber, poolA, poolB) => {
  const contract = await chain_api(); // Conectar al contrato
  const result = await contract.getAmountOutPrice(
    BigInt(tokenNumber),
    [BigInt(poolA), BigInt(poolB)]
  );
  return ethers.parseUnits(result, 18); // Devuelve el resultado formateado
};

// Obtener token de salida estimado
const ethereum_EstimateOutToken = async (inputNumber, tokenA, tokenB) => {
  const contract = await chain_api();
  const result = await contract.getEstimateOutToken(
    BigInt(inputNumber),
    BigInt(tokenA),
    BigInt(tokenB)
  );
  return ethers.parseUnits(result, 18);
};

// Obtener tokens LP estimados
const ethereum_getEstimateLpToken = async (tokenA, amountA, tokenB, amountB) => {
  const contract = await chain_api();
  const result = await contract.getEstimateLpToken(
    BigInt(tokenA),
    BigInt(amountA),
    BigInt(tokenB),
    BigInt(amountB)
  );
  return ethers.parseUnits(result, 18); // Convierte el valor al formato decimal
};

// Cropping data helper
const cropData = (value, decimals) => {
  // Asegurarse de que 'value' sea de tipo 'bigint'
  const bigIntValue = BigInt(value);
  // Formatear el valor utilizando 'formatUnits' directamente desde 'ethers'
  const formattedValue = ethers.formatUnits(bigIntValue, decimals);
  // Convertir el valor formateado a número de punto flotante y fijar los decimales
  return parseFloat(formattedValue).toFixed(decimals);
};


// Exportar funciones
export {
  chain_api,
  ethereum_wallet_injector,
  swapTokens,
  ethereum_getAmountOutPrice,
  ethereum_EstimateOutToken,
  ethereum_getEstimateLpToken,
};
