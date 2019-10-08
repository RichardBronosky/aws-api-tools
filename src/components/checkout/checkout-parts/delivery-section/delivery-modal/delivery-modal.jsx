import React from 'react'
import Modal from 'react-modal'
import ReactToolTip from 'react-tooltip'
import DeliveryDatePicker from './delivery-date-picker'
import DistributionCenterPopup from '../distribution-center-popup'
import {
  getDistributionDaysClosed,
  getDistributionCenterHours,
} from '../../../../../lib/helpers/checkout/delivery-section'
import { getStore } from '../../../../../lib/helpers/store-locator'
import loaderLight from '../../../../../assets/images/loader-light.svg'
import CheckoutInput from '../../checkout-input'
import '../../../../../assets/css/components/checkout/checkout-parts/delivery-section/delivery-modal.sass'

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#___gatsby')

export default ({
  modalOpen,
  order,
  closeModal,
  setSelectedPickupDate,
  setSelectedDeliveryDate,
  loading,
  deliveryModalInfo,
  setDeliveryModalInfo,
  error,
  deliveryCalendar,
  selectedPickupDate,
  selectedDeliveryDate,
  updateDeliveryDate,
}) => {
  const daysClosed = getDistributionDaysClosed(order)
  const calendarType = order && order.calendarType
  const store = getStore(order)
  return (
    <Modal
      isOpen={ modalOpen }
      onRequestClose={ closeModal }
      contentLabel="Add To Cart Modal"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <div className="grid-x">
          <div className="content-container">
            <div className="cell small-12 title">
              <h2>Change Your Delivery</h2>
            </div>
            <div className="cell small-12">
              <div className="grid-x grid-margin-x grid-margin-y">
                <div className="horizontal-center cell small-12 medium-4 medium-offset-2" />
              </div>
            </div>
            <div className="cell radio-container small-12">
              <CheckoutInput
                type="radio"
                className="text-me"
                field="deliver"
                info={ deliveryModalInfo }
                setInfo={ setDeliveryModalInfo }
                name="deliver"
                afterComponent={ <span className="radio-label" /> }
                radioValue={ true }
              />
              <img
                className="icon shipping"
                alt=""
                aria-hidden="true"
                role="presentation"
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2096.4%2049.1%22%3E%3Ctitle%3Eicon-shipping%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M26.3%2C43.2H33a1.27%2C1.27%2C0%2C0%2C0%2C.6-.1%2C7%2C7%2C0%2C0%2C0%2C13.8.1h28a7%2C7%2C0%2C0%2C0%2C13.8%2C0h5.5a1.75%2C1.75%2C0%2C0%2C0%2C1.7-1.7V22.8c0-4.8-1.3-8.7-3.9-11.5a12.75%2C12.75%2C0%2C0%2C0-9.5-4H73V1.7A1.75%2C1.75%2C0%2C0%2C0%2C71.3%2C0h-45a1.75%2C1.75%2C0%2C0%2C0-1.7%2C1.7V41.5A1.75%2C1.75%2C0%2C0%2C0%2C26.3%2C43.2Zm56%2C2.4A3.6%2C3.6%2C0%2C1%2C1%2C85.9%2C42%2C3.59%2C3.59%2C0%2C0%2C1%2C82.3%2C45.6ZM73%2C10.7H83c6.2%2C0%2C10%2C4.6%2C10%2C12v17H88.9A7.14%2C7.14%2C0%2C0%2C0%2C82.3%2C35a7%2C7%2C0%2C0%2C0-6.6%2C4.7H73.1v-29ZM40.6%2C45.6A3.6%2C3.6%2C0%2C1%2C1%2C44.2%2C42%2C3.72%2C3.72%2C0%2C0%2C1%2C40.6%2C45.6ZM28%2C3.4H69.5V39.7H47.8a1.27%2C1.27%2C0%2C0%2C0-.6.1A7%2C7%2C0%2C0%2C0%2C40.5%2C35a7.12%2C7.12%2C0%2C0%2C0-6.7%2C4.9%2C1.88%2C1.88%2C0%2C0%2C0-.8-.2H28ZM0%2C11.8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4H1.7A1.75%2C1.75%2C0%2C0%2C1%2C0%2C11.8ZM18.1%2C23.3H4.3a1.7%2C1.7%2C0%2C0%2C1%2C0-3.4H18.1a1.7%2C1.7%2C0%2C0%2C1%2C0%2C3.4Zm-13.2%2C8a1.75%2C1.75%2C0%2C0%2C1%2C1.7-1.7H18A1.7%2C1.7%2C0%2C1%2C1%2C18%2C33H6.6A1.63%2C1.63%2C0%2C0%2C1%2C4.9%2C31.3Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
              />
              <div className="delivery-selection">
                <div className="prof-delivery">
                  { selectedDeliveryDate && selectedDeliveryDate.isExpressDelivery && (
                    <p className="bold inline">EXPRESS</p>
                  ) }
                  Professional delivery and set-up to any room
                </div>
                <p className="bold">${ order && order.tentativeDeliveryCharge && order.tentativeDeliveryCharge }</p>
                <p className="delivered-on">
                  { calendarType !== 'weekly' ? 'Delivered on:' : 'Leaving our warehouse on:' }
                </p>
                <p className="bold margin-left">{ `${ selectedDeliveryDate.readable }` }</p>
                { selectedDeliveryDate && selectedDeliveryDate.isExpressDelivery ? (
                  <>
                    <p className="bold">
                      Requires 15 hour delivery window (7AM - 10PM){ ' ' }
                      <span data-tip data-for="expressTip" className="expressWhy">
                        why?
                      </span>
                    </p>
                    <ReactToolTip id="expressTip" place="top" type="dark" effect="float">
                      Based on your delivery zip code and because the trucks are electronically routed by customer
                      address, we cannot establish your specific delivery window ahead of time.
                    </ReactToolTip>
                  </>
                ) : (
                  <p className="bold">4 hour delivery window</p>
                ) }
                { selectedDeliveryDate && selectedDeliveryDate.isExpressDelivery && (
                  <>
                    <p className="automated-message">No advance call ahead</p>
                    <p className="automated-message">Order must be completed before 2pm EST to receive selected date</p>
                  </>
                ) }
                { (deliveryCalendar[0].date !== selectedDeliveryDate.date || !deliveryCalendar[0].isExpressDelivery) &&
                  calendarType !== 'weekly' && (
                    <p className="automated-message">
                      Our automated system will call 2 days prior to notify you of the estimated delivery window.
                    </p>
                  ) }
                { (deliveryCalendar[0].date !== selectedDeliveryDate.date || !deliveryCalendar[0].isExpressDelivery) &&
                  calendarType === 'weekly' && (
                    <p className="automated-message">
                      IMPORTANT:The date that you select is the estimated date that your order will leave our
                      distribution center. You will be contacted with delivery information as follows:
                      <br />
                      <br />
                      You will receive a call from Rooms To Go on the Thursday prior to the date that you select. This
                      call will identify the specific date and time that your merchandise will be delivered, within 12
                      days from the Monday you choose for your departure date.
                    </p>
                  ) }
                { deliveryCalendar && deliveryModalInfo.deliver && (
                  <DeliveryDatePicker
                    dates={ deliveryCalendar.filter(date => date.isStandardDelivery) }
                    selectedDate={ selectedDeliveryDate }
                    setSelectedDate={ setSelectedDeliveryDate }
                    order={ order }
                  />
                ) }
              </div>

              { selectedPickupDate && store && order && order.pickupCalendar && order.pickupCalendar.length > 0 && (
                <>
                  <div className="divider" />
                  <CheckoutInput
                    type="radio"
                    className="text-me"
                    field="pickup"
                    info={ deliveryModalInfo }
                    setInfo={ setDeliveryModalInfo }
                    name="pickup"
                    afterComponent={ <span className="radio-label" /> }
                    radioValue={ true }
                  />
                  <img
                    className="icon store"
                    alt="store"
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTQgMTB2N2gzdi03SDR6bTYgMHY3aDN2LTdoLTN6TTIgMjJoMTl2LTNIMnYzem0xNC0xMnY3aDN2LTdoLTN6bS00LjUtOUwyIDZ2MmgxOVY2bC05LjUtNXoiLz48L3N2Zz4="
                  />
                  <div className="delivery-selection">
                    <div className="prof-delivery">
                      Pick-up at <DistributionCenterPopup order={ order } />
                    </div>
                    <p className="delivered-on">Pick-up date:</p>
                    <p className="bold margin-left">
                      { `${ selectedPickupDate.readable }, anytime ${ getDistributionCenterHours(
                        order,
                        selectedPickupDate
                      ) }` }
                    </p>
                    { deliveryCalendar && deliveryModalInfo.pickup && (
                      <>
                        <DeliveryDatePicker
                          dates={ deliveryCalendar.filter(date => date.isPickup) }
                          selectedDate={ selectedPickupDate }
                          setSelectedDate={ setSelectedPickupDate }
                          pickup
                        />
                        { daysClosed && daysClosed.length > 0 && (
                          <p className="note">NOTE: This distribution center is closed { daysClosed }.</p>
                        ) }
                        <div className="divider" />
                        <p className="pick-up-list-head">Important things to know about customer pick-up:</p>
                        <ul className="pick-up-list">
                          <li>Photo ID matching the billing name on the order required at time of pick up.</li>
                          <li>Wait times vary. Please allow 1-2 hours for picking up your order.</li>
                          <li>Customer is responsible for transportation and assembly of merchandise.</li>
                          <li>To change pick up date, call 1-800-766-6786 or access online via Order Status.</li>
                          <li>Furniture may only be picked up on the scheduled date.</li>
                        </ul>
                      </>
                    ) }
                  </div>
                </>
              ) }
            </div>
          </div>
          <div className="update-container cell small-12">
            { error && <p className="error">There was an error updating your delivery options. Please try again.</p> }
            <button
              className="update-delivery"
              tabIndex="0"
              value="Update Delivery"
              aria-label="Update Delivery"
              onClick={ () =>
                updateDeliveryDate(
                  deliveryModalInfo.deliver ? selectedDeliveryDate : selectedPickupDate,
                  deliveryModalInfo.pickup
                ) }
            >
              { !loading ? (
                'update delivery'
              ) : (
                <img className="loader" src={ loaderLight } alt="updating delivery options" />
              ) }
            </button>
          </div>
          <button className="close-modal" tabIndex="0" value="Close" aria-label="Close" onClick={ closeModal }>
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
}
