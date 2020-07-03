const Web3 = require('web3');
const compiler = require('solc');
const performance = require('perf_hooks').performance;

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


const CONTRACT_FILE = 'HelloWorld.sol';
const content = 'contract HelloWorld { string greeting; constructor() public { greeting = "Hello World!"; } function getGreeting() public view returns (string memory){ return greeting; } function setGreeting(string memory _greeting) public { greeting = _greeting; } }';
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
};
let compiledCode = compiler.compile(JSON.stringify(input));
compiledCode = JSON.parse(compiledCode);
const abi = compiledCode.contracts[CONTRACT_FILE]['HelloWorld'].abi;
const bytecode = compiledCode.contracts[CONTRACT_FILE]['HelloWorld'].evm.bytecode.object;
var HelloWorld = new web3.eth.Contract(abi);


const timeMeasurement = async function() {
	var accounts = [];
	await web3.eth.getAccounts().then(function(result){accounts=result});
	console.log(accounts)
    var start = performance.now();
    let contract = await HelloWorld.deploy({data: bytecode}).send({from: accounts[1], gas: 4700000}).then(function(result){myContract = result;});
    var end = performance.now();
    console.log("Deployment time " + (end - start) + " ms");
    address = myContract.address;
	start = performance.now();
    currValue = await myContract.methods.getGreeting().call();
    end = performance.now();
    console.log("getGreeting time " + (end - start) + " ms");
	start = performance.now();
    currValue = await myContract.methods.setGreeting("NEW MESSAGE!").send({from: accounts[1]});
    end = performance.now();
    console.log("setGreeting time " + (end - start) + " ms");

};

const main = async function(){
    await timeMeasurement();
    //getValue();
}

main();
