const color = require("cli-color")
var msg = color.xterm(39).bgXterm(128)
import hre, { ethers, network } from "hardhat"
import fs from "fs"

async function main() {
    const AirdropMachine = await ethers.getContractFactory("AirdropMachine")
    const airdropMachine = await AirdropMachine.deploy()

    console.log(
        "Basic ERC-20 token contract deployed:",
        msg(await airdropMachine.getAddress())
    )
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
