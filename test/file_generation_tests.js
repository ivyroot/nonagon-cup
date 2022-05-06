const NonagonCup = artifacts.require("NonagonCup");
const fs = require('fs');

contract("NonagonCup", accounts => {

  it("get all filenames", async () => {
    const cup = await NonagonCup.deployed();
    for (var i=0; i < 2000; i++) {
      var tokenId = i + 1;
      var filename = await cup.getFilename(tokenId);
      console.log(`Filename for token ${tokenId} = ${filename}`);
    }
   });

   it("get all filechunks and write full files to /tmp", async() => {
     const cup = await NonagonCup.deployed();
     var tokenIds = [];
     if (process.env.ALL_TOKENS == 'true') {
       console.log("Generating files for ALL TOKENS");
       for (var tokenId=1; tokenId < 2001; tokenId++) {
         tokenIds.push(tokenId);
       }
     }else{
       tokenIds = [1,459,460,1143,1144,2000];
     }

     for (var i=0; i<tokenIds.length; i++) {
       var tokenId = tokenIds[i];
       var currFilename = await cup.getFilename(tokenId);
       var chunksTotal = await cup.getFileChunksTotal(tokenId);
       console.log(`Loading file for token ${tokenId}`);
       var chunks = [];
       for (var c_i=0; c_i<chunksTotal; c_i++) {
         var d = await cup.getFileChunk(tokenId,c_i);
         d = d.slice(2);
         console.log(`   Loaded chunk ${tokenId} /  ${c_i}`);
         buf = Buffer.from(d, 'hex');
         chunks.push(buf);
       }
       var all = Buffer.concat(chunks);
       var outFileName = `/tmp/${currFilename}`;
       fs.writeFile(outFileName, all, function(err) {
           if(err) {
               return console.log(err);
           }
           console.log(`Saved file for token ${tokenId} to ${outFileName}`);
       });
     }
   }).timeout(3000000000);;

});
