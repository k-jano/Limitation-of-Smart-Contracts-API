// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "./Storage.sol";
import {CheckLibrary} from "./CheckLibrary.sol";

contract InfoManager {
	using CheckLibrary for *;

	Storage private _dataStore;

	uint private _lastAdded;

	constructor (Storage dataStore) public {
		_dataStore = dataStore;
	}

	function addData(string memory key, string memory value) public {
		_lastAdded.checkDate();
		_dataStore.addData(key, value);
	}
}