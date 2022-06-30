// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract AssetToken is ERC20, Ownable {
    address public positiveSBT;
    address public negativeSBT;
    string public documentUrl;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply,
        address _positiveSBT,
        address _negativeSBT,
        string memory _url,
        address _owner
    ) ERC20(_name, _symbol) {
        positiveSBT = _positiveSBT;
        negativeSBT = _negativeSBT;
        documentUrl = _url;
        _transferOwnership(_owner);
        _mint(_owner, initialSupply);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(
            accountHoldsNFT(to, negativeSBT) == false,
            "Transfer not allowed"
        );
        require(accountHoldsNFT(to, positiveSBT), "Transfer not allowed");
    }

    function accountHoldsNFT(address _userAddress, address _nftAddress)
        public
        view
        returns (bool)
    {
        return IERC721(_nftAddress).balanceOf(_userAddress) > 0;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _setPositiveSBT(address _positiveSBT) external onlyOwner {
        positiveSBT = _positiveSBT;
    }

    function _setNegativeSBT(address _negativeSBT) external onlyOwner {
        negativeSBT = _negativeSBT;
    }

    function _setDocumentURL(string memory _url) external onlyOwner {
        documentUrl = _url;
    }
}
