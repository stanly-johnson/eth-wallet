const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const ethTx = require('ethereumjs-tx')
var Web3 = require('web3')
const web3 = new Web3(
   new Web3.providers.HttpProvider("https://rinkeby.infura.io/yGEHQFbey55ozzDha3hf")
);

const mnemonic = bip39.generateMnemonic(); //generates string
//const mnemonic = "hold warrior physical fun excuse resource capable scissors pyramid hip jungle minor";

console.log("Mnemonic:",mnemonic);

const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
//console.log(seed.toString('hex'));

const root = hdkey.fromMasterSeed(seed)

const masterPrivateKey = root.privateKey.toString('hex');
//console.log("Master private Key:",masterPrivateKey);

const masterPubKey = root.publicKey.toString('hex');
//console.log("Master Public Key: ",masterPubKey);

var path = "m/44'/60'/0'/0/0";

const addrNode = root.derive(path)
console.log("privatekey",addrNode._privateKey.toString('hex'));
const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
const addr = ethUtil.publicToAddress(pubKey).toString('hex');
console.log("Address:",addr);

const rawTransaction = {
  nonce:0x6,
  to: '0x4584159875418ef77D1142bEec0b6648BD8eDb2f',
  value: '0x00',
  gasPrice: "0x09184e72a000",
  gasLimit: "0x9C40",
  chainId: 4
}

var transaction = new ethTx(rawTransaction);
transaction.sign(addrNode._privateKey);
const serializedTx = transaction.serialize()

web3.eth.sendRawTransaction(
   `0x${serializedTx.toString('hex')}`,
   (error, result) => {
      if (error) { console.log(`Error: ${error}`); }
      else { console.log(`Result: ${result}`); }
   }
);
