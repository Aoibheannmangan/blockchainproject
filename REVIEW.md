# AI-Enhanced Code Review Log

This document records the AI-assisted code review process for the TicketToken DApp. An AI assistant (Claude) reviewed the codebase, identified issues across security, UX, and code quality, and each finding was resolved with a concrete code change.

---

## Pull Request

> **PR link:** _(add link after opening PR on GitHub)_  
> **Base branch:** `main`  
> **Feature branch:** `feature/security-and-ux`  
> **Final commit hash:** _(add hash after final commit)_

---

## Review Round 1 — Smart Contract Security

The AI reviewed `contracts/TicketToken.sol` and identified the following issues:

---

### Finding 1 — No reentrancy protection on `withdrawFunds`

**Severity:** High  
**AI comment:**
> `withdrawFunds` calls `payable(vendor).transfer(amount)` after reading the balance but has no guard against re-entrancy. If the vendor address is a contract, it could re-enter before state updates. A `nonReentrant` modifier should be applied.

**Resolution:** A `nonReentrant` modifier was implemented using a private `_locked` boolean flag. It is applied to both `withdrawFunds` and `buyTicket`.

```solidity
modifier nonReentrant() {
    require(!_locked, "Reentrant call");
    _locked = true;
    _;
    _locked = false;
}
```

---

### Finding 2 — No emergency pause mechanism

**Severity:** Medium  
**AI comment:**
> There is no way for the vendor to halt the contract if a vulnerability is discovered or an event is cancelled. An emergency pause pattern should be implemented.

**Resolution:** A `paused` boolean and `whenNotPaused` modifier were added. `pause()` and `unpause()` functions (vendor-only) were added. The modifier is applied to `buyTicket`, `transfer`, and `transferFrom`.

---

### Finding 3 — No cap on tickets per transaction

**Severity:** Medium  
**AI comment:**
> A single wallet can buy the entire token supply in one call, which could be used to hoard tickets or grief other attendees. A per-transaction limit should be enforced.

**Resolution:** `MAX_PER_TRANSACTION = 10` constant added. `buyTicket` now reverts with `"Exceeds max per transaction"` if the amount exceeds this.

---

### Finding 4 — No zero-address check on `transfer` and `transferFrom`

**Severity:** Medium  
**AI comment:**
> Neither `transfer` nor `transferFrom` check for `address(0)` as the recipient. Tokens sent to the zero address are permanently burned with no indication to the user.

**Resolution:** `require(to != address(0), "Transfer to zero address")` added to both functions.

---

### Finding 5 — `WithdrawalMade` event missing

**Severity:** Low  
**AI comment:**
> `withdrawFunds` moves ETH with no on-chain record. Adding an event makes every withdrawal traceable on Etherscan.

**Resolution:** `event WithdrawalMade(address indexed vendor, uint256 amount)` added and emitted in `withdrawFunds`. `Paused` and `Unpaused` events were also added.

---

### Finding 6 — Gas inefficiency in `_transfer` and `buyTicket`

**Severity:** Low  
**AI comment:**
> The balance subtraction in `_transfer` is inside a checked arithmetic context even though the `require` above already guarantees no underflow. Using `unchecked` here saves gas. Similarly, `10 ** decimals` is recomputed on every `buyTicket` call.

**Resolution:** `unchecked` blocks applied to balance updates in `_transfer` and `_mint`. The `10 ** decimals` expression is used directly with `unchecked` where the value is bounded.

---

## Review Round 2 — Frontend UX and Security

The AI reviewed `pages/buy.html`, `pages/transfer.html`, `pages/index.html`, and `pages/contract.js`.

---

### Finding 7 — Raw `err.message` shown to users

**Severity:** Medium  
**AI comment:**
> Every catch block calls `showError('Error: ' + err.message)`, which surfaces raw Solidity revert strings and MetaMask internals directly to the user. These are unreadable. A parser that maps known revert reasons to plain English should be added.

**Resolution:** `parseRevertReason(err)` added to `contract.js`. It checks for all known revert strings from the contract and returns human-readable messages. All catch blocks now call this instead of using `err.message` directly.

---

### Finding 8 — No Sepolia network check

**Severity:** High  
**AI comment:**
> `connectMetaMask` does not verify the user is on the correct network. If MetaMask is set to Ethereum mainnet, a transaction could send real ETH to the testnet contract address, which is effectively a loss of funds.

**Resolution:** `connectMetaMask` now reads `chainId` via `web3.eth.getChainId()` and rejects with an error message if it is not `11155111` (Sepolia).

---

### Finding 9 — No loading state on transaction buttons

**Severity:** Medium  
**AI comment:**
> Nothing prevents the user from clicking "Buy Ticket" or "Transfer Ticket" multiple times while a transaction is pending in MetaMask. This could submit duplicate transactions.

**Resolution:** All transaction buttons are disabled and relabelled "Pending…" while a transaction is in flight. A `finally` block re-enables them whether the transaction succeeds or fails.

---

### Finding 10 — No pre-flight balance check

**Severity:** Medium  
**AI comment:**
> Both `buyTicket` and `transfer` will fail at the contract level if the wallet has insufficient funds, but the error only appears after MetaMask opens. A balance check before calling the contract gives instant feedback and avoids unnecessary gas estimation.

**Resolution:** `buy.html` now fetches the ETH balance and compares it to the ticket price before sending. `transfer.html` fetches the TIX balance and compares it to the transfer amount.

---

### Finding 11 — No transaction hash shown after success

**Severity:** Low  
**AI comment:**
> A plain `alert()` is shown on success with no way to verify the transaction on-chain. Showing a Sepolia Etherscan link gives the user proof the transaction landed.

**Resolution:** Both `buy.html` and `transfer.html` now display a styled success banner containing an Etherscan link: `https://sepolia.etherscan.io/tx/<txHash>`.

---

### Finding 12 — Private key exposed in plaintext on wallet creation page

**Severity:** High  
**AI comment:**
> The private key textarea on `index.html` is visible as soon as a wallet is generated. Anyone glancing at the screen could see it. The field should be blurred by default with a Show/Hide toggle.

**Resolution:** The `#privateKey` textarea has the `.blurred` CSS class applied by default. A toggle button reveals/hides it. The field also re-blurs whenever a new wallet is generated.

---

### Finding 13 — Sensitive fields not cleared on navigation

**Severity:** Medium  
**AI comment:**
> If the user navigates away from `index.html` without closing the tab, the private key and keystore remain in the DOM. A `beforeunload` handler should clear all sensitive fields.

**Resolution:** A `beforeunload` event listener clears `#walletPassword`, `#privateKey`, `#walletAddress`, and `#keystoreField` on every navigation.

---

### Finding 14 — No password strength feedback

**Severity:** Low  
**AI comment:**
> The keystore password field accepts any input including single-character passwords. Users may not realise their keystore is only as strong as this password. A strength indicator encourages better choices.

**Resolution:** An `input` event listener on `#walletPassword` classifies the password as Weak / OK / Strong and displays a coloured label beneath the field.

---

## Summary of Changes

| Finding | File | Severity | Status |
|---|---|---|---|
| 1 — No reentrancy guard | `TicketToken.sol` | High | ✅ Fixed |
| 2 — No emergency pause | `TicketToken.sol` | Medium | ✅ Fixed |
| 3 — No per-tx ticket cap | `TicketToken.sol` | Medium | ✅ Fixed |
| 4 — No zero-address check | `TicketToken.sol` | Medium | ✅ Fixed |
| 5 — Missing WithdrawalMade event | `TicketToken.sol` | Low | ✅ Fixed |
| 6 — Gas inefficiency | `TicketToken.sol` | Low | ✅ Fixed |
| 7 — Raw error messages | `contract.js` | Medium | ✅ Fixed |
| 8 — No network check | `contract.js` | High | ✅ Fixed |
| 9 — No loading state | `buy.html`, `transfer.html` | Medium | ✅ Fixed |
| 10 — No balance pre-check | `buy.html`, `transfer.html` | Medium | ✅ Fixed |
| 11 — No tx hash link | `buy.html`, `transfer.html` | Low | ✅ Fixed |
| 12 — Private key exposed | `index.html` | High | ✅ Fixed |
| 13 — Fields not cleared on leave | `index.html` | Medium | ✅ Fixed |
| 14 — No password strength UI | `index.html` | Low | ✅ Fixed |

All 14 findings were resolved. The final commit hash after resubmission should be recorded below once the PR is merged.

> **Final commit hash after fixes:** _(add hash here)_
