pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./GasToken1.sol";


contract DummyContract is Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) private balances;
    address private gasToken1Address;
    bool private useGasToken1;

    constructor(address _gasToken1Address) public {
        require(_gasToken1Address != address(0), 'must have GasToken1 address');
        gasToken1Address = _gasToken1Address;
    }

    function addBalances(address[] memory recipients, uint256[] memory amounts) public onlyOwner {
        require(recipients.length > 0, 'At least one recipient required');
        require(recipients.length == amounts.length, 'recipients and amounts must match');

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

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                // Skip the zero address.
                continue;
            }
            // Increase address' balance.
            balances[recipients[i]] = balances[recipients[i]].add(amounts[i]);
        }
    }

    function balanceOf(address addr) external view returns(uint256) {
        return balances[addr];
    }

    function toggleUseGasToken1() public {
        useGasToken1 = !useGasToken1;
    }
    function usingGasToken1() external view returns(bool) {
        return useGasToken1;
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
