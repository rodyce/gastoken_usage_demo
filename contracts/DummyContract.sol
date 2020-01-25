pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./GasToken1.sol";


contract DummyContract is Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) private balances;
    address public gasToken1Address;
    bool public useGasToken1;

    constructor(address _gasToken1Address) public {
        require(_gasToken1Address != address(0), 'must have GasToken1 address');
        gasToken1Address = _gasToken1Address;
        useGasToken1 = false;
    }

    function addBalances(address[] memory addresses, uint256[] memory amounts) public onlyOwner {
        require(addresses.length > 0, 'At least one recipient required');
        require(addresses.length == amounts.length, 'addresses and amounts must match');

        if (useGasToken1) {
            // Use half of the gas token balance.
            // NOTE: It would be better to estimate of this transaction's gas usage.
            // In this function, arrays might have any length. That is why
            // that is not done here for tests purposes.
            GasToken1 gasToken1 = GasToken1(gasToken1Address);
            uint256 thisBalance = gasToken1.balanceOf(address(this));
            // Note that if balance is zero, no refund there is going to be.
            // More gas ends up spent.
            gasToken1.free(thisBalance.div(2));
        }

        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == address(0)) {
                // Skip the zero address.
                continue;
            }
            // Increase address' balance.
            balances[addresses[i]] = balances[addresses[i]].add(amounts[i]);
        }
    }

    function balanceOf(address addr) external view returns(uint256) {
        return balances[addr];
    }

    function usingGasToken1() external view returns(bool) {
        return useGasToken1;
    }
    function setUseGasToken1(bool value) public {
        useGasToken1 = value;
    }

    function mintGasToken1(uint256 units) public {
        GasToken1 gasToken1 = GasToken1(gasToken1Address);
        gasToken1.mint(units);
    }
    function freeGasToken1(uint256 units) public {
        GasToken1 gasToken1 = GasToken1(gasToken1Address);
        gasToken1.free(units);
    }
}
