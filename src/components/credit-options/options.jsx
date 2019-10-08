import React from 'react'
import RTGCreditModal from '../checkout/checkout-parts/payment-section/rtg-credit-modal'
import { months } from '../../lib/helpers/string-helper'
import '../../assets/css/components/credit-options/options.sass'

export default ({
  promoModalOpen,
  postbackRefId,
  accountError,
  financePlan,
  setModalOpen,
  setAccount,
  onKeyDown,
  accountSubmit,
  endDate,
}) => (
  <div className="grid-container">
    <div className="grid-x card options-info">
      <div className="small-12 cell grid-x">
        <div className="cell medium-4">
          <img src={ `${ process.env.GATSBY_S3_IMAGE_URL }shopOnline.jpg` } alt="" aria-hidden="true" role="presentation" />
        </div>
        <div className="cell medium-8">
          <div className="top-info">
            <h2>Open A Rooms To Go Account - Credit Extended by Synchrony Bank</h2>
            <p>
              With a Rooms To Go account, you will be able to take advantage of exclusive financing offers in your area.
              Click below to fillout our online application.
            </p>
            <div className="cell medium-6 ">
              <form
                id="creditApplnForm"
                name="frmApplicationTermsCond"
                action={ process.env.GATSBY_SYNCHRONY_URL }
                method="POST"
                target="_blank"
              >
                <input type="hidden" id="uniqueId" name="uniqueId" value={ process.env.GATSBY_CREDIT_UNIQUE_ID } />
                <input type="hidden" id="postbackRefId" name="postbackRefId" value={ postbackRefId } />
                <input type="hidden" name="pcgc" value={ process.env.GATSBY_CREDIT_PCGC } />
                <input type="hidden" name="mid" value={ process.env.GATSBY_CREDIT_MID } />
                <input
                  role="link"
                  id="applyFinance"
                  type="submit"
                  data-seo="applyFinance"
                  className="blue-action-btn"
                  aria-label="Continue with online application (opens in new window)"
                  value="Continue with online application"
                />
              </form>

              <p>
                Please note that online finance offers may be different from advertised credit promotions available in
                showrooms.
              </p>
            </div>
          </div>
          <hr />
          <div className="mid-banner">
            <button className="link no-margin" onClick={ () => setModalOpen(true) }>
              <span className="plantitle">Interest free financing for 60 months*</span>
              <span className="plantext">On purchases priced at $999.99 and up made with your Rooms To Go credit card through 10/14/19. </span>
              <span className="plantext">Equal Monthly Payments required for 60 months.* Monthly payments shown are only applicable with this special financing offer.</span>
              <span className="plantext">Rooms To Go requires a down payment equal to sales tax and delivery.</span>
              <span className="plantext click-here">Click Here for More Details ></span>
            </button>
            { promoModalOpen &&
              financePlan.promoMessage &&
              financePlan.promoMessage.childMarkdownRemark &&
              financePlan.promoMessage.childMarkdownRemark.html && (
                <RTGCreditModal
                  modalOpen={ promoModalOpen }
                  closeModal={ () => setModalOpen(false) }
                  promoMessage={ financePlan.promoMessage }
                />
              ) }
          </div>
          <hr />
          <div className="bottom-info grid-x">
            <div className="cell medium-8">
              <p>Manage Your Existing Rooms To Go Account</p>
              <p>If you already have a Rooms To Go account and would like to access it,</p>
              <p>please enter the first six digits of your account number below.</p>
              <div className="login-list">
                <h3>Logging in allows you to:</h3>
                <ul>
                  <li>Pay your Bill</li>
                  <li>Check your available balance</li>
                  <li>Manage your account</li>
                </ul>
              </div>

              <div className="account-number-lookup cell grid-x">
                <div className="cell medium-12">
                  <label htmlFor="accountNumber">First Six Digits of Your Account Number</label>
                </div>
                { accountError && <p className="error">{ accountError }</p> }
                <input
                  type="form"
                  className="login-field"
                  placeholder="Account Number"
                  aria-label="accountNumber"
                  id="accountNumber"
                  name="accountNumber"
                  aria-required="true"
                  onKeyDown={ e => onKeyDown(e) }
                  onChange={ e => setAccount(e.target.value) }
                />
                <button
                  value="account-number-submit"
                  name="account-btn"
                  className="account-btn"
                  id="account-btn"
                  gtm-category="account-input-form"
                  gtm-action="account-login"
                  onClick={ () => accountSubmit() }
                >
                  GO
                </button>
              </div>
            </div>
            <div className="cell medium-4 cc-img">
              <img
                src={ `${ process.env.GATSBY_S3_IMAGE_URL }rtg-credit-cards-l.gif` }
                alt=""
                aria-hidden="true"
                role="presentation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
