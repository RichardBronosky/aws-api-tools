import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import Button from './button'
import '../../assets/css/components/shared/coupon.sass'
import { contentfulImage } from '../../lib/helpers/contentful'
import { navigate } from 'gatsby'

export default class Coupon extends PureComponent {
  render() {
    const coupon = this.props.data
    const backgroundImage = coupon.backgroundImage ? `url(${ contentfulImage(coupon.backgroundImage.file.url) })` : ''
    let gtm
    if (coupon && coupon.contentLink) {
      gtm = {
        category: coupon.contentLink.category,
        action: coupon.contentLink.action,
        label: coupon.contentLink.label,
        value: coupon.contentLink.value,
      }
    }
    return (
      <div
        gtm-category={ gtm && gtm.category }
        gtm-action={ gtm && gtm.action }
        gtm-label={ gtm && gtm.label }
        gtm-value={ gtm && gtm.value }
        onClick={ () => {
          if (coupon.contentLink.url) {
            window && window.open(coupon.contentLink.url, '_blank')
          } else {
            navigate((coupon.contentLink.internalUrl && coupon.contentLink.internalUrl.url) || coupon.contentLink.slug)
          }
        } }
      >
        <div
          className={ `contentful-coupon card pop-out align-${ coupon.contentAlignment }` }
          style={ { backgroundImage: backgroundImage } }
        >
          <div
            dangerouslySetInnerHTML={ {
              __html: coupon.content.childMarkdownRemark.html,
            } }
          />
          <Button data={ coupon.button } />
          { coupon.disclaimer && (
            <div className="disclaimer" style={ { color: coupon.disclaimerFontColor || '#333' } }>
              *{ coupon.disclaimer }
            </div>
          ) }
        </div>
      </div>
    )
  }
}

export const couponFragment = graphql`
  fragment Coupon on ContentfulCoupon {
    contentAlignment
    content {
      childMarkdownRemark {
        html
      }
    }
    contentLink {
      ...Link
    }
    button {
      ...Button
    }
    backgroundImage {
      ...Image
    }
    disclaimer
    disclaimerFontColor
    contentful_id
    __typename
  }
`
