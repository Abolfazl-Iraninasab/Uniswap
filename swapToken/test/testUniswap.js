
const IERC20 = artifacts.require("IERC20.sol");
const TestUniswap = artifacts.require("testUniswap.sol");
// require("chai").use(require("chai-as-promised")).should

contract("TestUniswap", (accounts) => {
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" ;
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" ;
  const WHALE = "0x845cbcb8230197f733b59cfe1795f282786f212c" ;

  const AMOUNT_IN = 5000000000; 
  const AMOUNT_OUT_MIN = 1;
  const TOKEN_IN = WBTC;
  const TOKEN_OUT = DAI;
  const TO = accounts[0];

  let testUniswap;
  let tokenIn;
  let tokenOut;

  before(async () => {
    tokenIn = await IERC20.at(TOKEN_IN);
    tokenOut = await IERC20.at(TOKEN_OUT);
    testUniswap = await TestUniswap.new();

    // WHALE should has enough ETH to send transaction
    await tokenIn.approve(testUniswap.address, AMOUNT_IN, { from: WHALE });

    console.log(`----- WHALE balance before swap => WBTC: ${await tokenIn.balanceOf(WHALE)} , DAI: ${await tokenOut.balanceOf(WHALE)} -----`);
    console.log(`----- Receiver balance before swap => WBTC: ${await tokenIn.balanceOf(TO)} , DAI: ${await tokenOut.balanceOf(TO)} -----`);

  });

  it("---- execute swap ----", async () => {

    // WHALE should has enough WBTC to send this transaction (check on https://etherscan.io/ )
    await testUniswap.swap( tokenIn.address, tokenOut.address, AMOUNT_IN, AMOUNT_OUT_MIN, TO, { from: WHALE } );

    // console.log(`--WHALE balance before swap :  ${AMOUNT_IN}`);
    // console.log(`out ${await tokenOut.balanceOf(TO)}`);

    console.log(`----- WHALE balance after swap => WBTC: ${await tokenIn.balanceOf(WHALE)} , DAI: ${await tokenOut.balanceOf(WHALE)} -----`);
    console.log(`----- Receiver balance after swap => WBTC: ${await tokenIn.balanceOf(TO)} , DAI: ${await tokenOut.balanceOf(TO)} -----`);

  });
});