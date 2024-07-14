// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract CreditScore is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    event ScoreUpdated(string company, string score);
    event UpdateError(bytes32 indexed requestId, bytes err);

    string public chainlinkFunction;
    bytes32 public immutable donId;
    // company = registration number + country code
    mapping(string => string) private companyToScore;
    mapping(string => uint) private companyToLastUpdate;

    /**
     * @param _oracle Chainlink Router address - https://docs.chain.link/chainlink-functions/supported-networks
     * @param _donId oracle network ID
     * @param _chainlinkFunction The Chailink Function logic
     */
    constructor(
        address _oracle,
        bytes32 _donId,
        string memory _chainlinkFunction
    ) FunctionsClient(_oracle) {
        donId = _donId;
        chainlinkFunction = _chainlinkFunction;
    }

    /**
     * @param _args [registration number + country code] of the company
     * @param _subscriptionId The subscription ID that will be charged to service the request
     * @param _gasLimit The amount of gas that will be available for the fulfillment callback
     */
    function updateScore(
        string[] memory _args,
        uint64 _subscriptionId,
        uint32 _gasLimit
    ) public {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            chainlinkFunction
        );
        req.setArgs(_args);

        _sendRequest(req.encodeCBOR(), _subscriptionId, _gasLimit, donId);
    }

    /**
     * @notice Callback that is invoked once the DON has resolved the request or hit an error
     *
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length == 0) {
            emit UpdateError(requestId, err);
        } else {
            (string memory company, string memory score) = abi.decode(
                response,
                (string, string)
            );
            companyToScore[company] = score;
            companyToLastUpdate[company] = block.timestamp;
            emit ScoreUpdated(company, score);
        }
    }

    function getScore(string calldata _company) public view returns (string memory) {
        return companyToScore[_company];
    }

    function getCompany(string calldata _company) public view returns (uint) {
        return companyToLastUpdate[_company];
    }
}
