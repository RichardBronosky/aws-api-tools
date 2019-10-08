import React from 'react'
import { handleSubmit } from '../../../lib/helpers/shipping-costs'
import '../../../assets/css/components/customer-service/shipping-costs.sass'

export default ({ zipCode, errorMessage, setState }) => (
  <div className="shipping-costs">
    <div className="category">
      <h1 className="category-header">ESTIMATED SHIPPING COSTS</h1>
      <p className="category-text">
        Enter the zip code where the furniture is being DELIVERED to see the delivery costs to that area
      </p>
      { errorMessage && <div className="error-message">{ errorMessage }</div> }
      <form className="input-wrapper" onSubmit={ e => handleSubmit(e, zipCode, errorMessage, setState) }>
        <input
          className="zip-input"
          placeholder="Enter ZIP code"
          value={ zipCode }
          onChange={ e => setState({ zipCode: e.target.value }) }
        />
        <button className="submit-btn" type="submit">
          Go
        </button>
      </form>
    </div>
    <div className="category">
      <img
        src="//images.ctfassets.net/n86sd31cg9pg/2d4uJ6HKg8gIkSGoEYqIyw/aeadf3096828b82337e688714eb4b480/delivery-map2-bg.png"
        role="presentation"
        alt="Delivery Trucks"
      />
    </div>
    <div className="category">
      <h1 className="category-header">WHERE WE DELIVER</h1>
      <p className="category-text">
        Rooms To Go will deliver and set up your furniture purchase to the following states: Alabama, Florida, Georgia,
        South Carolina, North Carolina, Tennessee, Mississippi, Texas, Virginia and Kentucky. In addition, we deliver to
        many areas in Oklahoma, Massachusetts, New York, New Jersey, Pennsylvania, Maryland, Delaware, Connecticut,
        Louisiana, Rhode Island and Washington, D.C.
      </p>
    </div>
    <div className="category">
      <h1 className="category-header">FREE UPS DELIVERY</h1>
      <p className="category-text">
        While furniture delivery is not available to every state, many home accessories on roomstogo.com are shipped via
        UPS Standard Ground shipping. This merchandise is clearly identified and will be shipped anywhere in the
        Contiguous U.S. often at no shipping cost to the consumer.
      </p>
    </div>
    <div className="category">
      <h1 className="category-header">QUESTIONS AFTER DELIVERY</h1>
      <p className="category-text">Call Customer Care Center at 1-800-766-6786 with any concerns.</p>
      <p className="category-text">Hours:</p>
      <p className="category-text">Monday - Friday 8:00am - 8:00pm Eastern</p>
      <p className="category-text">Saturday - 8:00am - 6:00pm Eastern</p>
    </div>
  </div>
)
