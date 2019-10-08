import React, { Component } from 'react'

export default class LoginForm extends Component {
  render() {
    return (
      <form>
        <label htmlFor="login_email">*Email Address</label>
        <input type="email" className="login-field" placeholder="Email Address*" name="login_email" id="login_email" />
        <label htmlFor="login_password">*Password</label>
        <input
          type="password"
          className="login-field"
          placeholder="Password*"
          name="login_password"
          id="login_password"
        />
        <button tabIndex="0" className="blue-action-btn" value="Sign In" aria-label="Sign In" name="signin_btn">
          Sign In
        </button>
      </form>
    )
  }
}
