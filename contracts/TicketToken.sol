// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicketToken {
    string public name = "EventTicket";
    string public symbol = "TIX";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public vendor;
    uint256 public ticketPrice = 0.01 ether;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TicketPurchased(address indexed buyer, uint256 amount, uint256 paid);

    constructor(uint256 initialSupply) {
        vendor = msg.sender;
        _mint(vendor, initialSupply * 10 ** decimals);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return allowances[owner][spender];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowances[from][msg.sender] >= amount, "Allowance too low");
        allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    function buyTicket(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero");
        uint256 price = ticketPrice * amount;
        require(msg.value == price, "Incorrect native currency sent");
        _transfer(vendor, msg.sender, amount * 10 ** decimals);
        emit TicketPurchased(msg.sender, amount, msg.value);
    }

    function withdrawFunds() external {
        require(msg.sender == vendor, "Only vendor can withdraw");
        payable(vendor).transfer(address(this).balance);
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(balances[from] >= amount, "Insufficient balance");
        balances[from] -= amount;
        balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        totalSupply += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
