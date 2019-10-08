import React from 'react'
import Modal from 'react-modal'
import '../../../../assets/css/components/checkout/checkout-parts/payment-section/rtg-credit-modal.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({ promoMessage, modalOpen, closeModal }) => (
  <Modal
    isOpen={ modalOpen }
    onRequestClose={ closeModal }
    contentLabel="Rooms To Go Finance Details"
    className="rtg-credit-modal"
    overlayClassName="modal-overlay"
  >
    <div className="modal-content">
      { promoMessage && promoMessage.childMarkdownRemark && promoMessage.childMarkdownRemark.html && (
        <div dangerouslySetInnerHTML={ { __html: promoMessage.childMarkdownRemark.html } } />
      ) }
      <button className="close-modal" tabIndex="0" value="Close" aria-label="Close" onClick={ closeModal }>
        <img
          className="icon close"
          alt="close icon"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
        />
      </button>
    </div>
  </Modal>
)
