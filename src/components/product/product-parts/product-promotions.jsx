import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ProductPromotion from './product-promotion'
import arrowUp from '../../../assets/images/icons8-chevron-up-24-white.png'
import arrowDown from '../../../assets/images/icons8-chevron-down-filled-24-white.png'
import '../../../assets/css/components/product/product-parts/product-promotions.sass'
import { productAvailability } from '../../../lib/helpers/product'
import PromotionContentGroup from '../../shared/promotion-content-group'

class ProductPromotions extends React.Component {
  state = {
    expanded: false,
  }

  toggleExpanded = () => {
    if (this.state.expanded) {
      this.props.scrollToBonusBuys()
    }
    this.setState({
      expanded: !this.state.expanded,
    })
  }
  onKeyDown = event => {
    let code = event.keyCode || event.which
    if (code === 13 || code === 32) {
      this.toggleExpanded()
    }
    if (code === 27) {
      this.setState({ expanded: false })
    }
  }

  render() {
    const { product, promotions, isMobile, promoType } = this.props
    const { expanded } = this.state
    let otherPromos, promoTargetSkus
    if (promotions.target_skus.length > 1) {
      otherPromos = promotions.target_skus.filter(
        promo => promo.sku !== promotions.target_skus[0].sku && productAvailability(promo)
      )
      promoTargetSkus = promotions.target_skus.map(item => {
        return item.sku
      })
    }
    return (
      <div className="promotions cell grid-x">
        { promoType === 'BUY X AMOUNT GET Y DISCOUNT' && <PromotionContentGroup targetSkus={ promoTargetSkus } /> }
        { promoType !== 'BUY X AMOUNT GET Y DISCOUNT' && (
          <>
            <div className="promotions-heading small-12">
              <div className="text">{ `${ promotions.offer_description }${
                promotions.offer_limit && parseInt(promotions.offer_limit) > 0
                  ? ` (limit: ${ promotions.offer_limit })`
                  : ''
              }` }</div>
            </div>
            <div className={ classNames('promotions-container grid-x cell', { mobile: isMobile }) }>
              { promotions.target_skus && (
                <>
                  <ProductPromotion
                    product={ product }
                    promo={ promotions.target_skus[0] }
                    promoDescription={ promotions.offer_description }
                    qualifierQuantity={ promotions.qualifier_value }
                    targetQuantity={ promotions.target_value }
                  />
                  { otherPromos && otherPromos.length > 0 && (
                    <>
                      { expanded && (
                        <div id="promo-accordion">
                          { otherPromos.map((promo, index) => (
                            <ProductPromotion
                              key={ index }
                              product={ product }
                              promo={ promo }
                              qualifierQuantity={ promotions.qualifier_value }
                              targetQuantity={ promotions.target_value }
                            />
                          )) }
                        </div>
                      ) }
                      <div className="button-grid grid-x">
                        <button
                          className="more-offers-expander"
                          tabIndex="0"
                          aria-expanded={ expanded }
                          aria-controls="promo-accordion"
                          onKeyDown={ e => this.onKeyDown(e) }
                          onClick={ () => this.toggleExpanded() }
                        >
                          { expanded ? 'Less ' : 'More ' } Offers
                          { expanded ? (
                            <img
                              className="arrowUp"
                              src={ arrowUp }
                              alt="expand more offers"
                              title="Expand  more offers"
                            />
                          ) : (
                            <img
                              className="arrowDown"
                              src={ arrowDown }
                              alt="collapse more offers"
                              title="Collapse more offers"
                            />
                          ) }
                        </button>
                      </div>
                    </>
                  ) }
                </>
              ) }
            </div>
          </>
        ) }
      </div>
    )
  }
}

const mapStateToProps = ({ isMobile }) => {
  return { isMobile }
}

export default connect(mapStateToProps)(ProductPromotions)
