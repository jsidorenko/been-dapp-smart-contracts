pragma solidity ^0.4.24;

import "erc721x/contracts/Core/ERC721X/ERC721XToken.sol";
import "erc721x/contracts/Libraries/ObjectsLib.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Badges is Ownable, ERC721XToken {

  mapping(uint => int) internal tokenIdToIndividualSupply;
  mapping(uint => bool) internal tokenIdIsTransferable;
  string tokenBaseUri;

  event TokenAwarded(uint indexed tokenId, address claimer, uint amount);
  event TokenMinted(uint indexed tokenId, uint supply, uint tokenType, bool isTransferable);

  modifier transferable (uint _tokenId) {
    require(exists(_tokenId), "TokenID has not been minted");
    require(tokenIdIsTransferable[_tokenId], "TokenID is not transferable");
    _;
  }

  modifier transferableTokens (uint256[] _tokenIds) {
    for(uint index = 0; index < _tokenIds.length; index++){
      if(!exists(_tokenIds[index]) || !tokenIdIsTransferable[_tokenIds[index]]){
        revert();
        return;
      }
    }
    _;
  }

  constructor(string _tokenBaseUri) public Ownable() {
    tokenBaseUri = _tokenBaseUri;
  }

  function name() external view returns (string) {
    return "Been Dapp Badges";
  }

  function symbol() external view returns (string) {
    return "BDB";
  }

  function individualSupply(uint _tokenId) public view returns (int) {
    return tokenIdToIndividualSupply[_tokenId];
  }

  function batchMintTokens(uint[] _tokenIds, uint[] _tokenSupplies, bool[] _isTransferable) external onlyOwner {
    for (uint i = 0; i < _tokenIds.length; i++) {
      mintToken(_tokenIds[i], _tokenSupplies[i], _isTransferable[i]);
    }
  }

  function batchMintNftTokens(uint[] _tokenIds, bool[] _isTransferable) external onlyOwner {
    for (uint i = 0; i < _tokenIds.length; i++) {
      mintNftToken(_tokenIds[i], _isTransferable[i]);
    }
  }

  // fungible mint
  function mintToken(uint256 _tokenId, uint256 _supply, bool _isTransferable) public onlyOwner {
    require(!exists(_tokenId), "Error: Tried to mint duplicate token id");
    _mint(_tokenId, msg.sender, _supply);
    tokenIdToIndividualSupply[_tokenId] = int(_supply);
    tokenIdIsTransferable[_tokenId] = _isTransferable;
    emit TokenMinted(_tokenId, _supply, FT, _isTransferable);
  }

  // nft mint
  function mintNftToken(uint256 _tokenId, bool _isTransferable) public onlyOwner {
    require(!exists(_tokenId), "Error: Tried to mint duplicate token id");
    _mint(_tokenId, msg.sender);
    tokenIdToIndividualSupply[_tokenId] = -1;
    tokenIdIsTransferable[_tokenId] = _isTransferable;
    emit TokenMinted(_tokenId, 1, NFT, _isTransferable);
  }

  function batchAwardToken(uint _tokenId, address[] _to, uint _amount) public onlyOwner {
    for (uint i = 0; i < _to.length; i++) {
      awardToken(_tokenId, _to[i], _amount);
    }
  }

  function awardToken(uint _tokenId, address _to, uint _amount) public onlyOwner {
    require(exists(_tokenId), "TokenID has not been minted");
    if (tokenType[_tokenId] == NFT) {
      _transferFrom(msg.sender, _to, _tokenId);
    } else {
      if (individualSupply(_tokenId) > 0) {
        require(_amount <= balanceOf(msg.sender, _tokenId), "Quantity greater than from balance");
        _updateTokenBalance(msg.sender, _tokenId, _amount, ObjectLib.Operations.SUB);
      }
      _updateTokenBalance(_to, _tokenId, _amount, ObjectLib.Operations.ADD);
    }
    emit TokenAwarded(_tokenId, _to, _amount);
  }

  /**
   * @dev Gets Iterate through the list of existing tokens and return the indexes
   *        and balances of the tokens owner by the user
   * @return indexes The tokenIds
   * @return balances The balances of each token
   */
  function tokensMinted() public view returns (uint256[] indexes, int256[] balances) {
    uint256 numTokens = totalSupply();
    uint256[] memory tokenIndexes = new uint256[](numTokens);
    int256[] memory tokenBalances = new int256[](numTokens);

    for (uint256 i = 0; i < numTokens; i++) {
      uint256 tokenId = allTokens[i];
      tokenIndexes[i] = tokenId;
      tokenBalances[i] = individualSupply(tokenId);
    }

    return (tokenIndexes, tokenBalances);
  }

  function setTokenBaseUri(string _newUri) public onlyOwner {
    tokenBaseUri = _newUri;
  }

  function getTokenBaseUri() public view returns (string) {
    return tokenBaseUri;
  }

  /**
   * @dev Returns the specified token's uri
   * @param _tokenId uint256 ID of the token to get the uri of
   * @return tokenUri token's uri
   */
  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId), "Token doesn't exist");
    return _appendUintToString(tokenBaseUri, _tokenId);
  }

  function _appendUintToString(string _string, uint _number) internal pure returns (string) {
    uint maxLength = 78;
    bytes memory reversedNumber = new bytes(maxLength);
    uint numDigits = 0;
    while (_number != 0) {
      uint remainder = _number % 10;
      _number = _number / 10;
      reversedNumber[numDigits++] = byte(48 + remainder);
    }
    bytes memory strBytes = bytes(_string);
    bytes memory result = new bytes(strBytes.length + numDigits);
    uint i;
    for (i = 0; i < strBytes.length; i++) {
      result[i] = strBytes[i];
    }
    for (i = 0; i < numDigits; i++) {
      result[i + strBytes.length] = reversedNumber[numDigits - 1 - i];
    }
    return string(result);
  }

  /**
   * @dev Returns whether the specified token is fungible
   * @param _tokenId uint256 ID of the token to check the type of
   * @return whether the token is fungible
   */
  function isFT(uint256 _tokenId) public view returns (bool) {
    return tokenType[_tokenId] == FT;
  }

  /**
   * @dev Returns whether the specified token is non-fungible
   * @param _tokenId uint256 ID of the token to check the type of
   * @return whether the token is non-fungible
   */
  function isNFT(uint256 _tokenId) public view returns (bool) {
    return tokenType[_tokenId] == NFT;
  }

  /**
   * @dev Returns whether the specified token is transferable
   * @param _tokenId uint256 ID of the token to check the transfer status of
   * @return whether the token is transferable
   */
  function isTransferable(uint256 _tokenId) public view returns (bool) {
    return tokenIdIsTransferable[_tokenId];
  }

  // override transfer methods to check if the token is transferable
  function batchTransferFrom(
      address _from,
      address _to,
      uint256[] _tokenIds,
      uint256[] _amounts
    )
    public
    transferableTokens(_tokenIds)
  {
    super.batchTransferFrom(_from, _to, _tokenIds, _amounts);
  }

  function safeBatchTransferFrom(
      address _from,
      address _to,
      uint256[] _tokenIds,
      uint256[] _amounts,
      bytes _data
    )
    public
    transferableTokens(_tokenIds)
  {
    super.safeBatchTransferFrom(_from, _to, _tokenIds, _amounts, _data);
  }

  function transfer(address _to, uint256 _tokenId, uint256 _amount) public transferable(_tokenId) {
    super.transfer(_to, _tokenId, _amount);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) public transferable(_tokenId) {
    super.transferFrom(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount) public transferable(_tokenId) {
    super.transferFrom(_from, _to, _tokenId, _amount);
  }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId) public transferable(_tokenId) {
    super.safeTransferFrom(_from, _to, _tokenId);
  }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data) public transferable(_tokenId) {
    super.safeTransferFrom(_from, _to, _tokenId, _data);
  }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount) public transferable(_tokenId) {
    super.safeTransferFrom(_from, _to, _tokenId, _amount);
  }

  function safeTransferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount, bytes _data) public transferable(_tokenId) {
    super.safeTransferFrom(_from, _to, _tokenId, _amount, _data);
  }
}
