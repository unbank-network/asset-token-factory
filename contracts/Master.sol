// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

import "./AssetToken.sol";

contract Master {
    event AssetAdded(
        address indexed assetAddress,
        string indexed url,
        address indexed ownerAddress,
        address positiveSBT,
        address negativeSBT,
        uint256 initialSupply
    );

    address[] public assets;

    function addAsset(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _positiveSBT,
        address _negativeSBT,
        string memory _url
    ) public returns (address newAsset) {
        AssetToken _assetToken = new AssetToken(
            _name,
            _symbol,
            _initialSupply,
            _positiveSBT,
            _negativeSBT,
            _url,
            msg.sender
        );
        assets.push(address(_assetToken));
        emit AssetAdded(
            address(_assetToken),
            _url,
            msg.sender,
            _positiveSBT,
            _negativeSBT,
            _initialSupply
        );
        return address(_assetToken);
    }

    function getAllAssets() public view returns (address[] memory) {
        return assets;
    }
}
