# Smart Contracts for Been Dapp

[Been Dapp](https://github.com/poocart/been-dapp)

## install
```
npm install -g ganache-cli
npm install -g mocha
npm install
```

## run
First you need to start the ganache, then run the command bellow to compile & deploy the smart contract and run all the tests
```
npm run test:badges:full
```
To just compile & deploy the smart contract run:
```
npm run compile:badges
```

## badges commands/examples
Mint non-transferable badge with id = 0 and amount = 3: 
```
clevis contract mintToken Badges 0 0 3
```

Mint transferable badge with id = 1 and amount = 3:
```
clevis contract mintToken Badges 0 1 3 true
```

Mint transferable badge with id = 1 and unlimited amount:
```
clevis contract mintToken Badges 0 1 0 true
```

Mint transferable NFT badge with id = 2:
```
clevis contract mintNftToken Badges 0 2 true
```

Check if the badge with id = 0 is transferable:
```
clevis contract isTransferable Badges 0
```

Get the individual supply of badge with id = 1:
```
clevis contract individualSupply Badges 1
```

Get the total amount of minted badges
```
clevis contract totalSupply Badges
```

Check if badge with id = 0 exists
```
clevis contract exists Badges 0
```

Get the list of the minted badges with their balances:
```
clevis contract tokensMinted Badges
```

Award user `0x63448ac0567D32dC1dCAA727206e778625697C94` with badge (id = 0, amount = 1)
```
clevis contract awardToken Badges 0 0 0xF74B153D202aB7368acA04Efb71CB3c8c316b514 1
```

Get all the badges with their amounts those specified user owns: 
```
clevis contract tokensOwned Badges 0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20
```

Get user's balance, returns the amount of unique badges (without quantities):
```
clevis contract balanceOf Badges 0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20
```

Get the amount of user's badge with id = 1:
```
clevis contract balanceOf Badges 0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20 1
```

Transfer badge (from = `0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20`, to = `0x63448ac0567D32dC1dCAA727206e778625697C94`, id = 0):
```
clevis contract transferFrom Badges 0 0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20 0x63448ac0567D32dC1dCAA727206e778625697C94 0
```

Transfer badge (from = `0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20`, to = `0x63448ac0567D32dC1dCAA727206e778625697C94`, id = 0, amount = 1):
```
clevis contract transferFrom Badges 0 0xA0E19Fe68845b31a9E3B4b9c6d8DB720b86efD20 0x63448ac0567D32dC1dCAA727206e778625697C94 0 1
```

Get the owner of NFT badge with id = 2:
```
clevis contract ownerOf Badges 2
```

Check if the badge with id = 1 is fungible:
```
clevis contract isFT Badges 1
```

Check if the badge with id = 1 is non-fungible:
```
clevis contract isNFT Badges 1
```
	
## clevis commands/examples

### help
```
clevis help
```
lists available commands and usage

### version
```
clevis version
```
lists current version

### update
```
clevis update
```
loads latest prices and standard gas and updates config

### accounts
```
clevis accounts
```
lists accounts from Geth or other RPC endpoint

### new [password]
```
clevis new ""
```
creates a new address

### unlock [accountindex] ["password"]
```
clevis unlock 0 ""
```
unlocks account

### send [amount] [fromindex] [toindex]
```
clevis send 0.1 0 1
```
send ether from one local account to another by index

### sendTo [amount] [fromindex] [toaddress]
```
clevis sendTo 0.1 0 0x6FC8152A3C0E0aC8e61faf233915e1334b58fC77
```
send ether from local account to any address

### balance [address]
```
clevis balance 0x6FC8152A3C0E0aC8e61faf233915e1334b58fC77
```
get balance of any Ethereum address or local index

### sign [string] [accountindex] [password]
```
clevis sign "Hello World" 0 ""
```
sign a string with a local account

### recover [string] [signature]
```
clevis recover "Hello World" "0x87dc7..."
```
recover address used to sign a string

### sha3 [string]
```
clevis sha3 "Hello World"
```
generates the keccak256 hash of a string

### sendData [amount] [fromindex] [toaddress] [data]
```
clevis sendData 0.001 0 0x6FC8152A3C0E0aC8e61faf233915e1334b58fC77 "0x01"
```
send ether and/or data to an account

### create [contractname]
```
clevis create SomeContract
```
create a contract

### compile [contractname]
```
clevis compile SomeContract
```
compile a contract

### deploy [contractname] [accountindex]
```
clevis deploy SomeContract 0
```
deploy a contract

### explain [contractname]
```
clevis explain SomeContract
```
list all contract commands/events etc

### contract [scriptname] [contractname] [[accountIndex]] [[contractArguments...]]
```
clevis contract someFunction SomeContract 1 someArgument
```
interact with a contract
these scripts are generated automatically using the ABI
(list .clevis folder inside any contract folder to see all scripts)

you can also read from contracts:
```
clevis contract balanceOf Copper 0x2a906694d15df38f59e76ed3a5735f8aabcce9cb
```

### contract event[eventname] [contractname]
```
clevis contract eventMyEvent SomeContract
```

Shows all the logs emitted under eventname.

Please note that there is not blank between event and your event name.


### test [testname]
```
clevis test compile
```
run mocha test from tests folder

### fromwei [amount] [symbol]
```
clevis wei 100000000000 ether
```
convert from wei to ether or others like gwei or szabo

### towei [amount] [symbol]
```
clevis wei 0.001 ether
```
convert to wei from ether or others like gwei or szabo

### hex [asciistring]
```
clevis hex "Hello World"
```
convert a string to hex

### ascii [hexstring]
```
clevis ascii "0x48656c6c6f20576f726c64"
```
convert hex to a string

### blockNumber
```
clevis blockNumber
```
get current block number

### block [blocknumber]
```
clevis block 2618069
```
get block information

### transaction [hash]
```
clevis transaction 0x474acab2ba2702a90c4b774d7cee7fe1364ca1df01735ecef188522f8ce40bc4
```
get transaction information
