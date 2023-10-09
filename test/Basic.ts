const {
    loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Basic ERC-20", function () {
    async function deployContracts() {
        const [alice, bob, francis] = await ethers.getSigners()

        const initialBalance = ethers.parseEther("10000")
        const Basic = await ethers.getContractFactory("Basic")
        const basic = await Basic.deploy(initialBalance)

        const AirdropMachine = await ethers.getContractFactory("AirdropMachine")
        const airdropMachine = await AirdropMachine.deploy()

        return { basic, alice, bob, francis, initialBalance, airdropMachine }
    }

    describe("Deployment", function () {
        it("Should return a balance of 10,000 units", async function () {
            const { basic, initialBalance, alice } = await loadFixture(
                deployContracts
            )
            expect(await basic.balanceOf(alice.address)).to.equal(
                initialBalance
            )
        })

        // it("Should return the address of the AirdropMachine contract owner", async function () {
        //     const { alice, airdropMachine } = await loadFixture(
        //         deployContracts
        //     )
        //     expect(await airdropMachine.owner()).to.equal(
        //         alice.address
        //     )
        // })
    })

    describe("Interactions", function () {
        it("Should mint 1 unit", async function () {
            const { basic, alice } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("1")
            await basic.mint(amount)
            expect(await basic.balanceOf(alice.address)).to.be.equal(
                ethers.parseEther("10001")
            )
        })
        it("Should transfer 1 unit", async function () {
            const { basic, bob } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("1")
            await basic.transfer(bob.address, amount)
            expect(await basic.balanceOf(bob.address)).to.be.equal(
                ethers.parseEther("1")
            )
        })

        it("Should distribute 1 token to bob and alice", async function () {
            const { basic, bob, alice, airdropMachine, francis } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("1")
            const total = ethers.parseEther("3")

            const from = alice.address
            const targets = [
                alice.address,
                bob.address, 
                francis.address
            ]
            const token = await basic.getAddress()

            await basic.approve(await airdropMachine.getAddress(), total)

            const call = await airdropMachine.distribute(from, targets, amount, token)

            expect(await basic.balanceOf(bob.address)).to.be.equal(
                ethers.parseEther("1")
            )
            expect(await basic.balanceOf(francis.address)).to.be.equal(
                ethers.parseEther("1")
            )
        })
        it("Should distribute 1 token to 100 wallets", async function () {
            const { basic, bob, alice, airdropMachine, francis } = await loadFixture(deployContracts)
            // const amount = ethers.parseEther("1")
            const total = ethers.parseEther("3")

            const from = alice.address
            const targets = [
                alice.address,
                bob.address, 
                francis.address
            ]
            const token = await basic.getAddress()

            await basic.approve(await airdropMachine.getAddress(), total)



            let amount:number = 100
            let signers:any = [alice.address, bob.address, francis.address]
            const randomSigners = async (amount:number) => {
            for (let i = 0; i < amount; i++) {
                const x = ethers.Wallet.createRandom()
                const y = new ethers.Wallet(x, ethers.provider)
                signers.push(y.address)
            }
            return signers
            }
            
           


            console.log( 'await randomSigners(amount):',  await randomSigners(amount))


            const call = await airdropMachine.distribute(from, targets, amount, token)

            expect(await basic.balanceOf(bob.address)).to.be.equal(
                ethers.parseEther("1")
            )
            expect(await basic.balanceOf(francis.address)).to.be.equal(
                ethers.parseEther("1")
            )
        })
    })
})