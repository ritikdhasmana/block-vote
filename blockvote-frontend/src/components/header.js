import React from "react";
import { Link } from "react-router-dom";
import "./styles/header.css";
const Header = (props) => {
  return (
    <div className="navbar">
      <div className="header-logo">
        <Link to="/">
          <span className="block-logo">block</span>
          <span className="vote-logo">VOTE</span>
        </Link>
      </div>
      <div className="menu">
        <div className="create-prop">
          <Link to="/createProposal">Create</Link>
        </div>
        <div className="mint-token">
          <Link to="/mint-tokens">Mint</Link>
        </div>
      </div>
      <div className="menu">
        {props.isLoggedIn ? (
          <div className="user-address">
            {props.account.slice(0, 2) + "..." + props.account.slice(38, 43)}
          </div>
        ) : (
          <div className="connect-button" onClick={props.login}>
            Connect
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
