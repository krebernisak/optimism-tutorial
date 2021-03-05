const { assert } = require("chai");

const finishAndCheckDeploy = async (tx, provider) => {
  const txHash = tx.deployTransaction.hash;
  console.log("Deployed in transaction:", txHash);
  console.log("Will live at address:", tx.address);

  const contract = await tx.deployed();
  console.log("Contract now live at: ", contract.address);

  const txReceipt = await provider.getTransactionReceipt(txHash);
  console.log("Receipt: ", txReceipt);

  // Check if code is stored
  console.log("\nTESTING: code\n--------");
  const code = await provider.getCode(contract.address);
  console.log("Code: ", code);
  assert(code.length > 2, "Contract NOT deployed (no code)");

  return contract;
};

const deploy = async (factory, payload) => {
  console.log("Deploying with: ", payload);
  const tx = await factory.deploy(...payload);
  return await finishAndCheckDeploy(
    tx,
    factory.provider || factory.signer.provider
  );
};

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

async function reason(hash, provider) {
  console.log("tx hash:", hash);

  let tx = await provider.getTransaction(hash);
  if (!tx) throw Error("tx not found");

  let code = await provider.call(tx, tx.blockNumber);
  console.log(code);
  return hex_to_ascii(code.substr(138));
}

const networks = {
  local: { url: "http://localhost:8545/", id: 420 },
  local_evm: { url: "http://localhost:8545/", id: 1337 },
  goerli: { url: "https://goerli.optimism.io/", id: 420 },
  kovan: { url: "https://kovan.optimism.io", id: 69 },
  mainnet: { url: "https://mainnet.optimism.io", id: 10 },
};

module.exports = { networks, deploy, reason };
