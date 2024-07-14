// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is Ownable {
    // TODO: optimize
    // walletAddress => company (registration number + country code)
    mapping(address => string) private addressToCompany;
    // walletAddress => company (hashed proof - published on IPFS)
    mapping(address => bytes32) private addressToProof;

    event CompanySet(address companyAddress, string company, bytes32 proof);

    constructor() Ownable(msg.sender) {}

    function setCompany(
        address _address,
        string calldata _company,
        bytes32 _proof
    ) public onlyOwner {
        addressToCompany[_address] = _company;
        addressToProof[_address] = _proof;
        emit CompanySet(_address, _company, _proof);
    }

    function getCompany(
        address _address
    ) public view returns (string memory) {
        return addressToCompany[_address];
    }

    function getProof(
        address _address
    ) public view returns (bytes32) {
        return addressToProof[_address];
    }
}
