const { assert } = require('chai');

const Quoter = artifacts.require('Quoter')

require('chai')
    .use(require('chai-as-promised'))
    .should()
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}
contract('Swap', ([owner, investor]) => {
    let quoter
    before(async () => {
        // Load Contract
        quoter = await Quoter.new()
    })

    describe('Quoter function', async () => {
        it('Check Price feed', async () => {
            let result
            //check mimic balance
            quoter.pay({from:owner});
            console.log(quoter.balanceOf());
            // cjusdprice = await quoter.getEstimatedJUSDforCJUSD(tokens("1"));
            // console.log(cjusdprice);
        })
    })
})