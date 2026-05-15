# Rubric TODO — What's Left for 100%

---

## 1. AI-ENHANCED CODE REVIEW PROCESS (25%)

- [x] **Initialise a git repo** — repo exists with commits on `main`
- [x] **Create a GitHub repo** — exists at https://github.com/Aoibheannmangan/blockchainproject
- [ ] **Open a Pull Request** (feature branch → main) so there is a reviewable PR URL
- [x] **Document the AI review process** — `REVIEW.md` created with 14 findings, resolutions, and severity ratings
- [ ] **Fill in the PR link and final commit hash** in `REVIEW.md` (do this after opening the PR)

---

## 2. FRONT END VALIDATION & ARCHITECTURE (30%)

### 2.1 Wallet Creation — `pages/index.html`
- [x] Visible security warning banner on every page
- [x] Key generation (wallet created locally with no network call)
- [x] Private key display with blur/show toggle
- [x] Secure download (keystore encrypted with password, downloaded as JSON)
- [x] Password strength indicator (Weak / OK / Strong)
- [x] Sensitive fields cleared on page navigation (`beforeunload`)

### 2.2 Balance Check — `pages/balances.html`
- [x] **Attendee view** — connected wallet's ETH + TIX balance
- [x] **Doorman view** — look up any address's TIX balance, shows "Valid ticket holder" / "No tickets — entry denied"
- [x] **Venue view** — contract ETH balance, vendor TIX balance, total supply
- [ ] Auto-refresh balances from `buy.html` / `transfer.html` without a manual button click (cross-page auto-refresh — would need localStorage or URL params)

### 2.3 Ticket Purchase — `pages/buy.html`
- [x] "Transaction pending..." loading state while MetaMask is processing
- [x] Transaction hash shown as a Sepolia Etherscan link after success
- [x] Contract revert reasons parsed into plain English via `parseRevertReason()`
- [x] Amount validated > 0 and <= 10 before any transaction is sent
- [x] ETH balance pre-checked before sending

### 2.4 Token Transfer — `pages/transfer.html`
- [x] "Return to Vendor" button with vendor address pre-filled
- [x] Sender TIX balance shown and auto-refreshed after a successful transfer
- [x] Transaction hash shown as a Sepolia Etherscan link after success
- [x] TIX balance pre-checked before sending

---

## 3. BLOCKCHAIN MANAGEMENT & REPORTING (30%)

### 3.1 Smart Contract — `contracts/TicketToken.sol`
- [x] `nonReentrant` modifier applied to `buyTicket` and `withdrawFunds`
- [x] `WithdrawalMade` event emitted in `withdrawFunds`
- [x] `unchecked` blocks on balance arithmetic in `_transfer` and `_mint`
- [x] NatSpec comments (`/// @notice`, `/// @dev`) on every function
- [x] `whenNotPaused` modifier + `pause()` / `unpause()` (vendor only)
- [x] `MAX_PER_TRANSACTION = 10` cap enforced in `buyTicket`
- [x] Zero-address checks on `transfer` and `transferFrom`
- [ ] Cache `10 ** decimals` as a named constant (`DECIMALS_FACTOR`) — currently computed inline
- [ ] **Redeploy to Sepolia** after the above changes and update `CONTRACT_ADDRESS` in `contract.js`

### 3.2 Project Submission Structure (5%)
- [x] `pages/` folder contains all HTML, `contract.js`, `styles.css`
- [x] `contracts/TicketToken.sol` present
- [x] `REVIEW.md`, `REPORT.md`, `TESTING.md`, `README.md` all created
- [ ] Fill in personal sections of `REPORT.md` (your own words + Sepolia tx links)
- [ ] Fill in manual test results in `TESTING.md` (run on Sepolia, paste tx hashes)
- [ ] Zip the final project for submission

### 3.3 Report — `REPORT.md`
- [x] File created with all required sections and structure
- [ ] **Fill in your own commentary** — technology choices, design decisions, reflection (cannot be AI-generated)
- [ ] **Paste Sepolia Etherscan links** for a `buyTicket` tx, `transfer` tx, and `withdrawFunds` tx

---

## 4. MANAGERIAL OVERSIGHT & QA (15%)

### 4.1 Human-Written Documentation
- [x] Comments on every function in `contract.js` explaining the why
- [x] Comments in every page's `<script>` block
- [x] Solidity NatSpec (`/// @notice`, `/// @dev`) on every function in `TicketToken.sol`

### 4.2 Code Efficiency
- [x] `unchecked` arithmetic in `_transfer` and `_mint`
- [x] `connectMetaMask()` called once on load; click handlers only reconnect if `!web3 || !account`
- [ ] `DECIMALS_FACTOR` constant (minor — `10 ** decimals` still computed inline)

### 4.3 Error Handling
- [x] `parseRevertReason()` maps all contract revert strings to plain English
- [x] Buttons disabled and labelled "Pending..." during transactions
- [x] Inputs validated (amount > 0, valid address, sufficient balance) before any transaction

### 4.4 Testing
- [x] `TESTING.md` created with 16 test cases covering all major flows
- [x] `test/TicketToken.test.js` written with automated Hardhat unit tests (30 cases)
- [ ] **Run each manual test case on Sepolia** and fill in pass/fail + tx hashes in `TESTING.md`
- [ ] Run `npx hardhat test` and paste output into `TESTING.md` (needs Hardhat install to complete)

---

## What Still Needs You (cannot be done by AI)

| Item | Why it needs you |
|---|---|
| Open a PR on GitHub | Requires pushing a branch and clicking on GitHub |
| Fill in `REPORT.md` personal sections | Rubric explicitly says not AI-generated |
| Paste Sepolia tx links in `REPORT.md` | Only your wallet has these transactions |
| Run manual tests on Sepolia + fill in `TESTING.md` | Requires MetaMask + live testnet |
| Redeploy contract to Sepolia | Requires your MetaMask and Sepolia ETH |
| `npm install` + `npx hardhat test` | Needs the install to complete (had network issues) |
