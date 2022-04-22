pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "./cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";
import "./AggregatorV3Interface.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Auto {
    using SafeMath for uint256;
    string public name = "Auto-Compound Contract";

    ERC20Burnable internal MimicToken;
    ERC20 internal JUSDToken;
    ERC20Burnable internal cJUSDToken;
    Farming internal FarmContract;
    Swap internal SwapContract;

    /* Other Contract Address */
    address internal FarmAddress;
    address internal SwapAddress;
    address internal JUSDAddress;
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => address) public tokenPriceMapping;

    constructor(
        address _JUSDToken,
        address _MimicToken,
        address _Farming,
        address _cJUSDToken,
        address _Swap
    ) public {
        /* Initial Token with token address */
        MimicToken = ERC20Burnable(_MimicToken);
        JUSDToken = ERC20(_JUSDToken);
        cJUSDToken = ERC20Burnable(_cJUSDToken);

        /* Initial Farm and Swap Contract with token address */
        SwapContract = Swap(_Swap);
        FarmContract = Farming(_Farming);

        /* Initial Farm and Swap Contract address */
        FarmAddress = _Farming;
        SwapAddress = _Swap;
        JUSDAddress = _JUSDToken;
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
        return stakingBalance[_token][_account].mul(price).div(10**decimals);
    }

    function deposit(uint256 _amount, address _token) public {
        require(FarmContract.checkWhitelisted(_token) && _amount > 0);
        /* Transfer any token that in whitelist from user to Auto-Compound Contract */
        ERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stakingBalance[_token][msg.sender] = stakingBalance[_token][msg.sender]
            .add(_amount);
        /* Calculate staking value */
        uint256 value = stakingValue(msg.sender, _token);
        /*Swap any token to jusd*/
        SwapContract.swapToJUSD(value);
        /*Transfer to Swap Contract*/
        ERC20(_token).transfer(SwapAddress, _amount);
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSDToken.approve(FarmAddress, value);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(value, JUSDAddress);

        /**
         * Transfer cJUSD to user (Force return cJUSD)
         * to do: swap in uniswap router based-on LP price.
         */
        cJUSDToken.transfer(msg.sender, value);
    }

    function claimAndSwap(address _token) public {
        /* Claim Mimic Token */
        FarmContract.issueTokens(_token);
        /* Check Mimic Token balance */
        uint256 mimbal = MimicToken.balanceOf(address(this));
        /* Swap Mimic To JUSD */
        MimicToken.approve(SwapAddress, mimbal);
        SwapContract.mimToJUSD(mimbal);
    }

    function depositToFarm(uint256 _amount) public {
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSDToken.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount, JUSDAddress);
    }

    function withdraw(uint256 _amount, address _token) public {
        /* Transfer cJUSD to Auto Compound */
        cJUSDToken.transferFrom(msg.sender, address(this), _amount);
        /* Unstake JUSD from Farming Contract */
        FarmContract.unstakeTokens(_amount, _token);
        /* Return JUSD to user */
        JUSDToken.transfer(msg.sender, _amount);
    }

    function getcJUSDBalance() public view returns (uint256) {
        return cJUSDToken.balanceOf(address(this));
    }

    function getJUSDBalance() public view returns (uint256) {
        return JUSDToken.balanceOf(address(this));
    }
}
