# Project Report — Blockchain Ticketing DApp

**Author:** Aoibheann  
**Date:** _(add submission date)_  
**Contract address (Sepolia):** `0x6Be3e7fBcE268036765bEAFf994D389Bfb038812`

---

## 1. Technology Choices — Why web3.js and jQuery

> **[YOUR OWN WORDS REQUIRED HERE]**  
> Explain why you chose web3.js over ethers.js, and why jQuery over plain JS or a framework like React. Think about: familiarity, the examples you followed, the size of the projects, ease of DOM manipulation, and how jQuery pairs with the web3.js callback style. This should be 2–4 sentences in your own voice.

_(Replace this paragraph with your explanation.)_

---

## 2. Smart Contract Design Decisions

### 2.1 ERC-20 as the token standard

> **[YOUR OWN WORDS REQUIRED HERE]**  
> Why did you use ERC-20 for the tickets? What does that give you for free (transfer, approve, allowance)? Why does it make sense for a ticketing use case?

_(Replace this paragraph with your explanation.)_

### 2.2 Built-in purchase mechanism (`buyTicket`)

> **[YOUR OWN WORDS REQUIRED HERE]**  
> The contract has a `buyTicket` payable function rather than distributing tokens externally. Explain why this design keeps the logic self-contained and what the `msg.value == price` check protects against.

_(Replace this paragraph with your explanation.)_

### 2.3 Reentrancy guard

> **[YOUR OWN WORDS REQUIRED HERE]**  
> Explain what a reentrancy attack is in plain terms and why the `nonReentrant` modifier on `buyTicket` and `withdrawFunds` prevents it. You can reference the classic DAO hack as context if you like.

_(Replace this paragraph with your explanation.)_

### 2.4 Emergency pause

> **[YOUR OWN WORDS REQUIRED HERE]**  
> Why would a vendor need to pause the contract? Give one real-world scenario where this would be necessary.

_(Replace this paragraph with your explanation.)_

---

## 3. Three Actor Roles — Why They Were Separated

> **[YOUR OWN WORDS REQUIRED HERE]**  
> Explain why the balance page was split into Attendee, Doorman, and Venue views. What does each role need to see, and why would showing everything to everyone be a worse design? This is about separation of concerns in a real-world event context.

_(Replace this paragraph with your explanation.)_

---

## 4. Transaction Evidence

All transactions below were executed on the Sepolia testnet and can be verified on [Sepolia Etherscan](https://sepolia.etherscan.io).

### 4.1 `buyTicket` transaction

> **[FILL IN AFTER RUNNING ON SEPOLIA]**

| Field | Value |
|---|---|
| Tx hash | _(paste hash)_ |
| Etherscan link | _(paste link)_ |
| Amount purchased | _(e.g. 2 TIX)_ |
| ETH sent | _(e.g. 0.02 ETH)_ |
| Status | _(Confirmed / Failed)_ |

**What I verified:** _(e.g. "I confirmed the TIX balance on the Balances page increased by 2 after the transaction was mined.")_

---

### 4.2 `transfer` transaction

> **[FILL IN AFTER RUNNING ON SEPOLIA]**

| Field | Value |
|---|---|
| Tx hash | _(paste hash)_ |
| Etherscan link | _(paste link)_ |
| Amount transferred | _(e.g. 1 TIX)_ |
| Recipient | _(paste address)_ |
| Status | _(Confirmed / Failed)_ |

**What I verified:** _(e.g. "I confirmed the sender's balance decreased and the recipient's balance increased on the Balances page.")_

---

### 4.3 `withdrawFunds` transaction

> **[FILL IN AFTER RUNNING ON SEPOLIA]**

| Field | Value |
|---|---|
| Tx hash | _(paste hash)_ |
| Etherscan link | _(paste link)_ |
| Amount withdrawn | _(e.g. 0.03 ETH)_ |
| Status | _(Confirmed / Failed)_ |

**What I verified:** _(e.g. "I confirmed the contract ETH balance on the Venue tab dropped to 0 after withdrawal.")_

---

## 5. Reflection

> **[YOUR OWN WORDS REQUIRED HERE]**  
> 3–5 sentences reflecting on the project. What was the hardest part? What would you do differently if you were building this for a real event? What did you learn about blockchain development that surprised you?

_(Replace this paragraph with your reflection.)_
