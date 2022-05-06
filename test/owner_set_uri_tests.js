const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

const NonagonCup = artifacts.require("NonagonCup");


contract("NonagonCup", accounts => {

  it("tokenURI defaults to baseURI", async () => {
   const cup = await NonagonCup.deployed();
   await cup.updateAllowedToMint([accounts[2]], true);
   await cup.claim({from: accounts[2]});
   const tokenId = await cup.tokenOfOwnerByIndex(accounts[2], 0);
   assert.equal(1, tokenId);
   var currURI = await cup.tokenURI(tokenId);
   assert.equal(`https://nonagoncup.com/tokenId/1`, currURI);
  });

  it("non-owner cannot set tokenURI", async () => {
   const cup = await NonagonCup.deployed();
   await cup.updateAllowedToMint([accounts[3]], true);
   await cup.claim({from: accounts[3]});
   const tokenId = await cup.tokenOfOwnerByIndex(accounts[3], 0);
   assert.equal(2, tokenId);
   await truffleAssert.reverts(cup.ownerSetTokenURI(tokenId, 'yayaya', {from: accounts[0]}));
   await truffleAssert.reverts(cup.ownerSetTokenURI(tokenId, 'heehee', {from: accounts[1]}));
   await truffleAssert.reverts(cup.ownerSetTokenURI(tokenId, 'hoohoo', {from: accounts[2]}));
   var currURI = await cup.tokenURI(tokenId);
   assert.equal(`https://nonagoncup.com/tokenId/2`, currURI);
  });

  it("owner can set and clear tokenURI", async () => {
   const cup = await NonagonCup.deployed();
   await cup.updateAllowedToMint([accounts[4]], true);
   await cup.claim({from: accounts[4]});
   const tokenId = await cup.tokenOfOwnerByIndex(accounts[4], 0);
   assert.equal(3, tokenId);
   await cup.ownerSetTokenURI(tokenId, 'https://example.com/tokenUris/33.json', {from: accounts[4]});
   var currURI = await cup.tokenURI(tokenId);
   assert.equal('https://example.com/tokenUris/33.json', currURI);
   await cup.ownerSetTokenURI(tokenId, '', {from: accounts[4]});
   var currURI = await cup.tokenURI(tokenId);
   assert.equal(`https://nonagoncup.com/tokenId/3`, currURI);
  });

});
