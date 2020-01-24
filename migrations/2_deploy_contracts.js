const GasToken1 = artifacts.require('./GasToken1.sol');
const DummyContract = artifacts.require('./DummyContract.sol');


module.exports = async (deployer) => {
    await deployer.deploy(GasToken1);
    await deployer.deploy(DummyContract, GasToken1.address);
};
