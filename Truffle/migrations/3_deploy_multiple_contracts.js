const CheckLibrary = artifacts.require("CheckLibrary.sol");
const Storage = artifacts.require("Storage.sol");
const InfoManager = artifacts.require("InfoManager.sol");

module.exports = function(deployer) {
  deployer.deploy(CheckLibrary);
  deployer.link(CheckLibrary, InfoManager);

  deployer.deploy(Storage)
  	.then(() => Storage.deployed())
  	.then(() => deployer.deploy(InfoManager, Storage.address))
};
