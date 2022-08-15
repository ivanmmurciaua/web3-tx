// Imports
import Web3 from 'web3';
import {default as common, Hardfork } from '@ethereumjs/common'
import pkg from '@ethereumjs/tx';
import 'dotenv/config'

// Configuración
const { FeeMarketEIP1559Transaction } = pkg;
const Common = common.default
let web3js = new Web3(new Web3.providers.HttpProvider(process.env.RPC));

// Función para interactuar con el contrato
async function interact(){

    // Nonce actual de tu wallet
    let nonce = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    
    // Precio del gas actual en la red configurada
    let gasPrice = await web3js.eth.getGasPrice()

    // Clave privada
    const privateKey = new Buffer.from(process.env.PK, 'hex')

    // Construcción del contrato
    var contract = new web3js.eth.Contract(JSON.parse(process.env.ABI), process.env.CONTRACT_ADDRESS);
    
    // Configuración de la Transacción
    const common = new Common({ chain: parseInt(process.env.CHAIN_ID), hardfork: Hardfork.London })
    
    // Transacción
    const txData = {
      from : process.env.MY_ADDRESS,
      nonce: nonce,
      gasPrice: web3js.utils.toHex(gasPrice),
      maxPriorityFeePerGas: web3js.utils.toHex('2000000000'), //2 gwei
      maxFeePerGas: web3js.utils.toHex('50000000000'), //50 gwei
      gasLimit: web3js.utils.toHex(210000),
      to: process.env.CONTRACT_ADDRESS, 
      value: '0x00',
      // CAMBIAR EL METODO EN ESTA LINEA
      data: contract.methods.X().encodeABI(),
      type: '0x02'
    }

    console.log("Entrando a la mempool...")
    console.log("Nonce de la transacción: " + nonce)

    // Construcción de la Transacción
    const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(privateKey);
    var serializedTx = signedTx.serialize();

    // Resolución de la transacción
    await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .once('transactionHash', function(hash){ console.log("Hash de la Transacción", hash) })
    .once('receipt', function(receipt){ console.log("Recepción", receipt) })
    .on('error', function(error){ console.log("Error", error) })
    .then(function(receipt){
        console.log("Transacción minada!", receipt);
  });
}

interact()