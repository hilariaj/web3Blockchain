// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions{

    //Transaction counter
    uint256 transactionCount;

    //Transfer event
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //transfer object
    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;  
        string keyword;
    }

    TransferStruct[] transactions;


    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public{
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }


   //Checks all transactions made
    function getAllTransactions() public view returns(TransferStruct[] memory){
        return transactions; 
    }

    //Returns the number of transactions made
    function getTransactionCount() public view returns(uint256){
        return transactionCount;
    }

}