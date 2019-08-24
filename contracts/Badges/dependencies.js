const fs = require('fs');
const clevisConfig = JSON.parse(fs.readFileSync("clevis.json").toString().trim())
module.exports = {
  'erc721x/contracts/Core/ERC721X/ERC721XToken.sol': fs.readFileSync('node_modules/erc721x/contracts/Core/ERC721X/ERC721XToken.sol', 'utf8'),
  'erc721x/contracts/Libraries/ObjectsLib.sol': fs.readFileSync('node_modules/erc721x/contracts/Libraries/ObjectsLib.sol', 'utf8'),
  'erc721x/contracts/Interfaces/ERC721X.sol': fs.readFileSync('node_modules/erc721x/contracts/Interfaces/ERC721X.sol', 'utf8'),
  'erc721x/contracts/Interfaces/ERC721XReceiver.sol': fs.readFileSync('node_modules/erc721x/contracts/Interfaces/ERC721XReceiver.sol', 'utf8'),
  'erc721x/contracts/Core/ERC721X/ERC721XTokenNFT.sol': fs.readFileSync('node_modules/erc721x/contracts/Core/ERC721X/ERC721XTokenNFT.sol', 'utf8'),
  'openzeppelin-solidity/contracts/AddressUtils.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/AddressUtils.sol', 'utf8'),
  'openzeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol', 'utf8'),
  'openzeppelin-solidity/contracts/introspection/ERC165.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/introspection/ERC165.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol', 'utf8'),
  'openzeppelin-solidity/contracts/math/SafeMath.sol': fs.readFileSync('node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol', 'utf8'),
}
