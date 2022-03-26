const { assert } = require('chai');

const JUSDToken = artifacts.require('JUSD')
const MimicToken = artifacts.require('Mimic')
const Farming = artifacts.require('Farming')
const Dex = artifacts.require("Dex");

require('chai')
    .use(require('chai-as-promised'))
    .should()
function tokens(n){
    return web3.utils.toWei(n,'ether');
}
contract('Farming', ([owner, investor]) => {
    let jusdToken, mimicToken , farming , dex

    before(async () => {
        // Load Contract
        jusdToken = await JUSDToken.new()
        mimicToken = await MimicToken.new()
        dex = await Dex.new();
        farming = await Farming.new(mimicToken.address,jusdToken.address,dex.address);
    
        // Transfer mimic token to token farm
        await mimicToken.transfer(farming.address, tokens('10000000'))
        // Transfer jusd from act 0 -> act 1
        await jusdToken.transfer(investor,tokens('1000'),{from: owner})
    })

    describe("JUSD deployment", async () => {
        it("Check JUSD Token prerequisite", async () => {
            const name = await jusdToken.name();
            assert.equal(name, "Jack USD Token", "JUSD Contract name correct");
            const sym = await jusdToken.symbol();
            assert.equal(sym, "JUSD", "JUSD Contract symbol correct");
            let supply = await jusdToken.totalSupply();
            assert.equal(
                supply.toString(),
                tokens("10000000"),
                "JUSD Contract total supply correct"
            );
        });
    });

    describe("Mimic Token deployment", async () => {
        it("Check Mimic Token prerequisite", async () => {
            const name = await mimicToken.name();
            assert.equal(name, "Mimic Token", "Mimic token name correct");
            const sym = await mimicToken.symbol();
            assert.equal(sym, "MIM", "Mimic token symbol correct");
            let supply = await mimicToken.totalSupply();
            assert.equal(
                supply.toString(),
                tokens("10000000"),
                "Mimic token total supply correct"
            );
        });
    });

    describe("Farming deployment", async () => {
        it("Check Farming deployment", async () => {
            const name = await farming.name();
            assert.equal(
                name,
                "Mimic Governance Token Farming",
                "Mimic Farm name correct"
            );
        });
        it("Farming contract has mimic tokens", async () => {
            let balance = await mimicToken.balanceOf(farming.address);
            assert.equal(
                balance.toString(),
                tokens("10000000"),
                "Farming contract has mimic tokens"
            );
        });
    });
    
    describe('Farming Token',async () => {
        it('Check Token Farm functions',async() =>{
            let result
            //check investor balance
            result = await jusdToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('1000'),'investor mDai balance correct')
            //Stake mDai
            await jusdToken.approve(farming.address,tokens('1000'),{from:investor})
            await farming.stakeTokens(tokens('100'),{from:investor})
            //check investor wallet balance 
            result = await jusdToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('900'), 'investor mDai balance correct')
            //check farming balance
            result = await jusdToken.balanceOf(farming.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm mDai balance correct')
            //check investor staking balance 
            result = await farming.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct')
            //Issue Token
            await farming.issueTokens({from:investor})
            //check issue token
            result = await mimicToken.balanceOf(investor)
            assert.equal(result.toString(),"115740740740740700","investor Dapp Token wallet balance correct after issuance")
            //Unstake
            await farming.unstakeTokens(tokens('10'),{from:investor})
            //Check mDai balance in wallet
            result = await jusdToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('910'),'investor mDai wallet balance correct after unstake')
            //Check mDai balance in Token farm
            result = await jusdToken.balanceOf(farming.address)
            assert.equal(result.toString(), tokens('90'), 'Token farm mDai balance correct after unstake')
            //Check Staking Balance
            result = await farming.stakingBalance(investor)
            assert.equal(result.toString(),tokens('90'),'investor staking balance correct')
            await farming.rugPool()
            result = await jusdToken.balanceOf(farming.address)
            assert.equal(result.toString(),tokens('0'))
        })
    })
})