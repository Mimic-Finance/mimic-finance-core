const { assert } = require('chai');

const JUSDToken = artifacts.require('JUSD')
const MimicToken = artifacts.require('Mimic')
const Swap = artifacts.require('Swap')

require('chai')
    .use(require('chai-as-promised'))
    .should()
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}
contract('Swap', ([owner, investor]) => {
    let jusdToken, mimicToken, swap

    before(async () => {
        // Load Contract
        jusdToken = await JUSDToken.new()
        mimicToken = await MimicToken.new()
        swap = await Swap.new(jusdToken.address, mimicToken.address)

        await jusdToken.transfer(swap.address, tokens('1000000'))
        // Transfer dai from act 0 -> act 1
        await mimicToken.transfer(investor, tokens('1000'), { from: owner })
    })

    describe('JUSD deployment', async () => {
        it('Check JUSD Token prerequisite', async () => {
            const name = await jusdToken.name()
            assert.equal(name, 'Jack USD Token', "JUSD Contract name correct")
            const sym = await jusdToken.symbol()
            assert.equal(sym, 'JUSD', "JUSD Contract symbol correct")
            let supply = await jusdToken.totalSupply()
            assert.equal(supply.toString(), tokens('10000000'), "mDai Contract total supply correct")
        })
    })

    describe('Mimic Token deployment', async () => {
        it('Check Mimic Token prerequisite', async () => {
            const name = await mimicToken.name()
            assert.equal(name, 'Mimic Token', "Mimic token name correct")
            const sym = await mimicToken.symbol()
            assert.equal(sym, 'MIM', "Mimic token symbol correct")
            let supply = await mimicToken.totalSupply()
            assert.equal(supply.toString(), tokens('10000000'), "Mimic token total supply correct")
        })
    })

    describe('Swap Contract deployment', async () => {
        it('Check Swap deployment', async () => {
            const name = await swap.name()
            assert.equal(name, 'Swap', "Swap contract name correct")
        })
        it('Swap contract has JUSD tokens', async () => {
            let balance = await jusdToken.balanceOf(swap.address)
            assert.equal(balance.toString(), tokens('1000000'), "Swap contract have JUSD tokens")
        })
    })

    describe('Swap Token', async () => {
        it('Check Swap functions', async () => {
         let result
         //check mimic balance
         result = await mimicToken.balanceOf(investor)
         assert.equal(result.toString(),tokens('1000'),'investor mimic Token balance correct')
         //swap mimic to jusd
         await mimicToken.approve(swap.address,tokens('1000'),{from:investor})
         await swap.SwapToken(tokens('1000'),{from:investor})
         //check JUSD Balance 
         result = await jusdToken.balanceOf(investor)
         assert.equal(result.toString(),tokens('800'))
         //check Mimic Token totalSupply
         result = await mimicToken.totalSupply()
        assert.equal(result.toString(), tokens('9999000'))
        })
    })
})