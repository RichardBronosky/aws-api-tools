import React from 'react'
import { connect } from 'react-redux'
import ReviewSection from './review-section'

class ReviewSectionWrapper extends React.Component {
  state = {
    acceptTerms: false,
    acceptPickupTerms: false,
  }

  render() {
    const { order, checkoutStep, invalidFields } = this.props
    return (
      <>
        { checkoutStep === 'review' && (
          <ReviewSection order={ order } reviewInfo={ order.reviewInfo } invalidFields={ invalidFields } />
        ) }
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    order: state.checkout.order,
    checkoutStep: state.checkout.checkoutStep,
    invalidFields: state.checkout.reviewInvalidFields,
  }
}

export default connect(mapStateToProps)(ReviewSectionWrapper)
