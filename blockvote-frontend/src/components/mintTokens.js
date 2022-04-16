import React, { useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import "./styles/mintTokens.css";
function MintTokens(props) {
  console.log(props.owner);
  console.log("a: ", props.account);
  console.log("totalTokens: ", props.totalTokens);

  const [recipient, setRecipient] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);

  const mintToken = async () => {
    console.log(recipient);
    console.log(tokenAmount);
    await props.contract.mintTokens(recipient, tokenAmount);
    alert("successfully minted!");
    props.setIsLoading(true);
  };

  return props.account.toLowerCase() === props.owner.toLowerCase() ? (
    props.isLoggedIn ? (
      !props.isLoading ? (
        <div className="Mint-container">
          <span className="mint-title">
            Mint Tokens {`(current total token supply: ${props.totalTokens})`}
          </span>
          <form
            action=""
            className="mint-form"
            onSubmit={(e) => {
              e.preventDefault();
              mintToken();
            }}
          >
            <div>
              <label htmlFor="" className="label">
                Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="" className="label">
                Amount
              </label>
              <input
                type="text"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
              />
            </div>
            <div>
              <input className="sub-input" type="submit" value="Submit" />
            </div>
          </form>
        </div>
      ) : (
        <LoadingIndicator />
      )
    ) : (
      <div className="notAllowed">login with metamask first!!</div>
    )
  ) : (
    <div className="notAllowed">only Contract owners can mint!!</div>
  );
}

export default MintTokens;
