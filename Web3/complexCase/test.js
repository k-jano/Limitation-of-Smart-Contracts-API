const Web3 = require('web3');
const compiler = require('solc');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const data = {
    'InfoManager.sol': '// SPDX-License-Identifier: MIT\n pragma solidity >=0.4.21 <0.7.0; import "./Storage.sol"; import {CheckLibrary} from "./CheckLibrary.sol"; contract InfoManager { using CheckLibrary for *; Storage private _dataStore; uint private _lastAdded; constructor (Storage dataStore) public { _dataStore = dataStore; } function addData(string memory key, string memory value) public { _lastAdded.checkDate(); _dataStore.addData(key, value); } }',
    'CheckLibrary.sol': 'pragma solidity >=0.4.21 <0.7.0; library CheckLibrary { function checkDate(uint _lastAdded) public { require((now - 1 days) > _lastAdded); } }',
    'Storage.sol': 'pragma solidity >=0.4.21 <0.7.0; contract Storage { mapping (string => string) private _store; function addData(string memory key, string memory value) public { require(bytes(_store[key]).length == 0, "Such key already exists!"); _store[key] = value; } function removeData(string memory key) public returns (string memory) { require(bytes(_store[key]).length != 0, "Such key doesnot exist!"); string memory prev = _store[key]; delete _store[key]; return prev; } function changeData(string memory key, string memory newValue) public { require(bytes(_store[key]).length != 0, "Such key doesnot exist"); _store[key] = newValue; }  function getValue(string memory key) public view returns (string memory){ return _store[key]; } }'
}

const abi = {
    'InfoManager.sol': '',
    'CheckLibrary.sol': '',
    'Storage.sol': ''
}

const bytecode = {
    'InfoManager.sol': '',
    'CheckLibrary.sol': '',
    'Storage.sol': ''
}

function findImports(path){
    if (path === 'Storage.sol'){
        return {
            contents: data['Storage.sol']
        };
    } else if (path === 'CheckLibrary.sol'){
        return {
            contents: data['CheckLibrary.sol']
        }
    }
    else return { error: 'File not found' };
}

for (key in data) {
    const CONTRACT_FILE = key
    const input = {
        language: 'Solidity',
        sources: {
            [CONTRACT_FILE]: {
                content: data[key]
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

    let compiledCode = compiler.compile(JSON.stringify(input), {import: findImports});
    compiledCode = JSON.parse(compiledCode)

    //console.log()
    abi[key] = compiledCode.contracts[CONTRACT_FILE][key.substring(0, key.length - 4)].abi
    bytecode[key] = compiledCode.contracts[CONTRACT_FILE][key.substring(0, key.length - 4)].evm.bytecode.object


}


web3.eth.getAccounts().then(function(r){accounts=r})

console.log(accounts)

var CheckLibrary = new web3.eth.Contract(abi['CheckLibrary.sol'])
var Storage = new web3.eth.Contract(abi['Storage.sol'])



var deployCL;
var deployS;

CheckLibrary.deploy({data: bytecode['CheckLibrary.sol']})
.send({from: accounts[0], gas: 4700000}).then(function(result){deployCL=result;})
Storage.deploy({data: bytecode['Storage.sol']})
.send({from: accounts[0], gas: 4700000}).then(function(result){deployS=result;})


console.log(deployCL.options.address)
console.log(deployS.options.address)


var InfoManager = new web3.eth.Contract(abi['InfoManager.sol'])

