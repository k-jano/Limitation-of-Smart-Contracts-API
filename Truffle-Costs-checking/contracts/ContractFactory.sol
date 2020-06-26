pragma solidity >=0.4.21 <0.7.0;

contract ContractFactory {
  function createInstance() public {
    new Contract();
  }
}

contract Contract {
  constructor() public {}
}
