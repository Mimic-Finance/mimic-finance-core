const { assert } = require('chai');

const DaiToken = artifacts.require('Daitoken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()
function tokens(n){
    return web3.utils.toWei(n,'ether');
}
contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken , tokenFarm 

    before(async () => {
        // Load Contract
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
    
        // Transfer dapp token to token farm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
        // Transfer dai from act 0 -> act 1
        await daiToken.transfer(investor,tokens('100'),{from: owner})
    })

    describe('Dai Token deployment', async () => {
        it('Check Dai Token prerequisite', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token',"mDai Contract name correct")
            const sym = await daiToken.symbol()
            assert.equal(sym,'mDAI',"mDai Contract symbol correct")
            let supply = await daiToken.totalSupply()
            assert.equal(supply.toString(), tokens('1000000'),"mDai Contract total supply correct")
        })
    })

    describe('Dapp Token deployment', async () => {
        it('Check Dapp Token prerequisite', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token',"Dapp token name correct")
            const sym = await dappToken.symbol()
            assert.equal(sym,'DAPP',"Dapp token symbol correct")
            let supply = await dappToken.totalSupply()
            assert.equal(supply.toString(),tokens('1000000'),"Dapp token total supply correct")
        })
    })

    describe('Token Farm deployment', async () => {
        it('Check Token Farm deployment', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm',"Dapp Token Farm name correct")
        })
        it('Token Farm contract has Dapp tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'),"Token Farm contract have Dapp tokens")
        })
    })
    
    describe('Farming Token',async () => {
        it('Check Token Farm functions',async() =>{
            let result
            //check investor balance
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'),'investor mDai balance correct')
            //Stake mDai
            await daiToken.approve(tokenFarm.address,tokens('100'),{from:investor})
            await tokenFarm.stakeTokens(tokens('100'),{from:investor})
            //check investor wallet balance 
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor mDai balance correct')
            //check farming balance
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm mDai balance correct')
            //check investor staking balance 
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct')
            //check status 
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct')
            //Issue Token
            await tokenFarm.issueTokens({from:owner})
            //check issue token
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('100'),"investor Dapp Token wallet balance correct after issuance")
            //Ensure that the owner can be the one that can call issue token function
            await tokenFarm.issueTokens({from:investor}).should.be.rejected;
            //Unstake
            await tokenFarm.unstakeTokens(tokens('10'),{from:investor})
            //Check mDai balance in wallet
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('10'),'investor mDai wallet balance correct after unstake')
            //Check mDai balance in Token farm
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('90'), 'Token farm mDai balance correct after unstake')
            //Check Staking Balance
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(),tokens('90'),'investor staking balance correct')
            //Check Staking Status
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(),'false','investor staking status correct')
            
        })
    })

})