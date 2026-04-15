import React from 'react';
import './AccountDropdown.css';

const AccountDropdown = () => {
  return (
    <div className="account-dropdown-container">
      <button className="btn">
        <span>Account Settings</span>
        <i className="material-icons">public</i>
        <ul className="dropdown">
          <li className="active"><a href="#profile">Profile Information</a></li>
          <li><a href="#password">Change Password</a></li>
          <li><a href="#pro">Become <b>PRO</b></a></li>
          <li><a href="#help">Help</a></li>
          <li><a href="#logout">Log Out</a></li>
        </ul>
      </button>
    </div>
  );
};

export default AccountDropdown;