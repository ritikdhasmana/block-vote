const main = async () => {
  const voteContractFactory = await hre.ethers.getContractFactory("BlockVote");
  const voteContract = await voteContractFactory.deploy();
  await voteContract.deployed();
  console.log("contract deployed: ", voteContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log("error deploying: ", error);
    process.exit(1);
  }
};
runMain();
