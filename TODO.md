# Rubric TODO — What's Left for 100%

---

## 1. AI-ENHANCED CODE REVIEW PROCESS (25%)

> **Currently: nothing done here — this is the biggest risk to your grade.**

- [ ] **Initialise a git repo** (`git init`) and make proper commits with descriptive messages
- [ ] **Create a GitHub repo** and push the project
- [ ] **Open a Pull Request** (e.g. a feature branch → main) so there is a reviewable PR URL
- [ ] **Document the AI review process** — add a file (e.g. `REVIEW.md`) that logs:
  - The PR link
  - AI-generated review comments
  - How you resolved each comment
  - The final commit hash after resubmission
- [ ] Make sure every step has a **traceable link** (PR → comment → fix → commit hash)

---

## 2. FRONT END VALIDATION & ARCHITECTURE (30%)

### 2.1 Wallet Creation — `index.html` ✅ mostly done
- [✅ ] Add a **visible security warning** on the page telling the user never to share their private key (rubric checks that you validated the AI's approach to key management)
- [ ] Confirm the three requirements are clearly met on the page: key generation, display, and secure download

### 2.2 Balance Check — `balances.html` ❌ major gap
> Rubric requires **distinct logic for three actor roles: attendee, doorman, venue**. Right now the page just shows the connected wallet's balance — no role separation at all.

- [✅ ] Split the balances page into **three role views**:
  - **Attendee** — shows their own ETH + TIX balance (current behaviour)
  - **Doorman** — input any wallet address, look up that address's TIX balance to verify a ticket at the door
  - **Venue/Vendor** — shows the contract's ETH balance (funds collected) + vendor's TIX balance + total supply
- [ ] Add **auto-refresh** after any buy/transfer action so balances update without a manual button click

### 2.3 Ticket Purchase — `buy.html` ❌ needs UX work
- [ ] Show a **"Transaction pending…"** loading state while MetaMask is processing
- [ ] Show the **transaction hash** as a Sepolia Etherscan link after a successful purchase
- [ ] **Parse contract revert reasons** from the error message and show them in plain English (e.g. "Incorrect native currency sent" → "Wrong ETH amount — please try again")
- [ ] Validate that amount > 0 before sending the transaction

### 2.4 Token Transfer — `transfer.html` ❌ needs specific feature
- [ ] Add a **"Return to Vendor" button** with the vendor address pre-filled — the rubric explicitly mentions transferring tokens back to the vendor
- [ ] **Auto-refresh balances** (both sender and recipient) after a successful transfer to prove the contract state updated correctly
- [ ] Show the transaction hash as a Sepolia Etherscan link after success

---

## 3. BLOCKCHAIN MANAGEMENT & REPORTING (30%)

### 3.1 Smart Contract — `contracts/TicketToken.sol` ❌ needs security + gas work
- [ ] Add a **ReentrancyGuard** — the rubric explicitly calls this out as an expected security pattern. Import from OpenZeppelin or write a simple `nonReentrant` modifier manually, and apply it to `withdrawFunds`
- [ ] Add a `WithdrawalMade` **event** to `withdrawFunds` so it is traceable on-chain
- [ ] Use **`unchecked`** blocks around balance arithmetic where underflow/overflow is already guarded (e.g. inside `_transfer` after the `require`) to save gas
- [ ] Cache `10 ** decimals` as an **immutable constant** (`uint256 public constant DECIMALS_FACTOR = 10 ** 18`) instead of computing it each call
- [ ] Redeploy to Sepolia after changes and update `CONTRACT_ADDRESS` in `contract.js`

### 3.2 Project Submission Structure (5%)
- [ ] Organise the final zip so it contains:
  - All HTML pages (`index.html`, `balances.html`, `buy.html`, `transfer.html`)
  - `contract.js`, `styles.css`
  - `contracts/TicketToken.sol`
  - `REVIEW.md` (AI review log)
  - `REPORT.md` (see below)
  - `TESTING.md` (see below)
- [ ] Double-check nothing is missing before zipping

### 3.3 Report — `REPORT.md` ❌ completely missing
> This file does not exist yet and is worth 10% of your grade.

- [ ] Create `REPORT.md` and include:
  - An explanation of **why you chose web3.js + jQuery** over ethers.js
  - A walkthrough of the **smart contract design decisions** (ERC-20 base, SETH purchase extension, reentrancy guard)
  - **Transaction links** — paste Sepolia Etherscan links for at least: a `buyTicket` tx, a `transfer` tx, and a `withdrawFunds` tx
  - Commentary on each transaction confirming it succeeded and what you verified
  - An explanation of **why the three actor roles** were separated in the balance page
  - Your own commentary — not AI-generated text

---

## 4. MANAGERIAL OVERSIGHT & QA (15%)

### 4.1 Human-Written Documentation ❌ no comments exist
- [ ] Add short, human-written comments to every function in `contract.js` and each page's `<script>` block explaining **why** the logic works that way (not just what it does)
- [ ] Add **Solidity NatSpec comments** (`/// @notice`, `/// @dev`) to each function in `TicketToken.sol`

### 4.2 Code Efficiency ❌ not addressed
- [ ] In the contract: apply the `unchecked` and `DECIMALS_FACTOR` improvements from 3.1 above
- [ ] In the frontend: avoid calling `connectMetaMask()` on every button click if already connected — check `if (!account)` once at load and store the result

### 4.3 Error Handling ❌ currently generic
- [ ] Replace the raw `err.message` output with a **human-readable message parser** — extract the revert reason string from the error and display that instead
- [ ] Add a **loading/disabled state** on every button while a transaction is pending so the user cannot double-submit
- [ ] Validate inputs **before** sending any transaction (amount > 0, address is valid, sufficient balance)

### 4.4 Testing — `TESTING.md` ❌ completely missing
- [ ] Create `TESTING.md` documenting test cases, for example:
  - Buy 1 ticket with correct ETH → expect success + balance increase
  - Buy 1 ticket with wrong ETH amount → expect revert "Incorrect native currency sent"
  - Transfer to invalid address → expect frontend validation error
  - Transfer more tickets than balance → expect revert "Insufficient balance"
  - Doorman looks up an address with 0 tickets → expect 0 displayed
  - Non-vendor calls `withdrawFunds` → expect revert "Only vendor can withdraw"
- [ ] Run each test case manually on Sepolia and paste the result (pass/fail + tx hash or screenshot) into `TESTING.md`

---

## Quick Priority Order

| Priority | Item | Rubric weight |
|---|---|---|
| 1 | Git repo + PR + `REVIEW.md` | 25% |
| 2 | `REPORT.md` | 10% |
| 3 | Three-role balance page | 10% |
| 4 | Add ReentrancyGuard + redeploy | 15% |
| 5 | `TESTING.md` | 5% |
| 6 | Transaction hash links + loading states in buy/transfer | 10% |
| 7 | "Return to Vendor" button in transfer | 5% |
| 8 | Code comments + NatSpec | 5% |
| 9 | Efficiency (unchecked, constants) | 2.5% |
| 10 | Submission zip structure | 5% |
