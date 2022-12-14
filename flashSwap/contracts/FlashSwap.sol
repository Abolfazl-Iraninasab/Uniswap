// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IUniswap.sol";
import "./IUniswapV2Callee.sol";

contract FlashSwap is IUniswapV2Callee {

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // Uniswap V2 factory
    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    event Log(string message, uint256 val);

    function doFlashSwap(address _tokenBorrow, uint256 _amount) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenBorrow, WETH);
        require(pair != address(0), "!pair");

        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;

        // need to pass some data to trigger uniswapV2Call
        bytes memory flashSwapData = abi.encode(_tokenBorrow, _amount);

        IUniswapV2Pair(pair).swap(
            amount0Out,
            amount1Out,
            address(this),
            flashSwapData
        );
    }

    //trigger a flashLoan : we call swap on uniswapPairContract and Pair contract calls uniswapV2Call() in return
    function uniswapV2Call(
        address _sender,
        uint256 _amount0,
        uint256 _amount1,
        bytes calldata _data
    ) external override {
        // check the sender is pair contract 
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "!pair");
        require(_sender == address(this), "!sender");

        (address tokenBorrow, uint256 amount) = abi.decode(
            _data,
            (address, uint256)
        );

        // The approximate comparison of fees is ~ 30 bps for a swap fee
        uint256 fee = ((amount * 3) / 997) + 1;
        uint256 amountToRepay = amount + fee;

        emit Log("amount", amount);
        emit Log("amount0", _amount0);
        emit Log("amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to repay", amountToRepay);

        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }
}
