var Tx = require("ethereumjs-tx");
const Web3 = require("web3");

const system_provider =
  "https://rinkeby.infura.io/v3/78bf7bf684434eff9eb7604d50c80ae1";
const web3 = new Web3(system_provider);

const system_address = "0x2dF318e9E6d337795F281782873A130EbeE6Aa55";
const system_private_key = Buffer.from(
  "90E6C08ABC29B69C3063090A78163458E05ED0FF16D0FC4E20457F18F112CB7C",
  "hex"
);

const publisher_address = "0x0F841E2b6909F5370a42Cc6759bB4caE6D3678F7";
const publisher_private_key = Buffer.from(
  "EB7376A5ADB4C3EEBBE790CADE0F62E92085C1952B9DA58B0CB05ADB6E834AF7",
  "hex"
);

//Printing Before transaction

web3.eth.getBalance(system_address, (err, bal) => {
  console.log(
    "BEFORE SYSTEM ACCOUNT BALANCE : ",
    web3.utils.fromWei(bal, "ether")
  );
});

web3.eth.getBalance(publisher_address, (err, bal) => {
  console.log(
    "BEFORE PUBLISHER ACCOUNT BALANCE : ",
    web3.utils.fromWei(bal, "ether")
  );
});

//Making a transaction
web3.eth.getTransactionCount(system_address, (err, txCount) => {
  console.log("MAKING TRANSACTION");
  //Building transaction
  const TxObject = {
    nonce: web3.utils.toHex(txCount),
    to: publisher_address,
    value: web3.utils.toHex(web3.utils.toWei("2", "ether")),
    gasLimit: web3.utils.toHex(210000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei"))
  };

  //sign a transaction
  const tx = new Tx(TxObject);
  tx.sign(system_private_key);

  const serializedTransaction = tx.serialize();
  const rawTx = "0x" + serializedTransaction.toString("hex");

  // Broadcast transaction
  web3.eth.sendSignedTransaction(rawTx, (err, txHash) => {
    console.log("Transaction Hash : ", txHash);
  });
});

//Printing After transaction
web3.eth.getBalance(system_address, (err, bal) => {
  console.log(
    "AFTER SYSTEM ACCOUNT BALANCE : ",
    web3.utils.fromWei(bal, "ether")
  );
});

web3.eth.getBalance(publisher_address, (err, bal) => {
  console.log(
    "AFTER PUBLISHER ACCOUNT BALANCE : ",
    web3.utils.fromWei(bal, "ether")
  );
});
