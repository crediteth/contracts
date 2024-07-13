// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is Ownable {
    // TODO: optimize
    struct Company {
        uint registrationNumber;
        string countryCode;
    }

    mapping(address => Company) private addressToCompany;

    event CompanySet(address, Company);

    constructor() Ownable(msg.sender) {}

    function setCompany(
        address _address,
        Company calldata _company
    ) public onlyOwner {
        addressToCompany[_address] = _company;
        emit CompanySet(_address, _company);
    }

    function getCompany(
        address _address
    ) public view returns (uint, string memory) {
        return (
            addressToCompany[_address].registrationNumber,
            addressToCompany[_address].countryCode
        );
    }
}
