import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Moralis from "moralis";
import LoadingIndicator from "./LoadingIndicator";
import "./styles/allProposals.css";

import { ethers } from "ethers";
import ContractAddress from "../contractData/contracts-address.json";
import ContractAbi from "../contractData/abi.json";

function AllProposals(props) {
  const [allProposals, setAllProposals] = useState();
  const getAllProps = async () => {
    const AllProps = Moralis.Object.extend("Proposals");
    let query = new Moralis.Query(AllProps);
    const allProps = await query.find();
    console.log("all props: ", allProps);
    setAllProposals(allProps);
    return allProps;
  };

  //to change status on chain
  const allPropSetStatus = async () => {
    for (let i = 0; i < allProposals.length; i++) {
      let prop = allProposals[i];
      if (!isNotExpired(prop)) {
        await changeStatusOnChain(prop);
      }
    }
  };
  useEffect(() => {
    getAllProps();
    allPropSetStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateConverter = (date) => {
    return date?.toISOString("MM-DD-YYYY").split("T")[0];
  };

  //check if prop expired
  const isNotExpired = (prop) => {
    const createdTime = parseInt(prop.get("timeCreated"));
    const duration = parseInt(prop.get("duration"));
    const curTime = Date.now();
    console.log(curTime, " ", createdTime, " ", duration);
    return curTime < createdTime + duration;
  };

  const castVote = async (prop, voteType) => {
    console.log("vote casted ", voteType);
    const userPower = (props.userBal * 100) / props.totalTokens;
    prop.increment("voterCount");
    prop.increment("curWeightage", userPower);
    if (voteType === 1) {
      prop.increment("upVotes", userPower);
    } else {
      prop.increment("downVotes", userPower);
    }
    const voterList = prop.get("voterList");
    voterList.push(props.account.toLowerCase());
    prop.set("voterList", voterList);
    await prop.save();
    alert("vote casted successfully!");
    getAllProps();
  };

  //changes prop status on chain
  const changeStatusOnChain = async (prop) => {
    console.log(props.ownerWallet);
    const signer = props.ownerWallet.connect();
    const voteContract = new ethers.Contract(
      ContractAddress.Token,
      ContractAbi.abi,
      signer
    );

    let contractWithSigner = voteContract.connect(props.ownerWallet);
    let txn = await contractWithSigner.checkProposalStatus(
      parseInt(prop.get("pid"))
    );
    console.log("status: ", txn.toString(), " ", parseInt(prop.get("pid")));
    if (txn.toString() === "ongoing") {
      let newstatus = "";
      if (
        prop.get("requiredNumPpl") > prop.get("voterCount") ||
        prop.get("requiredWeightPercent") > prop.get("curWeightage") ||
        prop.get("requiredInFavor") > prop.get("upVotes")
      )
        newstatus = "failed";
      else {
        newstatus = "passed";
      }
      await contractWithSigner.changeStatus(
        parseInt(prop.get("pid")),
        newstatus
      );

      let txn = await contractWithSigner.checkProposalStatus(
        parseInt(prop.get("pid"))
      );
      console.log("newstatus: ", txn);
    }
  };

  //checks is prop passed or failed
  const checkIfPassed = (prop) => {
    // changeStatusOnChain(prop);
    if (
      prop.get("requiredNumPpl") > prop.get("voterCount") ||
      prop.get("requiredWeightPercent") > prop.get("curWeightage") ||
      prop.get("requiredInFavor") > prop.get("upVotes")
    )
      return false;
    return true;
  };

  const renderVotingBtn = (prop) => {
    if (
      props.userBal <= 0 &&
      !(props.account.toLowerCase() === props.owner.toLowerCase())
    ) {
      return (
        <div className="voting-not-allowed">You are not allowed to vote!</div>
      );
    }
    if (prop.get("voterList").indexOf(props.account.toLowerCase()) > -1) {
      return <div className="voting-not-allowed">You have already voted!</div>;
    }
    return (
      <div className="voting-buttons">
        <div
          className="upvote-btn"
          onClick={(e) => {
            e.preventDefault();
            castVote(prop, 1);
          }}
        >
          upvote
        </div>
        <div
          className="downvote-btn"
          onClick={(e) => {
            e.preventDefault();
            castVote(prop, 0);
          }}
        >
          downvote
        </div>
      </div>
    );
  };

  //renders proposal card;
  const renderProp = (prop, index) => {
    return (
      <div className="proposal-card" key={index}>
        <div className="proposal-top">
          <span>Proposal id #{index + 1}</span>
          {isNotExpired(prop) ? (
            <div className="prop-status ongoing">ongoing</div>
          ) : checkIfPassed(prop) ? (
            <div className="prop-status passed">passed</div>
          ) : (
            <div className="prop-status failed">failed</div>
          )}
        </div>
        <div className="prop-description">{prop.get("description")}</div>
        <div className="prop-votes-container">
          <div className="upvote-container">
            <span>Up votes</span>
            <div className="numvotes">{prop.get("upVotes")}</div>
          </div>
          <div className="downvote-container">
            <span>Down votes</span>
            <div className="numvotes">{prop.get("downVotes")}</div>
          </div>
        </div>
        <div className="cast-vote-container">
          {isNotExpired(prop) ? (
            props.isLoggedIn ? (
              renderVotingBtn(prop)
            ) : (
              <div className="voting-not-allowed">Login to vote!</div>
            )
          ) : (
            <div className="voting-not-allowed">Voting has Expired!</div>
          )}
        </div>
        <div className="prop-description">{`Created by: ${prop.get(
          "creator"
        )}`}</div>
        <div className="prop-footer-container">
          <div className="createdAt-container">
            <span>Created At: </span>
            <div className="createdAt">
              {dateConverter(prop.get("createdAt"))}
            </div>
          </div>
          <div className="duration-container">
            <span>duration: </span>
            <div className="duration">{prop.get("duration")}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="proposals-heading">Proposals</div>
      <div className="proposal-list">
        {allProposals ? (
          allProposals
            .slice(0)
            .reverse()
            .map((proposal, index) =>
              renderProp(proposal, allProposals.length - 1 - index)
            )
        ) : (
          <div className="loadingIndic">
            <LoadingIndicator />
          </div>
        )}
      </div>
    </>
  );
}

export default AllProposals;
