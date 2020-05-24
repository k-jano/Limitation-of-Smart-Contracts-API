pragma solidity^0.6.8;

contract HelloWorld{
    string greeting;

    constructor() public{
        greeting = "HelloWorld";
    }

    function getGreeting() public view returns (string memory){
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
