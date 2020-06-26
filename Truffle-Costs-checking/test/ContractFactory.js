const ContractFactory = artifacts.require("ContractFactory");

contract("ContractFactory", (accounts) => {

	it("should deploy and successfully call createInstance using the method's provided gas estimate", async () => {
		//create ContractFactory
		const contractFactoryInstance = await ContractFactory.new();

		//get gasEstimate
		const gasEstimate = await contractFactoryInstance.createInstance.estimateGas();

		//check if transaction gas used is equal to estimated
		const tx = await contractFactoryInstance.createInstance({
			gas: gasEstimate
			//gas: gasEstimate - 1 //will fail
			});
    	assert(tx);
  	});


	it("should withdraw correct amount of gas from account", async () => {
		//create ContractFactory
		const contractFactoryInstance = await ContractFactory.new();

		//get balance before transaction
	    const balanceBefore = await web3.eth.getBalance(accounts[0]);

	    //send transaction
	    const txInfo = await contractFactoryInstance.createInstance.sendTransaction();
	    const tx = await web3.eth.getTransaction(txInfo.tx);

	    //get gasPrice and gasUsed
	    const gasPrice = web3.utils.toBN(tx.gasPrice);
		const gasUsed = web3.utils.toBN(txInfo.receipt.gasUsed);

		//get balance after transaction
	    const balanceAfter = await web3.eth.getBalance(accounts[0]);

	    //balanceAfter + gasUsed.gasPrice should be equal to initial balance
		assert.deepEqual(web3.utils.toBN(balanceAfter).add(gasUsed.mul(gasPrice)).toString(),
			web3.utils.toBN(balanceBefore).toString(), "Balance incorrect!");
  });
});
