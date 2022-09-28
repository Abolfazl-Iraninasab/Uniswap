// for using BN.js library uncomment lines below :
// const BN = require("bn.js");
// const {pow } = require("./utils");

const BN = web3.utils.BN; // web3 bigNumber library (is used instead of BN.js)

const IERC20 = artifacts.require("IERC20");
const uniswapLiquidity = artifacts.require("uniswapLiquidity");

contract("uniswapLiquidity", (accounts) => {
    const USER = accounts[0];
    const WHALE = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
    const TOKEN_A = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";           // WETH
    const TOKEN_B = "0x6B175474E89094C44Da98b954EedeAC495271d0F";           // DAI
    const TOKEN_A_AMOUNT = web3.utils.toBN(10 ** 20);
    const TOKEN_B_AMOUNT = web3.utils.toBN(10 ** 20);

    //   const TOKEN_A_AMOUNT  = pow(10, 18);                               // for BN.js
    //   const TOKEN_B_AMOUNT  = pow(10, 18);                               // for BN.js

    let contract;
    let tokenA;
    let tokenB;
    before(async () => {
        tokenA = await IERC20.at(TOKEN_A);
        tokenB = await IERC20.at(TOKEN_B);
        contract = await uniswapLiquidity.new();
    });

    describe("add and remove liquidity by forking mainnet", async () => {

        before(async () => {
            await tokenA.transfer(USER, web3.utils.toBN(10 ** 20), {
                from: WHALE,
            });
            await tokenB.transfer(USER, TOKEN_B_AMOUNT, { from: WHALE });

            await tokenA.approve(contract.address, web3.utils.toBN(10 ** 20), {
                from: USER,
            });
            await tokenB.approve(contract.address, TOKEN_B_AMOUNT, {
                from: USER,
            });
        });

        it("add liquidity", async () => {
            let tx1 = await contract.addLiquidity(
                tokenA.address,
                tokenB.address,
                TOKEN_A_AMOUNT,
                TOKEN_B_AMOUNT,
                {
                    from: USER,
                }
            );

            const event1 = tx1.logs[0].args;
            console.log(
                `liquidity added => amountA: ${event1.amountA} ,
                amountB: ${event1.amountB} ,
                liquidity pool token: ${event1.amountLiquidity}`
            );
        });

        it("remove liquidity", async () => {
            let tx2 = await contract.removeLiquidity(
                tokenA.address,
                tokenB.address,
                {
                    from: USER,
                }
            );

            const event2 = tx2.logs[0].args;
            console.log(`liquidity removed => amountA: ${event2.amountA} ,
                amountB: ${event2.amountB} 
            `);
        });

    });
    
});

// ganache-cli  --fork https://mainnet.infura.io/v3/5bc20cad614a4604b5a4ee51e8023cb9  --unlock 0xf584F8728B874a6a5c7A8d4d387C9aae9172D621  --networkId 999
