const BN = require("bn.js")
const { sendEther, pow } = require("./util")

const IERC20 = artifacts.require("IERC20")
const FlashSwap = artifacts.require("FlashSwap")

contract("FlashSwap", (accounts) => {
    const WHALE = "0xF84C43c00096740dbfd0FD019fE9804861f33914"           // USDC whale 
    const TOKEN_BORROW = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const DECIMALS = 6
    const FUND_AMOUNT = pow(10, DECIMALS).mul(new BN(2000000))
    const BORROW_AMOUNT = pow(10, DECIMALS).mul(new BN(1000000))

    let flashSwap
    let token
    before(async () => {
        token = await IERC20.at(TOKEN_BORROW)
        flashSwap = await FlashSwap.new()

        // WHALE should has some ETH to be able to send transaction
        await sendEther(web3, accounts[0], WHALE, 1)

        // send enough token to cover fee
        const bal = await token.balanceOf(WHALE)
        // USDC balance of whale should be greater than FUND_AMOUNT
        assert(bal.gte(FUND_AMOUNT), "balance < FUND")
        await token.transfer(flashSwap.address, FUND_AMOUNT, {
            from: WHALE,
        })
    })

    it("flash swap", async () => {
        const tx = await flashSwap.doFlashSwap(token.address, BORROW_AMOUNT, {
            from: WHALE,
        })

        for (const log of tx.logs) {
            console.log(log.args.message, log.args.val.toString())
        }
    })
})