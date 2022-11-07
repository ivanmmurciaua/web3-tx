import Web3 from 'web3';
import 'dotenv/config'

let web3js = new Web3(new Web3.providers.HttpProvider(process.env.RPC));

async function interact(){
    let nonce = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    var contract = new web3js.eth.Contract(JSON.parse(process.env.ABI), process.env.CONTRACT_ADDRESS);
    
    const transaction = {
      from : process.env.MY_ADDRESS,
      nonce: nonce,
      maxPriorityFeePerGas: web3js.utils.toHex('2000000000'), //2 gwei
      maxFeePerGas: web3js.utils.toHex('50000000000'), //50 gwei
      gasLimit: web3js.utils.toHex(210000),
      to: process.env.CONTRACT_ADDRESS, 
      value: '0x00',
      data: contract.methods.approve("0x8f048e25fEcd0AFdE2af78d9966C010D94e76aEc", 2783556065).encodeABI(),
      type: '0x02'
    }

    console.log("Nonce de la transacción: " + nonce)

    const signedTx = await web3js.eth.accounts.signTransaction(transaction, process.env.PK);

    web3js.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error) {
        console.log("El hash de la transacción es: " + hash);
      } else {
        console.log("Error: ", error)
      }
    });
}

interact()