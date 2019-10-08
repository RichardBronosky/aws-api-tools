import React from 'react'
import Modal from 'react-modal'
import { closeSuggestionModal, acceptAddressSuggestion, declineAddressSuggestion } from '@helpers/checkout/global'
import './address-suggestion-modal.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({ modalOpen, order, suggestion, closeModal, setBillingState }) => {
  const orderAddress =
    order && closeModal
      ? order.billingAddress && [
          `${ order.billingAddress.address1 } ${
            order.billingAddress.address2 ? `${ order.billingAddress.address2 } ` : ''
          }`,
          `${ order.billingAddress.city } ${ order.billingAddress.state.toUpperCase() } ${ order.billingAddress.zip }`,
        ]
      : order.shippingAddress && [
          `${ order.shippingAddress.address1 } ${
            order.shippingAddress.address2 ? `${ order.shippingAddress.address2 } ` : ''
          }`,
          `${ order.shippingAddress.city } ${ order.shippingAddress.state.toUpperCase() } ${ order.shippingAddress.zip }`,
        ]
  const suggestedAddress = suggestion && suggestion.split(',')
  return (
    <Modal
      isOpen={ modalOpen }
      onRequestClose={ closeModal ? closeModal : closeSuggestionModal }
      contentLabel="Address Suggestion Modal"
      className="address-suggestion-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <span className="modal-title">We are having trouble verifying the address as it was entered.</span>
        <div className="grid-x">
          { suggestedAddress && (
            <div className="small-12 medium-6">
              <span className="modal-title">Suggested address:</span>
              <span className="address">{ suggestedAddress[0] }</span>
              <span className="address">{ suggestedAddress[1] }</span>
              <button
                className="accept-btn"
                tabIndex="0"
                value="accept address suggestion"
                aria-label="accept address suggestion"
                onClick={ () => acceptAddressSuggestion(suggestion, closeModal, setBillingState) }
              >
                ACCEPT ADDRESS SUGGESTION
              </button>
            </div>
          ) }
          <div className="small-12 medium-6">
            <span className="modal-title">Address as entered:</span>
            <span className="address">{ orderAddress[0] }</span>
            <span className="address">{ orderAddress[1] }</span>
            <button
              className="keep-btn"
              tabIndex="0"
              value="keep address as entered"
              aria-label="keep address as entered"
              onClick={ () => declineAddressSuggestion(closeModal, setBillingState) }
            >
              KEEP ADDRESS AS ENTERED
            </button>
          </div>
        </div>
        <button
          className="go-back"
          tabIndex="0"
          value="Close"
          aria-label="Close"
          onClick={ closeModal ? closeModal : closeSuggestionModal }
        >
          { '< GO BACK AND EDIT THE ADDRESS PROVIDED' }
        </button>
        <button
          className="close-modal"
          tabIndex="0"
          value="Close"
          aria-label="Close"
          onClick={ closeModal ? closeModal : closeSuggestionModal }
        >
          <img
            className="icon close"
            alt="close icon"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
          />
        </button>
      </div>
    </Modal>
  )
}
