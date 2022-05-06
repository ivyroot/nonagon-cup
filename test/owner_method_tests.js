const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

const NonagonCup = artifacts.require("NonagonCup");


contract("NonagonCup", accounts => {

  it("denies setting gate from non owner", async () => {
   const cup = await NonagonCup.deployed();
   await truffleAssert.reverts(cup.setMintApprovalRequired(false, {from: accounts[4]}));
  });

  it("denies withdrawal from non owner", async () => {
   const cup = await NonagonCup.deployed();

   await web3.eth.sendTransaction({to: cup.address, from: accounts[5], value: web3.utils.toWei("0.05", "ether")});

   await truffleAssert.reverts(cup.withdrawFunds(1000, {from: accounts[4]}));
  });

  it("allows withdrawal by owner ", async () => {

    const cup = await NonagonCup.deployed();

    // another account sends eth to the contract
    var initialBalance = await web3.eth.getBalance(accounts[0]);
    var iBal = new BN(initialBalance);
    var sendAmount = new BN(web3.utils.toWei("0.05", "ether"))
    await web3.eth.sendTransaction({to: cup.address, from: accounts[5], value: sendAmount});

    // admin withdraws eth
    await cup.withdrawFunds(sendAmount)
    var endBalance = await web3.eth.getBalance(accounts[0]);
    var endBal = new BN(endBalance);

    // gas used for withdrawal makes balance difference less than amount given
    assert(endBal.gt(iBal));
  });

  it("denies airdrop from non owner", async () => {
   const cup = await NonagonCup.deployed();
   await truffleAssert.reverts(cup.mintFullRide(accounts[5], {from: accounts[4]}));
   var count = await cup.balanceOf(accounts[5]);
   assert.equal(count, 0);
  });

  it("owner can airdop a mint to any address", async() => {
    const cup = await NonagonCup.deployed();
    await cup.mintFullRide(accounts[6]);
    var count = await cup.balanceOf(accounts[6]);
    assert.equal(count, 1);
  });

});
