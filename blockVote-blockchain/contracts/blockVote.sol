
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

    struct Proposal{
        uint256 pid;
        string status;
    }
    mapping(uint256 => Proposal) public allProposals;
    uint256 public totalProp=0;


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

    function createNewProposal(uint _pid, string calldata _status)external{
        require(userBalance()> 0 || msg.sender== owner, "not allowed");
        totalProp++;
        Proposal memory newProp;
        newProp.pid = _pid;
        newProp.status =  _status;
        allProposals[_pid] = newProp;
    }

    function checkProposalStatus(uint _pid) external view returns(string memory) {
        return allProposals[_pid].status;
    }
    function changeStatus(uint _pid,string calldata _status) external isOwner(){
        allProposals[_pid].status = _status;
    }
    function totalProposals()public view returns(uint256){
        return totalProp;
    }
}