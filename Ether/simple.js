const ethers = require('ethers');
const compiler = require('solc');
const { performance } = require('perf_hooks');

let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890125";
let provider = ethers.getDefaultProvider('ropsten');
let walletWithProvider = new ethers.Wallet(privateKey, provider)

const CONTRACT_FILE = 'HelloWorld.sol'
const content = 'contract HelloWorld { string greeting; constructor() public { greeting = "Hello World!"; } function getGreeting() public view returns (string memory){ return greeting; } function setGreeting(string memory _greeting) public { greeting = _greeting; } }'
const input = {
    language: 'Solidity',
    sources: {
        [CONTRACT_FILE]: {
            content: content
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}
let compiledCode = compiler.compile(JSON.stringify(input))
compiledCode = JSON.parse(compiledCode)

//console.log(compiledCode.contracts)
const abi = compiledCode.contracts[CONTRACT_FILE]['HelloWorld'].abi
const bytecode = compiledCode.contracts[CONTRACT_FILE]['HelloWorld'].evm.bytecode.object
let address = ''

const deploy = async function() {
    let factory = new ethers.ContractFactory(abi, bytecode, walletWithProvider);

    const start = performance.now();
    let contract = await factory.deploy();
    //console.log(contract.address);
    //console.log(contract.deployTransaction.hash);

    await contract.deployed();
    const end = performance.now();
    console.log("Deployment time " + (end - start) + " ms");
    address = contract.address;
};

const getValue = async function(){
    let contract = new ethers.Contract(address, abi, provider);
    const start = performance.now();
    const currValue = await contract.getGreeting();
    const end = performance.now();
    console.log("getGreeting time " + (end - start) + " ms");
    //console.log(currValue);
}

const setValue = async function(){
    let contract = new ethers.Contract(address, abi, provider);
    let contractWithSigner = contract.connect(walletWithProvider);

    const newVal = 'New Value!';
    const start = performance.now();
    const tx = await contractWithSigner.setGreeting(newVal);
    await tx.wait();
    const end = performance.now();
    console.log("setGreeting time " + (end - start) + " ms");
}

const main = async function(){
    await deploy();
    await getValue();
    await setValue();
    //getValue();
}

main();