import React from 'react'
import { weekdays, months } from '../../../../lib/helpers/string-helper'
import { setReviewInfo } from '../../../../lib/helpers/checkout/review-section'
import '../../../../assets/css/components/checkout/checkout-parts/review-section.sass'

export default ({ reviewInfo, order, invalidFields }) => {
  let deliveryDate, day, month, dayNum, year
  if (order.deliveryDate) {
    deliveryDate = new Date(new Date(order.deliveryDate).setHours(new Date(order.deliveryDate).getHours() + 6))
    day = weekdays[deliveryDate.getDay()]
    month = months[deliveryDate.getMonth()]
    dayNum = deliveryDate.getDate()
    year = deliveryDate.getFullYear()
  }
  return (
    <form className="review-form">
      <p className="review-text">Please review your order above and make any changes you need.</p>
      { invalidFields && invalidFields.length > 0 && !reviewInfo.accept && !invalidFields.includes('order') && (
        <p className="invalid">*You must accept the terms and conditions before continuing.</p>
      ) }
      { invalidFields && invalidFields.includes('order') && (
        <p className="invalid">There was an issue placing your order.</p>
      ) }
      <div className="checkbox-container">
        <input
          type="checkbox"
          name="Accept Terms and Conditions"
          aria-label="Accept Terms and Conditions"
          checked={ reviewInfo.accept }
          onChange={ e => setReviewInfo(e.target.checked, 'acceptTerms') }
        />
        <div className="text-container">
          <p className="accept-text">By checking this box, I acknowledge that I have read and agree to the</p>
          <a
            className="accept-link"
            href="https://misc.rtg-prod.com/rtgcom-terms-of-sale.pdf"
            target="_blank"
            title="Terms and Conditions of Sale"
            aria-label="Terms and Conditions of Sale"
          >
            Rooms To Go Terms and Conditions of Sale, Limited Product Warranty, and Dispute Resolution/Arbitration
            Agreement
          </a>
          <p className="accept-text">&nbsp;and</p>
          <a
            className="accept-link"
            href="https://misc.rtg-prod.com/rtg-terms-of-use.pdf"
            target="_blank"
            title="Terms and Conditions of Use"
            aria-label="Terms and Conditions of Use"
          >
            Terms of Use
          </a>
          .
        </div>
        { order.isPickup && (
          <>
            <br />
            <input
              type="checkbox"
              name="Accept Pickup Terms"
              aria-label="Accept Pickup Terms"
              checked={ reviewInfo.accept }
              onChange={ e => setReviewInfo(e.target.checked, 'acceptPickupTerms') }
            />
            <div className="text-container">
              <p className="accept-text">
                I confirm that I have chosen { day ? day : 'weekday' }, { month ? month : 'month' }{ ' ' }
                { dayNum ? dayNum : 'day' }, { year ? year : 'year' } as my pickup date. I understand that the person
                associated with the billing account must be present at the time of pickup with a valid, government
                issued ID. I acknowledge that wait time could be up to two hours and that I am responsible for the
                transportation and assembly of all furniture picked up. If necessary, I will reschedule my pick up date
                online or by calling customer service at 1-800-766-6786.
              </p>
            </div>
          </>
        ) }
      </div>
    </form>
  )
}
