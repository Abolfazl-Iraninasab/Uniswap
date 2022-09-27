const IERC20 = artifacts.require("IERC20") ;

contract("IERC20 contract testing" , async (accounts)=>{

    const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" ;
    const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' ;
    const WHALE = '0xB60C61DBb7456f024f9338c739B02Be68e3F545C' ;

    let contractDAI ;
    let contractWBTC ;
    before( async()=>{
        contractDAI = await IERC20.at(DAI) ;
        contractWBTC = await IERC20.at(WBTC) ;
    })

    describe("read balance of DAI WHALE : " , async ()=>{

        it("read DAI balance" , async ()=>{
            let bal = await contractDAI.balanceOf(WHALE) ;
            console.log(`DAI balance: ${bal}`);
        })

        it("read WBTC balance" , async ()=>{
            let bal = await contractWBTC.balanceOf(WHALE) ;
            console.log(`WBTC balance: ${bal}`);
        })    
    })

    describe("transfer DAi" , async()=>{

        it("transfer DAI" , async ()=>{
            let bal = await contractDAI.balanceOf(WHALE) ;
            await contractDAI.transfer(accounts[0],bal,{from : WHALE});
            console.log(`DAI value: ${bal} transfered from ${WHALE} to ${accounts[0]}`);
            bal = await contractDAI.balanceOf(WHALE) ;
            console.log(`new DAI balance of whale is : ${bal}`);
        })
    })

})

