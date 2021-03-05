const { ethers, ContractFactory } = require("ethers");
const { networks, deploy } = require("./utils.js");
const ERC20ABI = require("./artifacts/contracts/ERC20.sol/ERC20.ovm.json");
const UpgradeableProxyABI = require("./artifacts/contracts/release-v3.4/proxy/UpgradeableProxy.sol/UpgradeableProxy.ovm.json");

const main = async () => {
  const key =
    "0xa35617f4fe630bf50024fcbe2c051d2dffe5ea19695b2d660ce4db7a5acdcc30";
  const networkArg = process.argv.slice(2)[0] || "local";

  const { url, id, gasPrice } = networks[networkArg];
  console.log("Deploying to: ", networks[networkArg]);
  const provider = new ethers.providers.JsonRpcProvider(url, id);
  const wallet = new ethers.Wallet(key, provider);

  const options = { gasPrice: gasPrice || 0, gasLimit: 8999999 };

  const implFactory = new ContractFactory(
    ERC20ABI.abi,
    ERC20ABI.bytecode,
    wallet
  );
  const impl = await deploy(implFactory, []);

  const proxyFactory = new ContractFactory(
    [...ERC20ABI.abi, ...UpgradeableProxyABI.abi],
    UpgradeableProxyABI.bytecode,
    wallet
  );
  const contract = await deploy(proxyFactory, [impl.address, Buffer.from("")]);

  // Init ERC20 contract
  const payload = ["1000", "TOK", options];
  const initTx = await contract.init(...payload);
  await initTx.wait();

  const _transfer = async (to, amount) => {
    const transferTx = await contract.transfer(to, amount);
    await transferTx.wait();
  };

  // Make 2x Transfer
  const to = "0x0000000000000000000000000000000000000000";
  await _transfer(to, "1");
  await _transfer(to, "1");

  const _queryFilterTransfer = async (queryContract, filterContract) => {
    // Get the filter
    const filter = filterContract.filters.Transfer(null, null, null);
    // Query the filter
    return await queryContract.queryFilter(filter, 0, "latest");
  };

  // Test 1
  const logs1 = await _queryFilterTransfer(impl, impl);
  console.log(`Query{impl}  + Filter{impl}:  Expecting 0, got ${logs1.length}`);

  // Test 2
  const logs2 = await _queryFilterTransfer(impl, contract);
  console.log(`Query{impl}  + Filter{proxy}: Expecting 0, got ${logs2.length}`);

  // Test 3
  const logs3 = await _queryFilterTransfer(contract, impl);
  console.log(`Query{proxy} + Filter{impl}:  Expecting 2, got ${logs3.length}`);

  // Test 4
  const logs4 = await _queryFilterTransfer(contract, contract);
  console.log(`Query{proxy} + Filter{proxy}: Expecting 2, got ${logs4.length}`);
};

main().catch((e) => console.error(e));
