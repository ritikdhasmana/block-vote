/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./components/header";
import ContractAddress from "./contractData/contracts-address.json";
import ContractAbi from "./contractData/abi.json";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import AllProposals from "./components/allProposals";
import CreateProposal from "./components/createProposal";
import MintTokens from "./components/mintTokens";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [voteContract, setVoteContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [totalTokenSupply, setTotalTokenSupply] = useState(0);
  const [contractOwner, setContractOwner] = useState("0x0");
  const [isLoading, setIsLoading] = useState(true);
  const { ethereum } = window;

  const contract = ContractAddress.Token;
  const abi = ContractAbi.abi;
  //fetches current ethereum address to check if we are still using the same address or not
  const getCurrentAccount = async () => {
    try {
      if (!ethereum) {
        alert("Metamask not found");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        if (account !== userAddress) {
          setUserAddress(account);
          setIsLoggedIn(true);
          console.log("Account: ", account);
        }
        return account;
      } else {
        console.log("No account available");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  ethereum.on("accountsChanged", function (accounts) {
    getCurrentAccount();
  });
  useEffect(() => {
    getCurrentAccount();
  }, []);

  const login = async () => {
    await getCurrentAccount()
      .then(function () {
        setIsLoggedIn(true);
        console.log("logged in user:", userAddress);
        console.log(userAddress);
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const voteContract = new ethers.Contract(contract, abi, signer);
      setVoteContract(() => voteContract);
      const txn = await voteContract.userBalance();
      const balance = txn.toNumber();
      console.log("user bal:", balance);
      setUserTokenBalance(() => balance);

      const _owner = await voteContract.currentOwner();
      console.log("c: ", _owner);
      setContractOwner(() => _owner);
      console.log("contract owner: ", contractOwner);
      const alltokens = await voteContract.totalTokenAmount();
      setTotalTokenSupply(alltokens);
      setIsLoading(false);
    };

    if (userAddress) {
      console.log("userAddress:", userAddress);
      fetchNFTMetadata();
    }
  }, [userAddress, isLoading]);

  //setting up routes for the app
  const MyRoutes = () => {
    let routes = useRoutes([
      {
        path: "/",
        element: (
          <AllProposals
            isLoggedIn={isLoggedIn}
            account={userAddress}
            userBal={userTokenBalance}
            owner={contractOwner}
            totalTokens={totalTokenSupply}
          />
        ),
      },
      {
        path: "/createProposal",
        element: (
          <CreateProposal
            isLoggedIn={isLoggedIn}
            account={userAddress}
            userBal={userTokenBalance}
            owner={contractOwner}
            isLoading={isLoading}
          />
        ),
      },
      {
        path: "/mint-tokens",
        element: (
          <MintTokens
            contractAddr={contract}
            contractAbi={abi}
            contract={voteContract}
            owner={contractOwner}
            isLoggedIn={isLoggedIn}
            account={userAddress}
            totalTokens={totalTokenSupply}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ),
      },
    ]);
    return routes;
  };

  return (
    <div className="App">
      <Router>
        <Header login={login} isLoggedIn={isLoggedIn} account={userAddress} />
        <MyRoutes />
      </Router>
    </div>
  );
}

export default App;
