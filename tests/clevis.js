const clevis = require("clevis")
const chai = require("chai")
const HDWalletProvider = require("truffle-hdwallet-provider")
const assert = chai.assert
const expect = chai.expect;
const should = chai.should();

const fs = require('fs')
const Web3 = require('web3')
const clevisConfig = JSON.parse(fs.readFileSync("clevis.json").toString().trim())
const web3 = new Web3(
  clevisConfig.USE_INFURA ?
    new HDWalletProvider(
      process.env.mnemonic,
      clevisConfig.provider) :
    new Web3.providers.HttpProvider(clevisConfig.provider)
);

const accounts = JSON.parse(fs.readFileSync("accounts.json").toString().trim());
const [alice, bob, carlos] = accounts;

//console.log('clevisConfig.provider', clevisConfig.provider);

function localContractAddress(contract){
  return fs.readFileSync(clevisConfig.CONTRACTS_FOLDER+"/"+contract+ "/" + contract + ".address").toString().trim()
}
function localContractAbi(contract){
  return JSON.parse(fs.readFileSync(clevisConfig.CONTRACTS_FOLDER+"/"+contract+ "/"+ contract +".abi").toString().trim())
}
function printTxResult(result){
  if(!result||!result.transactionHash){
    console.log("ERROR".red,"MISSING TX HASH".yellow)
  }else{
    console.log(tab,result.transactionHash.gray,(""+result.gasUsed).yellow)
  }
}
function bigHeader(str){
  return "########### "+str+" "+Array(128-str.length).join("#")
}
function rand(min, max) {
  return Math.floor( Math.random() * (max - min) + min );
}
function getPaddedHexFromNumber(num,digits){
  let hexIs = web3.utils.numberToHex(num).replace("0x","");
  while(hexIs.length<digits){
    hexIs = "0"+hexIs
  }
  return hexIs
}
async function expectThrow(promise) {
  try {
    await promise;
  } catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const invalidJump = error.message.search('invalid JUMP') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;

    assert(
      invalidOpcode || invalidJump || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail('Expected throw not received');
}

const tab = "\t\t";
let lastBadgeId = -1;

module.exports = {
  web3,
  localContractAddress,
  contracts:fs.readFileSync(clevisConfig.ROOT_FOLDER + "/contracts.clevis").toString().trim().split("\n"),
  version:()=>{
    describe('#version() ', function() {
      it('should get version', async function() {
        this.timeout(90000)
        const result = await clevis("version")
        console.log(result)
      });
    });
  },
  blockNumber:()=>{
    describe('#blockNumber() ', function() {
      it('should get blockNumber', async function() {
        this.timeout(90000)
        const result = await clevis("blockNumber")
        console.log(result)
      });
    });
  },
  compile:(contract)=>{
    describe('#compile() '+contract.magenta, function() {
      it('should compile '+contract.magenta+' contract to bytecode', async function() {
        this.timeout(90000)
        const result = await clevis("compile",contract)
        console.log(result)
        assert(Object.keys(result.contracts).length>0, "No compiled contacts found.")
        let count = 0
        for(let c in result.contracts){
          console.log("\t\t"+"contract "+c.blue+": ",result.contracts[c].bytecode.length)
          if(count++==0){
              assert(result.contracts[c].bytecode.length > 1, "No bytecode for contract "+c)
          }
        }
      });
    });
  },
  deploy:(contract,accountindex)=>{
    describe('#deploy() '+contract.magenta, function() {
      it('should deploy '+contract.magenta+' as account '+accountindex, async function() {
        this.timeout(360000)
        const result = await clevis("deploy",contract,accountindex)
        printTxResult(result)
        console.log(tab+"Address: "+result.contractAddress.blue)
        assert(result.contractAddress)
      });
    });
  },

  metamask:()=>{
    describe('#transfer() ', function() {
      it('should give metamask account some ether or tokens to test', async function() {
        this.timeout(600000)
        let result = await clevis("sendTo","0.1","0","0x2a906694D15Df38F59e76ED3a5735f8AAbccE9cb")///<<<-------- change this to your metamask accounts
        printTxResult(result)
        //here is an example of running a funtion from within this object:
        //module.exports.mintTo("Greens",0,"0x2a906694d15df38f59e76ed3a5735f8aabcce9cb",20)
        //view more examples here: https://github.com/austintgriffith/galleass/blob/master/tests/galleass.js
      });
    });
  },

  full:()=>{
    describe(bigHeader('COMPILE'), function() {
      it('should compile all contracts', async function() {
        this.timeout(6000000)
        const result = await clevis("test","compile")
        console.log('result', result);
        assert(result==0,"deploy ERRORS")
      });
    });
    describe(bigHeader('FAST'), function() {
      it('should run the fast test (everything after compile)', async function() {
        this.timeout(6000000)
        const result = await clevis("test","fast")
        assert(result==0,"fast ERRORS")
      });
    });
  },

  fast:()=>{
    describe(bigHeader('DEPLOY'), function() {
      it('should deploy all contracts', async function() {
        this.timeout(6000000)
        const result = await clevis("test","deploy")
        assert(result==0,"deploy ERRORS")
      });
    });
    describe(bigHeader('METAMASK'), function() {
      it('should deploy all contracts', async function() {
        this.timeout(6000000)
        const result = await clevis("test","metamask")
        assert(result==0,"metamask ERRORS")
      });
    });
  },

  ////----------------------------------------------------------------------------///////////////////


  ////    ADD YOUR TESTS HERE <<<<<<<<--------------------------------


  ////----------------------------------------------------------------------------///////////////////
  // Badges:
  setupBadges() {
    describe('#validateContractName() ', function() {
      this.timeout(12000);
      it('will mint predefined badges', async function() {
        const amount = 0;
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
        await clevis("contract", "mintToken", "Badges", 0, ++lastBadgeId, amount);
      });
    });
  },
  validateContractName() {
    describe('#validateContractName() ', function() {
      this.timeout(12000);
      it('should get the contract name', async function() {
        const result = await clevis("contract", "name", "Badges");
        assert(result === 'Been Dapp Badges', "wrong contract name".red);
      });
    });
  },
  failToGetNonExistingBadge() {
    describe('#failToGetNonExistingBadge() ', function() {
      this.timeout(12000);
      it('should fail on getting a non-existing badge', async function() {
        const result = await clevis("contract", "exists", "Badges", (lastBadgeId + 1));
        assert.isNotTrue(result, "says non-existing contract exists".red);
      });
    });
  },
  createNftBadge() {
    describe('#createNftBadge() ', function() {
      const uid = ++lastBadgeId;
      this.timeout(12000);

      it('should create a nft badge', async function() {
        await clevis("contract", "mintNftToken", "Badges", 0, uid);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should get the right balance', async function() {
        const balanceOf = await clevis("contract", "balanceOf", "Badges", alice, uid);
        assert.equal(balanceOf, 1, "wrong balance".red);
      });

      it('token type should be NFT', async function() {
        const isNFT = await clevis("contract", "isNFT", "Badges", uid);
        assert.equal(isNFT, true, "wrong token type".red);
      });

      it('should get the right owner', async function() {
        const ownerOf = await clevis("contract", "ownerOf", "Badges", uid);
        assert.equal(ownerOf, alice, "wrong badge's owner".red);
      });
    });
  },
  createLimitedFtBadge() {
    describe('#createLimitedFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const amount = 5;
      this.timeout(12000);

      it('should create a limited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should get the right balance', async function() {
        const balanceOf = await clevis("contract", "balanceOf", "Badges", alice, uid);
        assert.equal(balanceOf, amount, "wrong balance".red);
      });

      it('token type should be FT', async function() {
        const isFT = await clevis("contract", "isFT", "Badges", uid);
        assert.equal(isFT, true, "wrong token type".red);
      });

      it('should fail on minting the same token', async function() {
        await expectThrow(clevis("contract", "mintToken", "Badges", 0, uid, amount));
      });
    });
  },
  createUnlimitedFtBadge() {
    describe('#createUnlimitedFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const amount = 0;
      this.timeout(12000);

      it('should create an unlimited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should get the right balance', async function() {
        const balanceOf = await clevis("contract", "balanceOf", "Badges", alice, uid);
        assert.equal(balanceOf, amount, "wrong balance".red);
      });

      it('token type should be FT', async function() {
        const isFT = await clevis("contract", "isFT", "Badges", uid);
        assert.equal(isFT, true, "wrong token type".red);
      });

      it('should fail on minting the same token', async function() {
        await expectThrow(clevis("contract", "mintToken", "Badges", 0, uid, amount));
      });
    });
  },
  getCreatedBadges() {
    describe('#getCreatedBadges() ', function() {
      const badgesIds = [
        (++lastBadgeId).toString(),
        (++lastBadgeId).toString(),
        (++lastBadgeId).toString()
      ];
      const badgesAmounts = ['-1', '10', '0'];
      this.timeout(12000);

      it('should create a non-fungible badge', async function() {
        const uid = badgesIds[0];
        await clevis("contract", "mintNftToken", "Badges", 0, uid);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should create a limited fungible badge', async function() {
        const uid = badgesIds[1];
        const amount = badgesAmounts[1];
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should create an unlimited fungible badge', async function() {
        const uid = badgesIds[2];
        const amount = badgesAmounts[2];
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should get the list of minted tokens', async function() {
        const tokensMinted = await clevis("contract", "tokensMinted", "Badges");
        const tokensIndexes = [];
        (tokensMinted.indexes || []).forEach((el, i) => {
          if (badgesIds.includes(el)) tokensIndexes.push(i);
        });
        const mintedTokensAmount = tokensIndexes.map(i => tokensMinted.balances[i]);
        assert.lengthOf(tokensIndexes, badgesIds.length, "wrong amount of badges was created".red);
        assert.sameOrderedMembers(mintedTokensAmount, badgesAmounts, "badges were minted with wrong amounts".red);
      });
    });
  },
  awardNftBadge() {
    describe('#awardNftBadge() ', function() {
      const uid = ++lastBadgeId;
      const amount = 1;
      this.timeout(12000);

      it('should create a nft badge', async function() {
        await clevis("contract", "mintNftToken", "Badges", 0, uid);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award user with created badge', async function() {
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, amount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, amount, "wrong balance".red);
      });

      it('should show the right owner of the new token', async function() {
        const owner = await clevis("contract", "ownerOf", "Badges", uid);
        assert.equal(owner, bob, "wrong token owner".red);
      });
    });
  },
  awardLimitedFtBadge() {
    describe('#awardLimitedFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const totalAmount = 2;
      const userAmount = 1;
      this.timeout(12000);

      it('should create a limited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award user with created badge', async function() {
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, userAmount);
        const balanceOf1 = await clevis("contract", "balanceOf", "Badges", alice, uid);
        assert.equal(balanceOf1, userAmount, "wrong balance for user 1".red);
        const balanceOf2 = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf2, userAmount, "wrong balance for user 2".red);
      });
    });
  },
  awardUnlimitedFtBadge() {
    describe('#awardUnlimitedFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const totalAmount = 0;
      const userAmount = 1;
      this.timeout(12000);

      it('should create an unlimited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award user with created badge', async function() {
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, userAmount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, userAmount, "wrong user balance".red);
      });
    });
  },
  failToAwardBadgeDueToAmount() {
    describe('#failToAwardBadgeDueToAmount() ', function() {
      const uid = ++lastBadgeId;
      const totalAmount = 1;
      const userAmount = 1;
      this.timeout(12000);

      it('should create a limited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award user with created badge', async function() {
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, userAmount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, userAmount, "wrong user balance".red);
      });

      it('should fail awarding another user due to amount', async function() {
        await expectThrow(clevis("contract", "awardToken", "Badges", 0, uid, carlos, userAmount));
      });
    });
  },
  checkUserBadgesBalance() {
    describe('#checkUserBadgesBalance() ', function() {
      const badgesIds = [
        (++lastBadgeId).toString(),
        (++lastBadgeId).toString(),
        (++lastBadgeId).toString()
      ];
      const badgesAmounts = ['-1', '10', '0'];
      const userAmounts = ['1', '1', '1'];
      this.timeout(12000);

      it('should create a non-fungible badge', async function() {
        const uid = badgesIds[0];
        await clevis("contract", "mintNftToken", "Badges", 0, uid);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should create a limited fungible badge', async function() {
        const uid = badgesIds[1];
        const amount = badgesAmounts[1];
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should create an unlimited fungible badge', async function() {
        const uid = badgesIds[2];
        const amount = badgesAmounts[2];
        await clevis("contract", "mintToken", "Badges", 0, uid, amount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award user with all minted badges', async function() {
        await clevis("contract", "awardToken", "Badges", 0, badgesIds[0], bob, 1);
        await clevis("contract", "awardToken", "Badges", 0, badgesIds[1], bob, 1);
        await clevis("contract", "awardToken", "Badges", 0, badgesIds[2], bob, 1);
      });

      it('should get the list of user badges', async function() {
        const tokensMinted = await clevis("contract", "tokensOwned", "Badges", bob);
        const tokensIndexes = [];
        (tokensMinted.indexes || []).forEach((el, i) => {
          if (badgesIds.includes(el)) tokensIndexes.push(i);
        });
        const mintedTokensAmount = tokensIndexes.map(i => tokensMinted.balances[i]);
        assert.lengthOf(tokensIndexes, badgesIds.length, "wrong amount of badges was awarded".red);
        assert.sameOrderedMembers(mintedTokensAmount, userAmounts, "badges were awarded with wrong amounts".red);
      });
    });
  },
  transferNftBadge() {
    describe('#transferNftBadge() ', function() {
      const uid = ++lastBadgeId;
      const amount = 1;
      const transferable = 'true';
      this.timeout(12000);

      it('should create a nft badge', async function() {
        await clevis("contract", "mintNftToken", "Badges", 0, uid, transferable);
        const exists = await clevis("contract", "exists", "Badges", uid);
        const isTransferable = await clevis("contract", "isTransferable", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
        assert.isTrue(isTransferable, "badge should be transferable".red);
      });

      it('should award user with the created badge', async function() {
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, amount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        const owner = await clevis("contract", "ownerOf", "Badges", uid);
        assert.equal(balanceOf, amount, "wrong user balance".red);
        assert.equal(owner, bob, "wrong token owner".red);
      });

      it('should allow to transfer a badge to another user', async function() {
        await clevis("contract", "transferFrom", "Badges", 1, bob, carlos, uid);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        const owner = await clevis("contract", "ownerOf", "Badges", uid);
        assert.equal(balanceOf, 0, "wrong user balance".red);
        assert.equal(owner, carlos, "wrong token owner".red);
      });
    });
  },
  transferFtBadge() {
    describe('#transferFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const totalAmount = 2;
      const userAmount = 1;
      const transferable = 'true';
      this.timeout(12000);

      it('should create a limited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount, transferable);
        const exists = await clevis("contract", "exists", "Badges", uid);
        const isTransferable = await clevis("contract", "isTransferable", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
        assert.isTrue(isTransferable, "badge should be transferable".red);
      });

      it('should award user with the created badge', async function() {
        const awardAmount = totalAmount;
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, awardAmount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, awardAmount, "wrong user balance".red);
      });

      it('should allow to transfer a badge to another user', async function() {
        await clevis("contract", "transferFrom", "Badges", 1, bob, carlos, uid, userAmount);
        const balanceOf1 = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf1, userAmount, "wrong user 1 balance".red);
        const balanceOf2 = await clevis("contract", "balanceOf", "Badges", carlos, uid);
        assert.equal(balanceOf2, userAmount, "wrong user 2 balance".red);
      });
    });
  },
  failToTransferNonTransferableBadges() {
    describe('#failToTransferNonTransferableBadges() ', function() {
      const badgesIds = [++lastBadgeId, ++lastBadgeId];
      const totalAmount = 0;
      const userAmount = 1;
      this.timeout(12000);

      it('should create an unlimited fungible badge', async function() {
        const uid = badgesIds[0];
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        const isTransferable = await clevis("contract", "isTransferable", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
        assert.isFalse(isTransferable, "badge should be transferable".red);
      });

      it('should create a non-fungible badge', async function() {
        const uid = badgesIds[1];
        await clevis("contract", "mintNftToken", "Badges", 0, uid);
        const exists = await clevis("contract", "exists", "Badges", uid);
        const isTransferable = await clevis("contract", "isTransferable", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
        assert.isFalse(isTransferable, "badge should be transferable".red);
      });

      it('should award user with the FT badge', async function() {
        const uid = badgesIds[0];
        const awardAmount = userAmount;
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, awardAmount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, awardAmount, "wrong user balance".red);
      });

      it('should award user with the NFT badge', async function() {
        const uid = badgesIds[1];
        const awardAmount = userAmount;
        await clevis("contract", "awardToken", "Badges", 0, uid, bob, awardAmount);
        const balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, awardAmount, "wrong user balance".red);
      });

      it('should fail to transfer a FT badge to another user', async function() {
        const uid = badgesIds[0];
        await expectThrow(clevis("contract", "transferFrom", "Badges", 1, bob, carlos, uid, userAmount));
      });

      it('should fail to transfer a FT badge to another user', async function() {
        const uid = badgesIds[1];
        await expectThrow(clevis("contract", "transferFrom", "Badges", 1, bob, carlos, uid, userAmount));
      });
    });
  },
  changeTokenUrl() {
    describe('#changeTokenUrl() ', function() {
      const defaultTokenUri = "https://bcx.pillarproject.io/badges/";
      const newTokenUri = "https://bcx-core.pillarproject.io/badges/";
      this.timeout(12000);

      it('should return the default token base url', async function() {
        const tokenBaseUri = await clevis("contract", "getTokenBaseUri", "Badges");
        assert.equal(tokenBaseUri, defaultTokenUri, "token's base uri wasn't set".red);
      });

      it('should return the right token url for a badge', async function() {
        const checkBadgeId = 1;
        const badgeUri = await clevis("contract", "tokenURI", "Badges", checkBadgeId);
        assert.equal(badgeUri, `${defaultTokenUri}${checkBadgeId}`, "token's uri is wrong".red);
      });

      it('should be possible to change the token base url', async function() {
        const checkBadgeId = 1;

        await clevis("contract", "setTokenBaseUri", "Badges", 0, newTokenUri);
        const tokenBaseUri = await clevis("contract", "getTokenBaseUri", "Badges");
        assert.equal(tokenBaseUri, newTokenUri, "token's base uri wasn't changed".red);

        const badgeUri = await clevis("contract", "tokenURI", "Badges", checkBadgeId);
        assert.equal(badgeUri, `${newTokenUri}${checkBadgeId}`, "token's uri is wrong".red);
      });
    });
  },
  massAwardUnlimitedFtBadge() {
    describe('#massAwardUnlimitedFtBadge() ', function() {
      const uid = ++lastBadgeId;
      const totalAmount = 0;
      const userAmount = 1;
      let balanceOf;
      this.timeout(12000);

      it('should create an unlimited fungible badge', async function() {
        await clevis("contract", "mintToken", "Badges", 0, uid, totalAmount);
        const exists = await clevis("contract", "exists", "Badges", uid);
        assert.equal(exists, true, "badge wasn't created".red);
      });

      it('should award users with created badge', async function() {
        await clevis("contract", "batchAwardToken", "Badges", 0, uid, [alice, bob, carlos], userAmount);
        balanceOf = await clevis("contract", "balanceOf", "Badges", alice, uid);
        assert.equal(balanceOf, userAmount, "wrong balance for alice".red);
        balanceOf = await clevis("contract", "balanceOf", "Badges", bob, uid);
        assert.equal(balanceOf, userAmount, "wrong balance for bob".red);
        balanceOf = await clevis("contract", "balanceOf", "Badges", carlos, uid);
        assert.equal(balanceOf, userAmount, "wrong balance for carlos".red);
      });
    });
  },
  ////----------------------------------------------------------------------------///////////////////
}

checkContractDeployment = async (contract)=>{
  const localAddress = localContractAddress(contract)
  const address = await clevis("contract","getContract","Example",web3.utils.fromAscii(contract))
  console.log(tab,contract.blue+" contract address is "+(localAddress+"").magenta+" deployed as: "+(address+"").magenta)
  assert(localAddress==address,contract.red+" isn't deployed correctly!?")
  return address
}



//example helper function
/*
makeSureContractHasTokens = async (contract,contractAddress,token)=>{
  const TokenBalance = await clevis("contract","balanceOf",token,contractAddress)
  console.log(tab,contract.magenta+" has "+TokenBalance+" "+token)
  assert(TokenBalance>0,contract.red+" doesn't have any "+token.red)
}

view more examples here: https://github.com/austintgriffith/galleass/blob/master/tests/galleass.js

*/
