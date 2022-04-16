
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlockVote is ERC20{
    address public owner;
    uint256 public totalTokenSupply =0;
    constructor() ERC20("Block Vote Token", "BVT"){
        owner = msg.sender;
    }

    modifier isOwner(){
        require(msg.sender==owner , "access denied");
        _;
    }

    function mintTokens(address account, uint256 amount)public isOwner(){
        _mint(account, amount);
        totalTokenSupply += amount;
    }

    function burnTokens(uint256 amount)public{
        _burn(msg.sender,amount);
        totalTokenSupply -= amount;
    }
    
    function userBalance()public view returns(uint){
        return balanceOf(msg.sender);
    }

    function totalTokenAmount()public view returns(uint256){
        return totalTokenSupply;
    }

    function currentOwner() public view returns(address){
        return owner;
    }

    function transferOwnership(address account) public isOwner(){
        owner = account;
    }
    
}