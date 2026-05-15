# Testing Documentation

Manual test cases for the TicketToken DApp, tested on the Ethereum Sepolia testnet.  
Contract address: `0x6Be3e7fBcE268036765bEAFf994D389Bfb038812`

Unit tests (automated) are in `test/TicketToken.test.js` — run with `npx hardhat test`.

---

## Test Environment

- Network: Sepolia testnet
- Wallet: MetaMask
- Browser: _(add your browser here)_
- Date tested: _(add date)_

---

## TC-01 — Buy 1 ticket with correct ETH

**Page:** `buy.html`  
**Steps:**
1. Connect MetaMask (Sepolia network)
2. Enter amount: `1`
3. Click "Buy Ticket"
4. Approve transaction in MetaMask (sending 0.01 ETH)

**Expected:** Success banner appears with Sepolia Etherscan link. TIX balance increases by 1 on the Balances page.

**Result:** _(pass / fail)_  
**Tx hash:** _(paste here)_

---

## TC-02 — Buy 1 ticket with wrong ETH amount

**Page:** `buy.html`  
**Steps:**
1. Connect MetaMask
2. Enter amount: `1`
3. Manually modify the ETH value (requires editing the source or using the console to send 0.005 ETH)

**Expected:** Transaction reverts. Error modal shows: *"Wrong ETH amount sent — please check the price and try again."*

**Result:** _(pass / fail)_  
**Notes:** _(add any observations)_

---

## TC-03 — Buy 0 tickets (amount validation)

**Page:** `buy.html`  
**Steps:**
1. Connect MetaMask
2. Change amount to `0`
3. Click "Buy Ticket"

**Expected:** Error modal shows: *"Amount must be at least 1."* No MetaMask prompt appears.

**Result:** _(pass / fail)_

---

## TC-04 — Buy more than 10 tickets

**Page:** `buy.html`  
**Steps:**
1. Connect MetaMask
2. Enter amount: `11`
3. Click "Buy Ticket"

**Expected:** Error modal shows: *"You cannot buy more than 10 tickets in one transaction."* No MetaMask prompt appears.

**Result:** _(pass / fail)_

---

## TC-05 — Buy ticket with insufficient ETH balance

**Page:** `buy.html`  
**Steps:**
1. Connect a wallet with less than 0.01 ETH
2. Enter amount: `1`
3. Click "Buy Ticket"

**Expected:** Error modal shows: *"Insufficient ETH balance — you need at least 0.01 ETH."* No MetaMask prompt appears.

**Result:** _(pass / fail)_

---

## TC-06 — Transfer tickets to a valid address

**Page:** `transfer.html`  
**Steps:**
1. Connect MetaMask (wallet must hold at least 1 TIX)
2. Enter a valid recipient address
3. Enter amount: `1`
4. Click "Transfer Ticket"
5. Approve in MetaMask

**Expected:** Success banner with Etherscan link. Sender's TIX balance decreases by 1.

**Result:** _(pass / fail)_  
**Tx hash:** _(paste here)_

---

## TC-07 — Transfer to invalid address

**Page:** `transfer.html`  
**Steps:**
1. Connect MetaMask
2. Enter recipient: `0xinvalidaddress`
3. Click "Transfer Ticket"

**Expected:** Error modal shows: *"Invalid recipient address — please check and try again."* No MetaMask prompt appears.

**Result:** _(pass / fail)_

---

## TC-08 — Transfer more tickets than balance

**Page:** `transfer.html`  
**Steps:**
1. Connect MetaMask (wallet holds 2 TIX)
2. Enter a valid recipient address
3. Enter amount: `5`
4. Click "Transfer Ticket"

**Expected:** Error modal shows: *"You do not have enough TIX tokens — your balance is 2 TIX."* No MetaMask prompt appears.

**Result:** _(pass / fail)_

---

## TC-09 — Return to Vendor button pre-fills address

**Page:** `transfer.html`  
**Steps:**
1. Connect MetaMask
2. Click "Return to Vendor"

**Expected:** The recipient address field is populated with the vendor's contract address automatically.

**Result:** _(pass / fail)_

---

## TC-10 — Doorman looks up an address with 0 tickets

**Page:** `balances.html` → Doorman tab  
**Steps:**
1. Connect MetaMask
2. Click the Doorman tab
3. Enter a wallet address that has never bought a ticket
4. Click "Check Tickets"

**Expected:** Result shows TIX Balance: `0` and *"No tickets — entry denied"*.

**Result:** _(pass / fail)_

---

## TC-11 — Doorman looks up an address with tickets

**Page:** `balances.html` → Doorman tab  
**Steps:**
1. Connect MetaMask
2. Click the Doorman tab
3. Enter a wallet address that holds at least 1 TIX
4. Click "Check Tickets"

**Expected:** Result shows the TIX balance and *"Valid ticket holder"*.

**Result:** _(pass / fail)_

---

## TC-12 — Venue view shows contract ETH balance

**Page:** `balances.html` → Venue tab  
**Steps:**
1. Connect MetaMask
2. Click the Venue tab
3. Click "Refresh"

**Expected:** Contract ETH Balance reflects the total ETH from all ticket sales. Vendor TIX balance and total TIX supply are displayed.

**Result:** _(pass / fail)_

---

## TC-13 — Wrong network (not Sepolia)

**Page:** Any page  
**Steps:**
1. Switch MetaMask to Ethereum mainnet
2. Load any page and click a button that triggers `connectMetaMask`

**Expected:** Error modal shows: *"Wrong network — please switch MetaMask to the Sepolia test network."*

**Result:** _(pass / fail)_

---

## TC-14 — Wallet creation and keystore download

**Page:** `index.html`  
**Steps:**
1. Enter a password (e.g. `TestPassword123!`)
2. Click "Create Wallet"
3. Verify the address and private key fields are populated
4. Verify the private key is blurred by default
5. Click "Show" — private key should be visible
6. Click "Hide" — private key should blur again
7. Click "Download Keystore"

**Expected:** A `.json` file is downloaded named after the wallet address. The file contains a valid keystore JSON object.

**Result:** _(pass / fail)_

---

## TC-15 — Password strength indicator

**Page:** `index.html`  
**Steps:**
1. Type a short password (e.g. `abc`) — expect **Weak** label in red
2. Type a medium password (e.g. `password1`) — expect **OK** label
3. Type a strong password (e.g. `Tr0ub4dor&3`) — expect **Strong** label in green

**Result:** _(pass / fail)_

---

## TC-16 — Non-vendor cannot call withdrawFunds (unit test)

**Test file:** `test/TicketToken.test.js`  
**Test name:** `withdrawFunds › reverts when called by a non-vendor address`

**Expected:** Transaction reverts with `"Only vendor can withdraw"`.

**Result:** Run `npx hardhat test` — _(pass / fail)_

---

## Automated Unit Test Results

Run `npx hardhat test` and paste the output here:

```
(paste output here)
```
