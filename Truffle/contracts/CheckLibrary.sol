pragma solidity >=0.4.21 <0.7.0;

library CheckLibrary {
	
	function checkDate(uint _lastAdded) public {
		require((now - 1 days) > _lastAdded);
	}
}