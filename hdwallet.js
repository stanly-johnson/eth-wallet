const bip39 = require('bip39')
const hdkey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const ethTx = require('ethereumjs-tx')
var Web3 = require('web3');

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

const address = ethUtil.toChecksumAddress(addr)
console.log("Address with Check sum:",address);
