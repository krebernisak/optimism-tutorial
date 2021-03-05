const { assert } = require("chai");
const { networks, deploy, reason } = require("./utils.js");
const { ethers, ContractFactory } = require("ethers");
const ERC20ABI = require("./artifacts/contracts/ERC20.sol/ERC20.ovm.json");

const main = async () => {
  const key =
    "0xa35617f4fe630bf50024fcbe2c051d2dffe5ea19695b2d660ce4db7a5acdcc30";
  const networkArg = process.argv.slice(2)[0] || "local";

  const { url, id, gasPrice } = networks[networkArg];
  console.log("Deploying to: ", networks[networkArg]);
  const provider = new ethers.providers.JsonRpcProvider(url, id);
  const wallet = new ethers.Wallet(key, provider);

  const options = { gasPrice: gasPrice || 0, gasLimit: 8999999 };

  const factory = new ContractFactory(ERC20ABI.abi, ERC20ABI.bytecode, wallet);
  const contract = await deploy(factory, []);

  // Init ERC20 contract
  const payload = ["1000", "TOK", options];
  const initTx = await contract.init(...payload);
  await initTx.wait();

  const _readTotalSupply = async (addr) => {
    console.log();
    try {
      const supply = await contract.connect(addr).totalSupply();
      console.log(`SUCCESS for ${addr}, totalSupply: ${supply}`);
    } catch (err) {
      console.error(`ERROR for ${addr}`);
      console.error(err);
    }
  };

  // SUCCESSES (testing reading from)
  await _readTotalSupply(ethers.constants.AddressZero);
  await _readTotalSupply("0x0000000000000000000000000000000000000001");
  await _readTotalSupply("0x0000000000000000000000000000000000000069");
  await _readTotalSupply("0x0000000000000000000000000000000000000420");
  await _readTotalSupply("0x0000000000000000000000000000000000001337");
  await _readTotalSupply("0x000000000000000000000000000000000000ffff");
  await _readTotalSupply("0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000");
  await _readTotalSupply("0xdeaddeaddeaddeaddeaddeaddeaddeaddeadffff");
  await _readTotalSupply("0x0000000000000000000000000000000000010000");
  await _readTotalSupply("0x000000000000000000000000000000000001ffff");
  await _readTotalSupply("0x1000000000000000000000000000000000000000");

  // WRITE ERROR
  console.log("\nTesting WRITE ERROR reason\n");
  try {
    const to = "0x0000000000000000000000000000000000000000";
    const tx = await contract.transfer(to, "1001");
    await tx.wait();
  } catch (err) {
    console.log(err.message);
    const txHash = err.transaction.hash;
    const revertMsg = await reason(txHash, wallet.provider);
    const expectedRevertMsg =
      "You don't have enough balance to make this transfer";
    assert(revertMsg.includes(expectedRevertMsg));
    console.log("WRITE ERROR reason: " + revertMsg);
  }

  // READ ERROR -> reason is null
  console.log("\nTesting READ ERROR reason\n");
  try {
    await await contract.testRequire();
  } catch (err) {
    console.log(err);
    console.log("READ ERROR reason: " + err.reason);
    assert(!!err.reason, `Reason is ${err.reason}!`);
  }
};

main().catch((e) => console.error(e));
