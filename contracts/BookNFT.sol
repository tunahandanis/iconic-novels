// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BookNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping(address => uint256[]) userNftIds;
    string[] allBookURIs;

    constructor() ERC721("Book", "BK") {}

    function mintBookNFT(address reader, string memory ipfsHash)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(reader, newItemId);
        _setTokenURI(newItemId, ipfsHash);

        userNftIds[reader].push(newItemId);
        allBookURIs.push(ipfsHash);


        _tokenIds.increment();
        return newItemId;
    }

    function getAllBookURIs()
        public view
        returns (string[] memory)
    {
       return allBookURIs;
    }

    function getAuthorBookURIs(address author)
        public view
        returns (string[] memory)
    {
        uint256[] memory nftIds = userNftIds[author];
        string[] memory bookURIs = new string[](nftIds.length);


        for(uint i = 0; i < nftIds.length; i++) {
            bookURIs[i] = tokenURI(nftIds[i]);
        }
        return bookURIs;
    }
}