link = {
  web3Provider: null,

  init: function() {
    link.web3Provider = new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/yGEHQFbey55ozzDha3hf"
    );
    //link.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/dXG7QYJRJPW16SDWx2EM');
    web3 = new Web3(link.web3Provider);
    return link.bindEvents();
  },

  bindEvents: function() {
    $(document).on("click", "#newWallet", link.createwallet);
    $(document).on("click", "#impkey", link.importkeystore);
    $(document).on("click", "#imppriv", link.importprivatekey);
    $(document).on("click", "#balance", link.checkBalance);
    $(document).on("click", "#sendeth", link.sendeth);
  },

  Download: function(storageObj, address) {
    var x = new Date();
    var UTCseconds = (x.getTime() + x.getTimezoneOffset() * 60 * 1000) / 1000;
    var name = "Keystore - " + address + " - " + new Date().toUTCString();

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(storageObj)
    );
    element.setAttribute("download", name);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  },

  createwallet: function(event) {
    event.preventDefault();

    var extraEntropy = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var password = document.getElementById("userpass").value;

    for (var i = 0; i < 5; i++)
      extraEntropy += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );

    var result = web3.eth.accounts.create(extraEntropy);

    console.log(result.address);
    console.log(result.privateKey);
    var keystore = JSON.stringify(
      web3.eth.accounts.encrypt(result.privateKey, password)
    );
    var param = {
      keystore: keystore
    };

    /*  $.ajax({
        type :"POST",
        url : 'api_url',
        data : param
        dataType: "application/json"
        success: function(response){
        console.log(response);
        }
      });

      */
    link.Download(keystore, result.address);
  },

  importkeystore: function(event) {
    event.preventDefault();

    var file = document.getElementById("key").files[0];
    var password = document.getElementById("impuserpass").value;
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function(evt) {
        var result = web3.eth.accounts.decrypt(evt.target.result, password);

        console.log(result.address);
        console.log(result.privateKey);
        var keystore = JSON.stringify(
          web3.eth.accounts.encrypt(result.privateKey, password)
        );
        var param = {
          keystore: keystore
        };
        /*  $.ajax({
          type :"POST",
          url : 'api_url',
          data : param
          dataType: "application/json"
          success: function(response){
          console.log(response);
          }
        });

        */
      };
      reader.onerror = function(evt) {
        alert("Error reading keystore file");
      };
    }
  },

  importprivatekey: function(event) {
    event.preventDefault();

    var privatekey = document.getElementById("priv").value;
    var password = document.getElementById("privuserpass").value;
    if (!privatekey || !password) {
      return;
    }
    var result = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);

    console.log(result.address);
    console.log(result.privateKey);
    var keystore = JSON.stringify(
      web3.eth.accounts.encrypt(result.privateKey, password)
    );
    var param = {
      keystore: keystore
    };
    /*  $.ajax({
  type :"POST",
  url : 'api_url',
  data : param
  dataType: "application/json"
  success: function(response){
  console.log(response);
  }
});

*/
  },
  checkBalance: function(event) {
    event.preventDefault();
    var address = document.getElementById("balanceAddress").value;
    if (!address) {
      console.log("No address found");
      return;
    }
    console.log(web3.eth.getBalance(address));
  },

  sendeth: function(event) {
    event.preventDefault();
    var sender = web3.eth.accounts.privateKeyToAccount('0x37c79248c87d1da9018998a9b84526174e8e3562353501345e4ffe71716fd082');
    var recipent = document.getElementById("recipentAddress").value;
    var recipentAmount = document.getElementById("recipentAmount").value;

    const rawTransaction = {
      "to": recipent,
      "value": web3.utils.toHex(web3.utils.toWei(recipentAmount, "ether")),
      "gasPrice": '0x09184e72a000',
      "gasLimit": '0x9C40',
      "chainId": 4
    };

    console.log(sender.address);
    console.log(web3.eth.getBalance(sender.address));
    web3.eth.accounts.signTransaction(rawTransaction, sender.privateKey)
    .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    .then(receipt => console.log("Transaction receipt: ", receipt))
    .catch(err => console.error(err));
  }
};

$(function() {
  $(window).load(function() {
    link.init();
  });
});
