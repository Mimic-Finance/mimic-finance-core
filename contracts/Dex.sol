pragma solidity 0.6.6;

import "./uniswap/UniswapV2Router02.sol";

contract Dex {
    string public name = "Dex";
    address internal constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 public uniswapRouter;
    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public FarmAddr;

    constructor(address _FarmAddr) public payable {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
        FarmAddr = _FarmAddr;
    }

    function swapEthForUSDC(uint256 ethAmount) external payable {
        uint256 deadline = block.timestamp + 150;
        address[] memory path = getEthForUSDCPath();
        uint256 amountOutMin = uniswapRouter.getAmountsOut(ethAmount, path)[1];
        uniswapRouter.swapExactETHForTokens{value: msg.value}(
            amountOutMin,
            path,
            msg.sender,
            deadline
        );
    }

    function swapUSDCForEth(uint256 tokenAmount) external payable {
        uint256 deadline = block.timestamp + 150;
        address[] memory path = getUSDCForEthPath();
        uint256 amountOutMin = uniswapRouter.getAmountsOut(tokenAmount, path)[
            1
        ];
        IERC20(USDC).transferFrom(msg.sender, address(this), tokenAmount);
        IERC20(USDC).approve(UNISWAP_V2_ROUTER, tokenAmount);

        uniswapRouter.swapExactTokensForETH(
            tokenAmount,
            amountOutMin,
            path,
            msg.sender,
            deadline
        );
    }

    function swapTokenForEth(uint256 tokenAmount, address _account)
        external
        payable
    {
        uint256 deadline = block.timestamp + 150;
        address[] memory path = getUSDCForEthPath();
        uint256 amountOutMin = uniswapRouter.getAmountsOut(tokenAmount, path)[
            1
        ];

        IERC20(USDC).transferFrom(_account, address(this), tokenAmount);
        IERC20(USDC).approve(UNISWAP_V2_ROUTER, tokenAmount);

        uniswapRouter.swapExactTokensForETH(
            tokenAmount,
            amountOutMin,
            path,
            FarmAddr,
            deadline
        );
    }

    function getEthForUSDCPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = USDC;

        return path;
    }

    function getUSDCForEthPath() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = uniswapRouter.WETH();

        return path;
    }

    function getTokenForEthPath(address _address)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = _address;
        path[1] = uniswapRouter.WETH();
    }
}
