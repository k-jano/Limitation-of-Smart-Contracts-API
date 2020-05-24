const ethers = require('ethers');
const compiler = require('solc');
const {utils} = require('solc')

let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
let provider = ethers.getDefaultProvider('ropsten');
let walletWithProvider = new ethers.Wallet(privateKey, provider)

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

function link(bytecode, libraryName, libraryAddress) {
    const address = libraryAddress.replace('0x', '');
    const encodedLibraryName = {utils}
        .solidityKeccak256(['string'], [libraryName])
        .slice(2, 36);
    const pattern = new RegExp(`_+\\$${encodedLibraryName}\\$_+`, 'g');
    if (!pattern.exec(bytecode)) {
        throw new Error(`Can't link '${libraryName}'.`);
    }
    return bytecode.replace(pattern, address);
}

const address = {
    'InfoManager.sol': '',
    'CheckLibrary.sol': '',
    'Storage.sol': ''
}

const deploy = async function(key) {
    /*if(key == 'InfoManager.sol'){
        bytecode[key] = link(bytecode[key], 'CheckLibrary', address['CheckLibrary.sol']);
    }*/
    let factory = new ethers.ContractFactory(abi[key], bytecode[key], walletWithProvider);
    if(key == 'InfoManager.sol'){
        factory.attach(address['Storage.sol'])
    }
    let contract = await factory.deploy();
    console.log(contract.address);
    console.log(contract.deployTransaction.hash);

    await contract.deployed();
    address[key] = contract.address;
};

const main = async function(){
    await deploy('CheckLibrary.sol');
    await deploy('Storage.sol');
    await deploy('InfoManager.sol');
}

main();