const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

const NonagonCup = artifacts.require("NonagonCup");


contract("NonagonCup", accounts => {


  it("denies mint with no approval when gate is closed", async () => {
   const cup = await NonagonCup.deployed();
   await truffleAssert.reverts(cup.claim({from: accounts[4]}),"address not allowed");
  });

  it("allows mint with no approval when gate is open", async () => {
   const cup = await NonagonCup.deployed();
   var open = await cup.setMintApprovalRequired(false);
   var t = await cup.claim({from: accounts[4]});
   var count = await cup.balanceOf(accounts[4]);
   assert.equal(count, 1);
   var open = await cup.setMintApprovalRequired(true);
  });

  it("opens and closes gate testing in between. Requires -a 32 to add enought initial accounts", async () => {

    const cup = await NonagonCup.deployed();

    var addresses = [];
    var addr;
    var bal = 0;

    for (var i=0;i<10;i++) {
      addr = accounts[i + 1];

      const result = await cup.allowedToMint(addr);
      assert.equal(result, false);

      await truffleAssert.reverts(cup.claim({from: addr}));

      var count = await cup.balanceOf(addr);
      if (i != 3) {
        assert.equal(count, 0);
      }
    }

    var open = await cup.setMintApprovalRequired(false);

    for (var i=10;i<20;i++) {
      addr = accounts[i + 1];

      const result = await cup.allowedToMint(addr);
      assert.equal(result, false);

      var t = await cup.claim({from: addr});

      var count = await cup.balanceOf(addr);
      assert.equal(count, 1);
    }

    var open = await cup.setMintApprovalRequired(true);

    for (var i=20;i<30;i++) {
      addr = accounts[i + 1];

      const result = await cup.allowedToMint(addr);
      assert.equal(result, false);

      await truffleAssert.reverts(cup.claim({from: addr}));

      var count = await cup.balanceOf(addr);
      assert.equal(count, 0);
    }

    var grantTo = new Array()
    for (var i=20; i<30; i++) {
      grantTo.push(accounts[i + 1]);
    }

    var t = await cup.updateAllowedToMint(grantTo, true);

    for (var i=20;i<30;i++) {
      addr = accounts[i + 1];

      const result = await cup.allowedToMint(addr);
      assert.equal(result, true);

      var t = await cup.claim({from: addr});

      var count = await cup.balanceOf(addr);
      assert.equal(count, 1);
    }


  }).timeout(300000000);


});
