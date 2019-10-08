import React, { Component } from 'react'

export default class Register extends Component {
  render() {
    return (
      <form>
        <label htmlFor="first_name">First Name*</label>
        <input
          type="text"
          className="login-field small"
          placeholder="First Name*"
          aria-label="First Name*"
          id="first_name"
          name="first_name"
        />
        <label htmlFor="last_name">Last Name*</label>
        <input
          type="text"
          className="login-field small"
          placeholder="Last Name*"
          aria-label="Last Name*"
          id="last_name"
          name="last_name"
        />
        <label htmlFor="email">Email Address*</label>
        <input
          type="email"
          className="login-field"
          placeholder="Email Address*"
          aria-label="Email Address*"
          id="email"
          name="email"
        />
        <label htmlFor="confirm_email">Confirm Email*</label>
        <input
          type="email"
          className="login-field"
          placeholder="Confirm Email*"
          aria-label="Confirm Email*"
          id="confirm_email"
          name="confirm_email"
        />
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          className="login-field"
          placeholder="Password*"
          aria-label="Password*"
          id="password"
          name="password"
        />
        <label htmlFor="confirm_password">Confirm Password*</label>
        <input
          type="password"
          className="login-field"
          placeholder="Confirm Password*"
          aria-label="Confirm Password*"
          id="confirm_password"
          name="confirm_password"
        />
        <label htmlFor="zip_code">Zip Code</label>
        <input
          type="text"
          className="login-field small"
          placeholder="Zip Code*"
          aria-label="Zip Code*"
          id="zip_code"
          name="zip_code"
        />
        <div className="required">
          <span className="asterisk">*</span> Required fields
        </div>
        <button
          tabIndex="0"
          className="blue-action-btn"
          value="Create Account"
          aria-label="Create Account"
          name="create_account_btn"
        >
          Create Account
        </button>
      </form>
    )
  }
}
