const GasToken1Contract = artifacts.require('./GasToken1.sol');

module.exports = async (deployer) => {
    await deployer.deploy(GasToken1Contract);
};
