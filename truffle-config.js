require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = process.env.MNEMONIC;
const infuraProjectId = process.env.INFURA_PROJECT_ID;


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },

    privateGanache: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'http://127.0.0.1:8545/');
      },
      network_id: "*"
    },

    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraProjectId}`),
      network_id: 1, // mainnet's id
      gasPrice: 14000000000 // 14 gwei
    },

    // Useful for deploying to a public network.
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraProjectId}`),
      networkCheckTimeout: 1000000000,
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
