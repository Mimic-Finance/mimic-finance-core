pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "./cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";

contract Auto {
    string public name = "Auto-Compound";

    ERC20Burnable internal MimicToken;
    ERC20 internal JUSDToken;
    ERC20Burnable internal cJUSDToken;
    Farming internal FarmContract;
    Swap internal SwapContract;

    /* Other Contract Address */
    address internal FarmAddress;
    address internal SwapAddress;

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

    function deposit(uint256 _amount) public {
        address _account = msg.sender;
        /* Transfer JUSD from user to Auto-Compound Contract */
        JUSDToken.transferFrom(_account, address(this), _amount);
        /* Auto-Compound:: Approve JUSD for spend amount to Farm */
        JUSDToken.approve(FarmAddress, _amount);
        /* Stake JUSD in Farm Contract with Auto-Compound */
        FarmContract.stakeTokens(_amount);

        /**
         * Transfer cJUSD to user (Force return cJUSD)
         * to do: swap in uniswap router based-on LP price.
         */
        cJUSDToken.transfer(_account, _amount);
    }

    function swapmim() public {
        FarmContract.issueTokens();
        // uint256 mimbal = MimicToken.balanceOf(address(this));
        // MimicToken.approve(adrswap, mimbal);
        //swapp.mimtojusd(mimbal);
    }

    function claim() public {
        FarmContract.issueTokens();
    }
}