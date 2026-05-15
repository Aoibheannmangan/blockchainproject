# Blockchain Ticketing DApp

A decentralised event ticketing application built on the Ethereum Sepolia testnet. Attendees can purchase ERC-20 ticket tokens (TIX) using ETH, transfer them to others, and venue staff can verify ticket holders at the door.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity 0.8.20 |
| Blockchain network | Ethereum Sepolia testnet |
| Frontend | HTML5, CSS3, jQuery 3.5.1 |
| Web3 library | web3.js |
| Wallet | MetaMask browser extension |
| Unit tests | Hardhat + Chai + ethers.js |

---

## Project Structure

```
blockchainproject/
├── contracts/
│   └── TicketToken.sol       # ERC-20 token contract with purchase logic
├── pages/
│   ├── index.html            # Create a new wallet (keystore generation)
│   ├── balances.html         # Check balances (3 role views)
│   ├── buy.html              # Purchase TIX tokens with ETH
│   ├── transfer.html         # Transfer TIX to another address
│   ├── contract.js           # Shared Web3 setup, ABI, and helpers
│   └── styles.css            # Global styles
├── test/
│   └── TicketToken.test.js   # Hardhat unit tests for the contract
├── assets/                   # SVG icons
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

---

## Pages

### Create Wallet (`index.html`)
Generates a new Ethereum wallet entirely in the browser — no network calls are made. Displays the address, private key (hidden by default), and an encrypted keystore file that can be downloaded. Includes a password strength indicator.

### Balances (`balances.html`)
Three role views accessed via tabs:
- **Attendee** — shows the connected wallet's ETH and TIX balance
- **Doorman** — looks up any wallet address's TIX balance to verify entry at the door
- **Venue** — shows the contract's accumulated ETH, the vendor's remaining TIX, and total supply

### Buy Ticket (`buy.html`)
Lets an attendee purchase 1–10 TIX tokens per transaction. Calculates the exact ETH cost (0.01 ETH per ticket), checks the wallet has enough ETH before sending, and shows a Sepolia Etherscan link after success.

### Transfer Ticket (`transfer.html`)
Transfers TIX tokens to any valid address. Includes a **Return to Vendor** button that pre-fills the vendor's address. Checks the sender's balance before sending and shows a Sepolia Etherscan link on success.

---

## Smart Contract

**Address (Sepolia):** `0x6Be3e7fBcE268036765bEAFf994D389Bfb038812`

**Token:** EventTicket (TIX) — ERC-20, 18 decimals  
**Ticket price:** 0.01 ETH  
**Max per transaction:** 10

### Security features
- `nonReentrant` modifier on `buyTicket` and `withdrawFunds` — prevents re-entrancy attacks
- `whenNotPaused` modifier on `buyTicket`, `transfer`, and `transferFrom` — vendor can halt the contract in an emergency
- Zero-address checks on all transfer functions
- `MAX_PER_TRANSACTION` cap to prevent supply hoarding
- `unchecked` arithmetic inside `_transfer` and `_mint` where overflow/underflow is already guarded — saves gas
- All significant state changes emit events for on-chain traceability

---

## Running the Unit Tests

```bash
npm install
npx hardhat test
```

Tests cover deployment, `buyTicket`, `transfer`, `transferFrom`, `withdrawFunds`, and `pause`/`unpause` — including both happy paths and all revert conditions.

---

## Setup (for development)

1. Install [MetaMask](https://metamask.io/) and switch to the **Sepolia** test network
2. Get Sepolia ETH from a faucet (e.g. https://sepoliafaucet.com)
3. Open `pages/index.html` in a browser (or serve from a local server)
4. Connect MetaMask when prompted

> **Security notice:** This application runs on the Sepolia testnet only. Never use real ETH or share your private key with anyone.
