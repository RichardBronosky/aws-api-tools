import React from 'react'
import '../../../assets/css/components/checkout/checkout-sticky/promo-modal.sass'
import Modal from 'react-modal'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({ promoDescriptions, modalOpen, closeModal }) => (
  <Modal
    isOpen={ modalOpen }
    onRequestClose={ closeModal }
    contentLabel="Offers Applied"
    className="promo-modal"
    overlayClassName="modal-overlay"
  >
    <div className="modal-content">
      <div className="title">
        <h2>Offers Applied</h2>
      </div>
      <ul className="desc-list">
        { promoDescriptions &&
          promoDescriptions.map((promo, index) => (
            <li key={ index } className="desc grid-x">
              <span className="small-12 medium-10 promo-desc">{ promo.desc }</span>
              <span className="small-12 medium-2 promo-amount">-${ promo.amount }</span>
            </li>
          )) }
      </ul>
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
