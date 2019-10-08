import React from 'react'
import '../../../../assets/css/components/checkout/checkout-parts/shipping-section/shipping-condensed.sass'

export default ({ order }) => {
  const shippingInfoArr = order.shippingAddress.addressLookup.split(',')
  return (
    <div className="shipping-condensed">
      <div className="left-info">
        { order.contact.firstName + ' ' + order.contact.lastName }
        <br />
        { order.shippingAddress.addressLookup && order.shippingAddress.addressLookupSuccess && (
          <>
            { shippingInfoArr[0] }
            <br />
            { shippingInfoArr[1] }
          </>
        ) }
        { !order.shippingAddress.addressLookupSuccess && (
          <>
            { order.shippingAddress.address1 }
            { order.shippingAddress.address2 !== '' && ' ' + order.shippingAddress.address2 }
            <br />
            { order.shippingAddress.city + ' ' }
            { order.shippingAddress.state + ' ' }
            { order.shippingAddress.zip }
          </>
        ) }
      </div>
      <div className="right-info">
        { order.contact.email }
        <br />
        { order.contact.phone }
        <br />
        { order.contact.altPhone && `Alt. Phone: ${ order.contact.altPhone }` }
      </div>
    </div>
  )
}
