// Deployed address of the TicketToken contract on Sepolia testnet
const CONTRACT_ADDRESS = '0x6Be3e7fBcE268036765bEAFf994D389Bfb038812';

// ABI describes every function and event the front end can call on the contract.
// Generated from Remix after compilation.
const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "initialSupply", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "buyTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "vendor",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ticketPrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_PER_TRANSACTION",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "paid", "type": "uint256" }
        ],
        "name": "TicketPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "vendor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "WithdrawalMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{ "indexed": true, "internalType": "address", "name": "vendor", "type": "address" }],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{ "indexed": true, "internalType": "address", "name": "vendor", "type": "address" }],
        "name": "Unpaused",
        "type": "event"
    }
];

// Shared state — set once on connection and reused across all page scripts
let web3;
let account;
let contract;

// Displays an error message in the modal overlay
function showError(msg) {
    $("#errorMessage").text(msg);
    $("#errorModal").css("display", "block");
}

// Extracts a plain-English message from a Web3/contract error.
// Checks for known revert reasons from the contract before falling back to a generic message.
function parseRevertReason(err) {
    const msg = err.message || '';
    if (msg.includes('User denied') || msg.includes('user rejected'))
        return 'Transaction cancelled in MetaMask.';
    if (msg.includes('Insufficient balance'))
        return 'You do not have enough TIX tokens.';
    if (msg.includes('Incorrect native currency sent'))
        return 'Wrong ETH amount sent — please check the price and try again.';
    if (msg.includes('Amount must be greater than zero'))
        return 'Amount must be at least 1.';
    if (msg.includes('Exceeds max per transaction'))
        return 'You cannot buy more than 10 tickets in one transaction.';
    if (msg.includes('Only vendor can withdraw'))
        return 'Only the venue can withdraw funds.';
    if (msg.includes('Allowance too low'))
        return 'Insufficient token allowance.';
    if (msg.includes('Transfer to zero address'))
        return 'Cannot transfer to the zero address.';
    if (msg.includes('Contract is paused'))
        return 'The contract is currently paused — please try again later.';
    if (msg.includes('Nothing to withdraw'))
        return 'There are no funds to withdraw.';
    return 'Transaction failed — please check your wallet and try again.';
}

// Requests wallet access from MetaMask, verifies the user is on Sepolia,
// and initialises the web3 + contract instances.
// Returns true on success, false if anything goes wrong.
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        showError('MetaMask not detected. Please install MetaMask.');
        return false;
    }
    web3 = new Web3(window.ethereum);
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];

        // Sepolia chainId is 11155111 — reject any other network to prevent accidental real-money transactions
        const chainId = await web3.eth.getChainId();
        if (chainId !== 11155111) {
            showError('Wrong network — please switch MetaMask to the Sepolia test network.');
            return false;
        }

        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return true;
    } catch (err) {
        // Code -32002 means a connection request is already pending in MetaMask
        if (err.code === -32002) {
            showError('MetaMask is already waiting for approval. Please check MetaMask.');
        } else {
            showError('Please connect MetaMask to Sepolia.');
        }
        return false;
    }
}
