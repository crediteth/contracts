// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is Ownable {
    // TODO: optimize
    // walletAddress => company (registration number + country code)
    mapping(address => string) private addressToCompany;

    event CompanySet(address _companyAddress, string _company);

    constructor() Ownable(msg.sender) {}

    function setCompany(
        address _address,
        string calldata _company
    ) public onlyOwner {
        addressToCompany[_address] = _company;
        emit CompanySet(_address, _company);
    }

    function getCompany(
        address _address
    ) public view returns (string memory) {
        return addressToCompany[_address];
    }
}
