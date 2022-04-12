pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "./cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Auto {
    string public name = "Auto-Compound Contract";

    ERC20Burnable internal MimicToken;
    ERC20 internal JUSDToken;
    ERC20Burnable internal cJUSDToken;
    Farming internal FarmContract;
    Swap internal SwapContract;

    /* Other Contract Address */
    address internal FarmAddress;
    address internal SwapAddress;
    mapping(address => uint256) public stakingBalance;

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
    }

    function deposit(uint256 _amount, address _token) public {
        address _account = msg.sender;
        stakingBalance[_account] = SafeMath.add(
            stakingBalance[_account],
            _amount
        );
        /* Transfer JUSD from user to Auto-Compound Contract */
        JUSDToken.transferFrom(_account, address(this), _amount);
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSDToken.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount, _token);

        /**
         * Transfer cJUSD to user (Force return cJUSD)
         * to do: swap in uniswap router based-on LP price.
         */
        cJUSDToken.transfer(_account, _amount);
    }

    function depositToFarm(uint256 _amount, address _token) public {
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSDToken.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount, _token);
    }

    function swapMimToJUSD() public {
        uint256 mimbal = MimicToken.balanceOf(address(this));
        MimicToken.approve(SwapAddress, mimbal);
        SwapContract.mimtojusd(mimbal);
    }

    function claim(address _token) public {
        FarmContract.issueTokens(_token);
    }

    function withdraw(uint256 _amount, address _token) public {
        address _account = msg.sender;
        cJUSDToken.transferFrom(_account, address(this), _amount);
        FarmContract.unstakeTokens(_amount, _token);
        JUSDToken.transfer(_account, _amount);
    }

    function getcJUSDBalance() public returns (uint256) {
        return cJUSDToken.balanceOf(address(this));
    }

    function getJUSDBalance() public returns (uint256) {
        return JUSDToken.balanceOf(address(this));
    }
}
