pragma solidity 0.6.6;

import "./JUSD.sol";
import "./Mimic.sol";
import "./cJUSD.sol";
import "./Farming.sol";
import "./Swap.sol";

contract Auto {
    string public name = "Auto-Compound";
    ERC20Burnable public MimicToken;
    ERC20 public JUSDToken;
    ERC20Burnable public cJUSDToken;
    Farming public Farm;
    Swap public swapp;
    address internal adrfarm;
    address internal adrswap;

    constructor(
        address _JUSDToken,
        address _MimicToken,
        address _Farming,
        address _cJUSDToken,
        address _Swap
    ) public {
        MimicToken = ERC20Burnable(_MimicToken);
        JUSDToken = ERC20(_JUSDToken);
        Farm = Farming(_Farming);
        cJUSDToken = ERC20Burnable(_cJUSDToken);
        swapp = Swap(_Swap);
        adrfarm = _Farming;
        adrswap = _Swap;
    }

    function deposit(uint256 _amount) public {
        uint256 balance = _amount;
        JUSDToken.transferFrom(msg.sender, address(this), balance);
        JUSDToken.approve(adrfarm, balance);
        Farm.stakeTokens(balance);
        cJUSDToken.transfer(msg.sender, balance);
    }

    function swapmim() public {
        Farm.issueTokens();
        // uint256 mimbal = MimicToken.balanceOf(address(this));
        // MimicToken.approve(adrswap, mimbal);
        //swapp.mimtojusd(mimbal);
    }

    function claim() public {
        Farm.issueTokens();
    }
}
