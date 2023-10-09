// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AirdropMachine {
    constructor() {}

    function distribute(
        address from,
        address[] memory targets,
        uint256 amount,
        address token
    ) public {
        require(
            ERC20(token).balanceOf(from) > amount * targets.length,
            "Caller does not have enough token on his wallet"
        );

        for (uint i; i < targets.length; i++) {
            ERC20(token).transferFrom(from, targets[i], amount);
        }
    }
}
