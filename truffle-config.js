/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

 const HDWalletProvider = require('@truffle/hdwallet-provider');

 const fs = require('fs');
 var mnemonic;
 try {
   mnemonic = fs.readFileSync(".magic_words").toString().trim();
 } catch(err) {
   if (err.code === 'ENOENT') {
      console.log('File not found!');
    } else {
      throw err;
    }
 }
 // const mnemonic = process.env.MAGIC_WORDS;
 if (!mnemonic) {
   console.log("FYI NO MNEMONIC IS SET");
 }else{
   console.log(`MNEMONIC LENGTH ${mnemonic.length}`);
 }

 const ropsten_endpoint = process.env.ROPSTEN_ENDPOINT;
 if (process.env.ROPSTEN_ENDPOINT) {
   console.log(`Ropsten Endpoint ${ropsten_endpoint}`);
 }

 const mainnnet_endpoint = process.env.MAINNET_ENDPOINT;
 if (process.env.MAINNET_ENDPOINT) {
   console.log(`mainnnet Endpoint ${mainnnet_endpoint}`);
 }

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "localhost",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
     gas: 6000000,           // Gas sent with each transaction (default: ~6700000)
                                                                    // Used for full deploy 5508526
     gasPrice: 60000100000
    },
    ropsten: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonic,
        providerOrUrl: ropsten_endpoint,
        addressIndex: 4 }),
      network_id: 3,       // Ropsten's id
      gas: 6000000,        // Ropsten has a lower block limit than mainnet
      gasPrice: 70000200000,
      confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    live: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonic,
        providerOrUrl: mainnnet_endpoint,
        addressIndex: 3 }),
      network_id: 1,       // mainnet's id
      gas: 280000,        // gas used for contract
          // full mint takes this much gas 146259
      gasPrice: 55000000000,
      confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // increase timeout when running full mint test
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7",
    }
  },

};
