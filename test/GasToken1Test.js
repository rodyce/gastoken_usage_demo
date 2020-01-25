const GasToken1 = artifacts.require('./GasToken1.sol');
const DummyContract = artifacts.require('./DummyContract.sol');


contract('GasToken1', function(accounts) {
    const addresses = [
        '0xD5FB96715a72967dA87EA8a8B18bca469F20A16f',
        '0xBdEf2a8ada23e1b1AB2ffeD22D13e97055d19570',
        '0xC9c0C8f230DbEA5627aEc86F05962e3Ae99eD590',
        '0x848A62dBfC4D2630b6b57f985c1b15829457F9B1',
        '0xc2638419Bbf6567D22551272d3a67BDf17FE020b'
    ];
    const amounts = [
        '1056576048204218022912000',
        '1061972041895000000000000',
        '1058056042252000000000000',
        '1085402043920218022912000',
        '1056310039858000000000000'
    ]
    const MAX_GT1 = 325;

    let gasToken1;
    let dummyContract;
    let gasUsed1;
    let gasUsed2;


    beforeEach(async () => {
        gasToken1 = await GasToken1.deployed();
        dummyContract = await DummyContract.deployed();
        await dummyContract.mintGasToken1(MAX_GT1, {from: accounts[0]});
    });


    it('Obtain gas used without using Gas Token 1', async () => {
        await dummyContract.setUseGasToken1(false);

        await dummyContract.addBalances(addresses, amounts);

        const tx = await dummyContract.addBalances(addresses, amounts);
        gasUsed1 = tx.receipt.gasUsed;
    });

    it('Test that gas used without using Gas Token 1 is the same as before', async () => {
        await dummyContract.setUseGasToken1(false);

        const tx = await dummyContract.addBalances(addresses, amounts);
        gasUsed2 = tx.receipt.gasUsed;

        expect(gasUsed1).to.be.equal(gasUsed2);
    });

    it('Test that gas used with gas token activated is LESS THAN before', async () => {
        // Do use Gas Token.
        await dummyContract.setUseGasToken1(true);

        const balanceA = await gasToken1.balanceOf(dummyContract.address);
        const tx = await dummyContract.addBalances(addresses, amounts);
        const balanceB = await gasToken1.balanceOf(dummyContract.address);

        assert(balanceB < balanceA,
            `Gas Token 1 units must have been freed ${balanceB} >= ${balanceB}`);

        // TODO: failing...
        assert(tx.receipt.gasUsed <= gasUsed2,
            `gas used with Gas Token 1 must be less than without it ${tx.receipt.gasUsed} > ${gasUsed2}`);
    });
});
