const Web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');
const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const app = express();

//Infura HttpProvider Endpoint
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/yGEHQFbey55ozzDha3hf"));

app.get('/sendtx',function(req,res){

  const mnemonic = bip39.generateMnemonic(); //generates string
  console.log("Mnemonic:",mnemonic);

  const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer

  const root = hdkey.fromMasterSeed(seed)

  const masterPrivateKey = root.privateKey.toString('hex');
  console.log("Master private Key:",masterPrivateKey);

  const masterPubKey = root.publicKey.toString('hex');
  console.log("Master Public Key: ",masterPubKey);

  var path = "m/44'/60'/0'/0/0";

  const addrNode = root.derive(path)
  console.log("path: ", path);

  const pubKey = ethUtil.privateToPublic(addrNode._privateKey)
  console.log("Pubkey as hex:",pubKey.toString('hex'));

  const addr = ethUtil.publicToAddress(pubKey).toString('hex');
  console.log("pubkey to Addr:",addr);

  const PrivBuffKey = Buffer.from(masterPrivateKey, 'hex')
  const rawTransaction = {
    nonce:0x6,
    to: '0x4584159875418ef77D1142bEec0b6648BD8eDb2f',
    value: '0x00',
    gasPrice: 0x09184e72a000,
    gasLimit: 0x30000,
    chainId: 4
  }

  var transaction = new Tx(rawTransaction);
  transaction.sign(addrNode._privateKey);
  const serializedTx = transaction.serialize()

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
  .on('receipt', console.log);
    });
app.listen(3000, () => console.log('Example app listening on port 3000!'))
