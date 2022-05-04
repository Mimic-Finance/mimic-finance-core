// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Manager is Ownable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;

    address[] public whitelisted;
    address[] public mintWhitelisted;
   function addWhitelisted(address _token) public onlyOwner {
        require(!checkWhitelisted(_token));
        whitelisted.push(_token);
    }

    function removeWhitelisted(address _token) public onlyOwner {
        uint256 i = findWhitedlisted(_token);
        removeByIndex(i);
    }

    function findWhitedlisted(address _token) public view returns (uint256) {
        uint256 i = 0;
        while (whitelisted[i] != _token) {
            i++;
        }
        return i;
    }

    function getWhitelisted() public view returns (address[] memory) {
        return whitelisted;
    }

    function removeByIndex(uint256 i) public {
        while (i < whitelisted.length - 1) {
            whitelisted[i] = whitelisted[i + 1];
            i++;
        }
        whitelisted.pop();
    }

    function checkWhitelisted(address _token) public view returns (bool) {
        for (uint256 i = 0; i < whitelisted.length; i++) {
            if (whitelisted[i] == _token) {
                return true;
            }
        }
        return false;
    }

     function addMintWhitelisted(address _token) public onlyOwner {
        require(!checkMintWhitelisted(_token));
        mintWhitelisted.push(_token);
    }

    function checkMintWhitelisted(address _token) public view returns (bool) {
        for (uint256 i = 0; i < mintWhitelisted.length; i++) {
            if (mintWhitelisted[i] == _token) {
                return true;
            }
        }
        return false;
    }

 function checkRewardByAddress(address _account, address _token, uint256 stakingBalance , uint256 updateTime)
        public
        view
        returns (uint256)
    {
        uint256 reward = calculateRewards(_account, _token, stakingBalance , updateTime);
        return reward;
    }

function calculateTime(address _account, address _token, uint256 updateTime)
        public
        view
        returns (uint256)
    {
        uint256 time = block.timestamp;
        uint256 totalTime = time.sub(updateTime);
        return totalTime;
    }

function calculateRewards(address _account, address _token , uint256 stakingBalance , uint256 updateTime)
        public
        view
        returns (uint256)
    {
        uint256 decimals = (ERC20(_token).decimals());
        uint256 expo = 10**decimals;
        uint256 time = calculateTime(_account, _token, updateTime).mul(1e18);
        uint256 rate = 86400;
        uint256 timeRate = time.div(rate);
        uint256 reward = stakingBalance.mul(timeRate).div(expo);
        return reward;
    }

    function checkDecimals(address _token , uint256 _amount) public view returns(uint256) {
    uint256 decimals = ERC20(_token).decimals();
    if(decimals != 18){
        uint256 remain = 18 - decimals;
        return _amount.mul(10 ** remain);
    }
    else {
        return _amount;
    } 
    }
}
