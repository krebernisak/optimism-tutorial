# Project used to debug OVM behavior

```sh
yarn install
yarn compile
```

Confirm that everything worked as expected by running:

```sh
yarn test
```

## test-revert-reason.js

This project demonstrates that when calling view contract methods that revert, Geth L2 node returns an EMPTY error (no reason/body available):

```
Error: call revert exception (method="testRequire()", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.0.10)
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
  method: 'testRequire()',
  errorSignature: null,
  errorArgs: [ null ],
  address: '0x6dAe38FDddF83f30dD14584002c65cF6a04489Be',
  args: [],
  transaction: {
    data: '0x357815c4',
    to: '0x6dAe38FDddF83f30dD14584002c65cF6a04489Be',
    from: '0x640e7cc27b750144ED08bA09515F3416A988B6a3'
  }
}
```

Reproduce the issue by starting a local L2 env and run:

```sh
node test-revert-reason.js local
```

Or directly on a testnet:

```sh
node test-revert-reason.js kovan
```

## test-proxy-events.js

This project demonstrates that when reading events from proxy contracts Geth L2 behaves differently than Geth L1 node.

Testing ERC20 proxy on EVM:

```
Query{impl}  + Filter{impl}:  Expecting 0, got 0
Query{impl}  + Filter{proxy}: Expecting 0, got 0
Query{proxy} + Filter{impl}:  Expecting 2, got 2
Query{proxy} + Filter{proxy}: Expecting 2, got 2
```

Testing ERC20 proxy on OVM:

```
Query{impl}  + Filter{impl}:  Expecting 0, got 2
Query{impl}  + Filter{proxy}: Expecting 0, got 2
Query{proxy} + Filter{impl}:  Expecting 2, got 0
Query{proxy} + Filter{proxy}: Expecting 2, got 0
```

Reproduce the issue by starting a local L2 env and run:

```sh
node test-proxy-events.js local
```

Or directly on a testnet:

```sh
node test-proxy-events.js kovan
```
