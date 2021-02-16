# Project used to debug OVM behavior

This project demonstrates that when calling view contract methods from certain addresses, like `address(0)`, Geth L2 node returns an error:

```
Error: call revert exception (method="totalSupply()", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.0.10)
    at Logger.makeError (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/@ethersproject/logger/lib/index.js:179:21)
    at Logger.throwError (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/@ethersproject/logger/lib/index.js:188:20)
    at Interface.decodeFunctionResult (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/@ethersproject/abi/lib/interface.js:286:23)
    at Contract.<anonymous> (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/ethers/node_modules/@ethersproject/contracts/lib/index.js:319:56)
    at step (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/ethers/node_modules/@ethersproject/contracts/lib/index.js:46:23)
    at Object.next (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/ethers/node_modules/@ethersproject/contracts/lib/index.js:27:53)
    at fulfilled (/Users/krebernisak/Documents/workspace/work/chainlink/code/ovm/optimism-tutorial/node_modules/ethers/node_modules/@ethersproject/contracts/lib/index.js:18:58)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  reason: null,
  code: 'CALL_EXCEPTION',
  method: 'totalSupply()',
  errorSignature: null,
  errorArgs: [ null ],
  address: '0xABF7A1C91436090f1aA9B8047F7D73923FC02744',
  args: [],
  transaction: {
    data: '0x18160ddd',
    to: '0xABF7A1C91436090f1aA9B8047F7D73923FC02744',
    from: '0x0000000000000000000000000000000000000000'
  }
}
```

```sh
yarn install
yarn compile
```

Confirm that everything worked as expected by running:

```sh
yarn test
```

Then reproduce the issue by starting a local L2 env and run:

```sh
node index.js local
```

Or directly on a testnet:

```sh
node index.js kovan
```
