import React from "react";
import { useState } from "react";
import Moralis from "moralis";
import "./styles/createProposal.css";
function CreateProposal(props) {
  const [proposal, setProposal] = useState("");
  const [numPpl, setNumPpl] = useState(0);
  const [weightPercent, setWeightPercent] = useState(0);
  const [inFavor, setInFavor] = useState(0);
  const [duration, setDuration] = useState(300000);
  const createNewProposal = async () => {
    console.log(proposal);
    console.log(numPpl);
    console.log(weightPercent);
    console.log(inFavor);
    console.log(duration);

    try {
      const Proposals = Moralis.Object.extend("Proposals");
      let Proposal = new Proposals();
      Proposal.set("description", proposal);
      Proposal.set("timeCreated", Date.now());
      Proposal.set("duration", duration.toString());
      Proposal.set("requiredNumPpl", numPpl);
      Proposal.set("requiredWeightPercent", weightPercent);
      Proposal.set("requiredInFavor", inFavor);
      Proposal.set("upVotes", 0);
      Proposal.set("downVotes", 0);
      Proposal.set("voterCount", 0);
      Proposal.set("curWeightage", 0);
      Proposal.set("creator", props.account);
      Proposal.set("voterList", ["0x0"]);
      await Proposal.save();
      alert("Proposal created!");
      console.log("Proposal sent from : ", Proposal);
    } catch (error) {
      console.log(error);
      alert("error...retry again !");
    }
  };
  const renderForm = () => {
    return (
      <>
        <form
          action=""
          className="proposal-form"
          onSubmit={(e) => {
            e.preventDefault();
            // console.log("kkk");
            createNewProposal();
          }}
        >
          <div className="form-entry">
            <label htmlFor="" className="label">
              Proposal
            </label>
            <input
              type="text"
              value={proposal}
              className="proposal-input-field"
              onChange={(e) => setProposal(e.target.value)}
            />
          </div>
          <div className="num-people-container">
            <label htmlFor="" className="">
              Minimum number of people required
            </label>
            <input
              type="text"
              value={numPpl}
              className="numpeople-input-field"
              onChange={(e) => setNumPpl(e.target.value)}
            />
          </div>
          <div className="num-people-container">
            <label htmlFor="" className="">
              Minimum percentage of authority required for voting to take effect
            </label>
            <input
              type="text"
              value={weightPercent}
              className="numpeople-input-field"
              onChange={(e) => setWeightPercent(e.target.value)}
            />
          </div>
          <div className="num-people-container">
            <label htmlFor="" className="">
              percentage authority required in favor for proposal to pass
            </label>
            <input
              type="text"
              value={inFavor}
              className="numpeople-input-field"
              onChange={(e) => setInFavor(e.target.value)}
            />
          </div>
          <div className="num-people-container">
            <label htmlFor="">Duration</label>
            <select
              className="numpeople-input-field"
              onChange={(e) => {
                setDuration(e.target.value);
                console.log(duration);
              }}
            >
              <option value={300000} data-num={300000}>
                5min
              </option>
              <option value={43200000} data-num={43200000}>
                12h
              </option>
              <option value={86400000} data-num={86400000}>
                One Day
              </option>
              <option value={604800000} data-num={604800000}>
                One Week
              </option>
              <option value={1209600000} data-num={1209600000}>
                2 Weeks
              </option>
              <option value={2419200000} data-num={2419200000}>
                One Month
              </option>
              <option value={7257600000} data-num={7257600000}>
                3 Months
              </option>
            </select>
          </div>

          <div className="prop-submit-btn">
            <input
              className="prop-submit-btn-input"
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      </>
    );
  };
  return props.isLoggedIn ? (
    props.account.toLowerCase() === props.owner.toLowerCase() ||
    props.userBal > 0 ? (
      <div className="CreateProposal-container">
        <span style={{ paddingTop: "5px" }}>Create Proposal</span>
        <div className="render-form">{renderForm()}</div>
      </div>
    ) : (
      <div className="notAllowed">
        Only token holders are allowed to create Proposals!
      </div>
    )
  ) : (
    <div className="notAllowed">login with metamask first!!</div>
  );
}

export default CreateProposal;
