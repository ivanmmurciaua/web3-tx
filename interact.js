let Web3 = require('web3');
let Tx = require('ethereumjs-tx').Transaction;
require('dotenv').config()

let web3js = new Web3(new Web3.providers.HttpProvider(process.env.RPC));

async function interact(){
    let nonce = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    let gasPrice = await web3js.eth.getGasPrice()
    const privateKey = new Buffer.from(process.env.PK, 'hex')

    var contract = new web3js.eth.Contract(JSON.parse(process.env.ABI), process.env.CONTRACT_ADDRESS);
    
    const rawTx = {
      from : process.env.MY_ADDRESS,
      nonce: nonce,
      gasPrice: web3js.utils.toHex(gasPrice), 
      gasLimit: web3js.utils.toHex(210000),
      to: process.env.CONTRACT_ADDRESS, 
      value: '0x00', 
      data: contract.methods.X().encodeABI()
    }

    console.log("Entrando a la mempool...")
    console.log("Nonce de la transacción")
    console.log(nonce)
    
    let tx = new Tx(rawTx, {'chain' : process.env.CHAIN});
    tx.sign(privateKey);
    
    const serializedTx = tx.serialize();
    
    web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', console.log);
}

interact()