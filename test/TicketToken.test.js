const { expect } = require("chai");
const { ethers } = require("hardhat");

// Unit tests for TicketToken.sol
// Run with: npx hardhat test

describe("TicketToken", function () {
    let token;
    let vendor, buyer, other;

    const INITIAL_SUPPLY = 1000n;   // whole tokens passed to constructor
    const TICKET_PRICE   = ethers.parseEther("0.01");
    const DECIMALS_FACTOR = 10n ** 18n;

    // Deploy a fresh contract before every test so state never leaks between cases
    beforeEach(async function () {
        [vendor, buyer, other] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("TicketToken");
        token = await Factory.deploy(INITIAL_SUPPLY);
    });

    // ── Deployment ────────────────────────────────────────────────────────────

    describe("Deployment", function () {
        it("sets the deployer as vendor", async function () {
            expect(await token.vendor()).to.equal(vendor.address);
        });

        it("mints the full initial supply to the vendor", async function () {
            const expectedSupply = INITIAL_SUPPLY * DECIMALS_FACTOR;
            expect(await token.totalSupply()).to.equal(expectedSupply);
            expect(await token.balanceOf(vendor.address)).to.equal(expectedSupply);
        });

        it("sets token metadata correctly", async function () {
            expect(await token.name()).to.equal("EventTicket");
            expect(await token.symbol()).to.equal("TIX");
            expect(await token.decimals()).to.equal(18);
        });

        it("sets ticket price to 0.01 ETH", async function () {
            expect(await token.ticketPrice()).to.equal(TICKET_PRICE);
        });

        it("sets MAX_PER_TRANSACTION to 10", async function () {
            expect(await token.MAX_PER_TRANSACTION()).to.equal(10);
        });

        it("starts unpaused", async function () {
            expect(await token.paused()).to.equal(false);
        });
    });

    // ── buyTicket ─────────────────────────────────────────────────────────────

    describe("buyTicket", function () {
        it("transfers tokens to buyer on correct payment", async function () {
            await token.connect(buyer).buyTicket(2, { value: TICKET_PRICE * 2n });
            expect(await token.balanceOf(buyer.address)).to.equal(2n * DECIMALS_FACTOR);
        });

        it("reduces the vendor's token balance by the amount sold", async function () {
            const before = await token.balanceOf(vendor.address);
            await token.connect(buyer).buyTicket(3, { value: TICKET_PRICE * 3n });
            expect(await token.balanceOf(vendor.address)).to.equal(before - 3n * DECIMALS_FACTOR);
        });

        it("accumulates ETH in the contract", async function () {
            await token.connect(buyer).buyTicket(1, { value: TICKET_PRICE });
            const contractBal = await ethers.provider.getBalance(await token.getAddress());
            expect(contractBal).to.equal(TICKET_PRICE);
        });

        it("emits a TicketPurchased event", async function () {
            await expect(
                token.connect(buyer).buyTicket(1, { value: TICKET_PRICE })
            ).to.emit(token, "TicketPurchased").withArgs(buyer.address, 1, TICKET_PRICE);
        });

        it("reverts when amount is 0", async function () {
            await expect(
                token.connect(buyer).buyTicket(0, { value: 0n })
            ).to.be.revertedWith("Amount must be greater than zero");
        });

        it("reverts when amount exceeds MAX_PER_TRANSACTION (10)", async function () {
            await expect(
                token.connect(buyer).buyTicket(11, { value: TICKET_PRICE * 11n })
            ).to.be.revertedWith("Exceeds max per transaction");
        });

        it("reverts when wrong ETH amount is sent", async function () {
            await expect(
                token.connect(buyer).buyTicket(1, { value: ethers.parseEther("0.005") })
            ).to.be.revertedWith("Incorrect native currency sent");
        });

        it("reverts when the contract is paused", async function () {
            await token.connect(vendor).pause();
            await expect(
                token.connect(buyer).buyTicket(1, { value: TICKET_PRICE })
            ).to.be.revertedWith("Contract is paused");
        });
    });

    // ── transfer ──────────────────────────────────────────────────────────────

    describe("transfer", function () {
        beforeEach(async function () {
            // Give the buyer 5 tickets to work with
            await token.connect(buyer).buyTicket(5, { value: TICKET_PRICE * 5n });
        });

        it("moves tokens from sender to recipient", async function () {
            const amount = 2n * DECIMALS_FACTOR;
            await token.connect(buyer).transfer(other.address, amount);
            expect(await token.balanceOf(buyer.address)).to.equal(3n * DECIMALS_FACTOR);
            expect(await token.balanceOf(other.address)).to.equal(amount);
        });

        it("emits a Transfer event", async function () {
            const amount = 1n * DECIMALS_FACTOR;
            await expect(
                token.connect(buyer).transfer(other.address, amount)
            ).to.emit(token, "Transfer").withArgs(buyer.address, other.address, amount);
        });

        it("reverts when sender has insufficient balance", async function () {
            const tooMany = 6n * DECIMALS_FACTOR;
            await expect(
                token.connect(buyer).transfer(other.address, tooMany)
            ).to.be.revertedWith("Insufficient balance");
        });

        it("reverts on transfer to the zero address", async function () {
            await expect(
                token.connect(buyer).transfer(ethers.ZeroAddress, 1n * DECIMALS_FACTOR)
            ).to.be.revertedWith("Transfer to zero address");
        });

        it("reverts when the contract is paused", async function () {
            await token.connect(vendor).pause();
            await expect(
                token.connect(buyer).transfer(other.address, 1n * DECIMALS_FACTOR)
            ).to.be.revertedWith("Contract is paused");
        });
    });

    // ── approve + transferFrom ─────────────────────────────────────────────────

    describe("approve and transferFrom", function () {
        beforeEach(async function () {
            await token.connect(buyer).buyTicket(5, { value: TICKET_PRICE * 5n });
        });

        it("records an allowance after approve", async function () {
            const amount = 3n * DECIMALS_FACTOR;
            await token.connect(buyer).approve(other.address, amount);
            expect(await token.allowance(buyer.address, other.address)).to.equal(amount);
        });

        it("emits an Approval event", async function () {
            const amount = 2n * DECIMALS_FACTOR;
            await expect(
                token.connect(buyer).approve(other.address, amount)
            ).to.emit(token, "Approval").withArgs(buyer.address, other.address, amount);
        });

        it("transferFrom moves tokens and reduces allowance", async function () {
            const amount = 2n * DECIMALS_FACTOR;
            await token.connect(buyer).approve(other.address, amount);
            await token.connect(other).transferFrom(buyer.address, other.address, amount);
            expect(await token.balanceOf(other.address)).to.equal(amount);
            expect(await token.allowance(buyer.address, other.address)).to.equal(0n);
        });

        it("reverts transferFrom when allowance is too low", async function () {
            await token.connect(buyer).approve(other.address, 1n * DECIMALS_FACTOR);
            await expect(
                token.connect(other).transferFrom(buyer.address, other.address, 3n * DECIMALS_FACTOR)
            ).to.be.revertedWith("Allowance too low");
        });
    });

    // ── withdrawFunds ─────────────────────────────────────────────────────────

    describe("withdrawFunds", function () {
        beforeEach(async function () {
            // Deposit some ETH into the contract via a ticket purchase
            await token.connect(buyer).buyTicket(2, { value: TICKET_PRICE * 2n });
        });

        it("sends all ETH to the vendor", async function () {
            const before = await ethers.provider.getBalance(vendor.address);
            const tx = await token.connect(vendor).withdrawFunds();
            const receipt = await tx.wait();
            const gasCost = receipt.gasUsed * receipt.gasPrice;
            const after = await ethers.provider.getBalance(vendor.address);
            expect(after).to.equal(before + TICKET_PRICE * 2n - gasCost);
        });

        it("zeroes the contract ETH balance", async function () {
            await token.connect(vendor).withdrawFunds();
            const contractBal = await ethers.provider.getBalance(await token.getAddress());
            expect(contractBal).to.equal(0n);
        });

        it("emits a WithdrawalMade event", async function () {
            await expect(
                token.connect(vendor).withdrawFunds()
            ).to.emit(token, "WithdrawalMade").withArgs(vendor.address, TICKET_PRICE * 2n);
        });

        it("reverts when called by a non-vendor address", async function () {
            await expect(
                token.connect(buyer).withdrawFunds()
            ).to.be.revertedWith("Only vendor can withdraw");
        });

        it("reverts when there is nothing to withdraw", async function () {
            await token.connect(vendor).withdrawFunds();
            await expect(
                token.connect(vendor).withdrawFunds()
            ).to.be.revertedWith("Nothing to withdraw");
        });
    });

    // ── pause / unpause ───────────────────────────────────────────────────────

    describe("pause and unpause", function () {
        it("vendor can pause the contract", async function () {
            await token.connect(vendor).pause();
            expect(await token.paused()).to.equal(true);
        });

        it("vendor can unpause the contract", async function () {
            await token.connect(vendor).pause();
            await token.connect(vendor).unpause();
            expect(await token.paused()).to.equal(false);
        });

        it("emits Paused event on pause", async function () {
            await expect(token.connect(vendor).pause())
                .to.emit(token, "Paused").withArgs(vendor.address);
        });

        it("emits Unpaused event on unpause", async function () {
            await token.connect(vendor).pause();
            await expect(token.connect(vendor).unpause())
                .to.emit(token, "Unpaused").withArgs(vendor.address);
        });

        it("reverts pause when called by a non-vendor address", async function () {
            await expect(
                token.connect(buyer).pause()
            ).to.be.revertedWith("Only vendor can pause");
        });

        it("reverts unpause when called by a non-vendor address", async function () {
            await token.connect(vendor).pause();
            await expect(
                token.connect(buyer).unpause()
            ).to.be.revertedWith("Only vendor can unpause");
        });

        it("allows purchases again after unpause", async function () {
            await token.connect(vendor).pause();
            await token.connect(vendor).unpause();
            await expect(
                token.connect(buyer).buyTicket(1, { value: TICKET_PRICE })
            ).to.not.be.reverted;
        });
    });
});
