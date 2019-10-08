import React from 'react'
import Modal from 'react-modal'
import { setDeclineModalClose } from '../../../lib/helpers/checkout/global'
import loaderLight from '../../../assets/images/loader-light.svg'
import '../../../assets/css/components/checkout/checkout-parts/decline-modal.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({ modalOpen, loading, type }) => {
  return (
    <Modal
      isOpen={ modalOpen }
      onRequestClose={ setDeclineModalClose }
      contentLabel={ ` ${ type } Declined Modal` }
      className="decline-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <div className="grid-x">
          <div className="text-container small-12">
            <span className="msg">
              We were unable to authorize your { type }. Please select another payment type and resubmit your order. For
              help, please call <a href="tel:1-888-709-5380">1-888-709-5380</a> Option #1.
            </span>
          </div>
          <button
            className="blue-action-btn"
            tabIndex="0"
            value="Continue to Site"
            aria-label="Continue to Site"
            onClick={ setDeclineModalClose }
          >
            { !loading ? 'Close' : <img className="loader" alt={ `Close ${ type } decline modal` } src={ loaderLight } /> }
          </button>
        </div>
      </div>
    </Modal>
  )
}
