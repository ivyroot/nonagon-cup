const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

const NonagonCup = artifacts.require("NonagonCup");


contract("NonagonCup", accounts => {


  it("denies mint with no approval", async () => {
   const cup = await NonagonCup.deployed();
   await truffleAssert.reverts(cup.claim({from: accounts[4]}),"address not allowed");
  });

  it("mints all tokens via owner approvals, then checks that the following attempts revert. Requires -a 2200 to add enought initial accounts", async () => {

    const cup = await NonagonCup.deployed();

    var addresses = [];
    var addr;
    var bal = 0;

    for (var i=0;i<2100;i++) {
      addr = accounts[i + 3];
      // approve address to mint
      await cup.updateAllowedToMint([addr], true);

      // check address is approved
      const result = await cup.allowedToMint(addr);
      assert.equal(result, true);

      if (i < 2000) {

        // ensure account can mint token using granted request
        await cup.claim({from: addr});
        const mintedTokenId = await cup.tokenOfOwnerByIndex(addr, 0);
        console.log( `[${i}] MINTED TOKEN ${mintedTokenId}`);
        assert.equal(mintedTokenId, i + 1);

      } else {

        // ensure account cannot minut token using granted request
        await truffleAssert.reverts(cup.claim({from: addr}));
        console.log( `[${i}] REVERT ON MINT ATTEMPT ${i}`);


      }
    }
  }).timeout(300000000);


});
