const { ethers, ContractFactory } = require("ethers");
const ERC20ABI = require("./artifacts/contracts/ERC20.sol/ERC20.ovm.json");

const main = async () => {
  const key =
    "0xea8b000efb33c49d819e8d6452f681eed55cdf7de47d655887fc0e318906f2e7";
  const networkArg = process.argv.slice(2)[0] || "local";

  const networks = {
    local: { url: "http://localhost:8545/", id: 420 },
    goerli: { url: "https://goerli.optimism.io/", id: 420 },
    kovan: { url: "https://kovan.optimism.io", id: 69 },
  };

  const { url, id, gasPrice } = networks[networkArg];
  console.log("Deploying to: ", networks[networkArg]);
  const provider = new ethers.providers.JsonRpcProvider(url, id);
  const wallet = new ethers.Wallet(key, provider);

  const options = { gasPrice: gasPrice || 0, gasLimit: 8999999 };

  const _finishAndCheckDeploy = async (tx) => {
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

    return contract;
  };

  const _deploy = async (factory, payload) => {
    console.log("Deploying with: ", payload);
    const tx = await factory.deploy(...payload);
    return await _finishAndCheckDeploy(tx);
  };

  const factory = new ContractFactory(ERC20ABI.abi, ERC20ABI.bytecode, wallet);
  const payload = ["1000", "TOK", options];
  const contract = await _deploy(factory, payload);

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

  // ERRORS
  await _readTotalSupply(ethers.constants.AddressZero);
  await _readTotalSupply("0x0000000000000000000000000000000000000001");
  await _readTotalSupply("0x0000000000000000000000000000000000000069");
  await _readTotalSupply("0x0000000000000000000000000000000000000420");
  await _readTotalSupply("0x0000000000000000000000000000000000001337");
  await _readTotalSupply("0x000000000000000000000000000000000000ffff");
  await _readTotalSupply("0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000");
  await _readTotalSupply("0xdeaddeaddeaddeaddeaddeaddeaddeaddeadffff");

  // SUCCESSES
  await _readTotalSupply("0x0000000000000000000000000000000000010000");
  await _readTotalSupply("0x000000000000000000000000000000000001ffff");
  await _readTotalSupply("0x1000000000000000000000000000000000000000");
};

main().catch((e) => console.error(e));
