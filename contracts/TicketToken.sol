// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title  TicketToken — ERC-20 event ticket with a built-in purchase mechanism
/// @notice Attendees buy TIX tokens by sending ETH to buyTicket().
///         The vendor (deployer) holds the initial supply and collects all ETH paid.
contract TicketToken {
    string public name = "EventTicket";
    string public symbol = "TIX";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // The deployer becomes the vendor and receives all ticket sale proceeds
    address public vendor;

    // Price per ticket in wei — 0.01 ETH
    uint256 public ticketPrice = 0.01 ether;

    // Max tickets buyable in one transaction — prevents a single wallet hoarding supply
    uint256 public constant MAX_PER_TRANSACTION = 10;

    // Reentrancy guard — prevents re-entrant calls on state-changing functions
    bool private _locked;

    // Emergency pause — vendor can halt purchases and transfers if needed
    bool public paused;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TicketPurchased(address indexed buyer, uint256 amount, uint256 paid);
    event WithdrawalMade(address indexed vendor, uint256 amount);
    event Paused(address indexed vendor);
    event Unpaused(address indexed vendor);

    /// @dev Blocks re-entrant calls by locking execution for the duration of the function
    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    /// @dev Blocks execution when the contract is paused by the vendor
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    /// @notice Mints the entire initial supply to the deployer (vendor)
    constructor(uint256 initialSupply) {
        vendor = msg.sender;
        _mint(vendor, initialSupply * 10 ** decimals);
    }

    /// @notice Returns the TIX balance of a given address
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /// @notice Returns how many tokens `spender` is allowed to move on behalf of `owner`
    function allowance(address owner, address spender) external view returns (uint256) {
        return allowances[owner][spender];
    }

    /// @notice Transfers tokens from the caller to `to`
    function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
        require(to != address(0), "Transfer to zero address");
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Approves `spender` to spend up to `amount` tokens on the caller's behalf
    function approve(address spender, uint256 amount) external returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice Moves tokens on behalf of `from`, consuming the caller's allowance
    function transferFrom(address from, address to, uint256 amount) external whenNotPaused returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(allowances[from][msg.sender] >= amount, "Allowance too low");
        unchecked { allowances[from][msg.sender] -= amount; }
        _transfer(from, to, amount);
        return true;
    }

    /// @notice Purchase `amount` tickets by sending the exact ETH price.
    ///         Protected against re-entrancy and capped at MAX_PER_TRANSACTION.
    function buyTicket(uint256 amount) external payable nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= MAX_PER_TRANSACTION, "Exceeds max per transaction");
        uint256 price = ticketPrice * amount;
        require(msg.value == price, "Incorrect native currency sent");
        _transfer(vendor, msg.sender, amount * 10 ** decimals);
        emit TicketPurchased(msg.sender, amount, msg.value);
    }

    /// @notice Allows the vendor to withdraw all accumulated ETH from ticket sales.
    ///         Emits WithdrawalMade so every withdrawal is traceable on-chain.
    function withdrawFunds() external nonReentrant {
        require(msg.sender == vendor, "Only vendor can withdraw");
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw");
        emit WithdrawalMade(vendor, amount);
        payable(vendor).transfer(amount);
    }

    /// @notice Vendor can pause the contract to halt purchases and transfers in an emergency
    function pause() external {
        require(msg.sender == vendor, "Only vendor can pause");
        paused = true;
        emit Paused(vendor);
    }

    /// @notice Vendor can unpause the contract to resume normal operation
    function unpause() external {
        require(msg.sender == vendor, "Only vendor can unpause");
        paused = false;
        emit Unpaused(vendor);
    }

    /// @dev Internal transfer — checks balance then updates both accounts atomically.
    ///      unchecked is safe here because the require above already guards against underflow.
    function _transfer(address from, address to, uint256 amount) internal {
        require(balances[from] >= amount, "Insufficient balance");
        unchecked {
            balances[from] -= amount;
            balances[to] += amount;
        }
        emit Transfer(from, to, amount);
    }

    /// @dev Increases total supply and credits `account` — only called in the constructor
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        totalSupply += amount;
        unchecked { balances[account] += amount; }
        emit Transfer(address(0), account, amount);
    }
}
