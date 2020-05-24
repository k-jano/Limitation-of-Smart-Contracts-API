pragma solidity >=0.4.21 <0.7.0;

contract HelloWorld {
  string greeting;

  constructor() public {
    greeting = "Hello World!";
  }

  function getGreeting() public view returns (string memory){
    return greeting;
  }

  function setGreeting(string memory _greeting) public {
    greeting = _greeting;
  }
}
