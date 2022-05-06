const NonagonCup = artifacts.require("NonagonCup");
const fs = require('fs');

contract("NonagonCup", accounts => {

  // it("getTriangleData", async () => {
  //   const cup = await NonagonCup.deployed();
  //   var results = [];
  //   for (var i=0;i<68;i++) {
  //     console.log(`Get Triangle ${i}`);
  //     results[i] = await cup._getTriangleData(1,i);
  //   }
  //   assert.equal(1, 1, 'test not passing');
  //  });


   // it("getVertexFloatValue", async () => {
   //   const cup = await NonagonCup.deployed();
   //   let resultVals = new Array();
   //   for (let i = 0; i < 612; i++) {
   //     var v = await cup._getVertexFloatValue.call(1, i);
   //     console.log(`tokenId ${1} has vertex float value ${i}: ${v}`);
   //     resultVals.push(v);
   //   }
   //   assert.equal(1, 1, 'test not passing');
   //  });


  //  it("getProgVals", async () => {
  //    const cup = await NonagonCup.deployed();
  //    let resultVals = new Array();
  //    for (let i = 0; i < 612; i++) {
  //      var v = await cup._getProgVals.call(1, i);
  //      console.log(`tokenId ${1} has progval ${i}: ${v}`);
  //      resultVals.push(v);
  //    }
  //    assert.equal(
  //     1,
  //     1,
  //     "Test is not passing"
  //   );
  // });


  it("getHeightFloatValue", async () => {
    const cup = await NonagonCup.deployed();
    let heights = new Array(2002);
    for (let i = 0; i < 2000; i++) {
      var tokenId = i + 1;
      heights[i] = await cup.getHeightFloatValue.call(tokenId);
      console.log(`tokenId ${tokenId} has height ${heights[i]}`);
    }
    assert.equal(
     1,
     1,
     "Test is not passing"
   );
  });



});
