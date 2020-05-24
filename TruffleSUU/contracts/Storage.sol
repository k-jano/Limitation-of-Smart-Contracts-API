pragma solidity >=0.4.21 <0.7.0;

contract Storage {
	
	mapping (string => string) private _store;

	function addData(string memory key, string memory value) public {
		require(bytes(_store[key]).length == 0, "Such key already exists!");
		_store[key] = value;
	}

	function removeData(string memory key) public returns (string memory) {
		require(bytes(_store[key]).length != 0, "Such key doesn't exist!");
		string memory prev = _store[key];
		delete _store[key];
		return prev;
	}

	function changeData(string memory key, string memory newValue) public {
		require(bytes(_store[key]).length != 0, "Such key doesn't exist");
		_store[key] = newValue;
	}

	function getValue(string memory key) public view returns (string memory){
    	return _store[key];
  	}
}