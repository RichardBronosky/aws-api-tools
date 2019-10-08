import React from 'react'
import Modal from 'react-modal'
import '@comp-sass/product/product-parts/add-to-cart-modal.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

const InfoModal = props => (
  <Modal
    isOpen={ props.shouldShowModal }
    contentLabel={ props.label }
    className={ `info-modal add-to-cart-modal ${ props.mdlClass }` }
    onRequestClose={ props.closeModal }
    overlayClassName="modal-overlay"
  >
    <div className="modal-content">
      <div className="grid-x">
        <div className="text-container small-12">{ props.children }</div>
        <button
          className="close-modal"
          tabIndex="0"
          value="Close"
          aria-label="Close"
          onClick={ props.closeModal }
        >
          <img
            className="icon close"
            alt="close icon"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
          />
        </button>
      </div>
    </div>
  </Modal>
)

export default InfoModal
