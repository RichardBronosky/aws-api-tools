import React from 'react'
import RTGLink from '../../shared/link'
import AddToCart from './product-add-to-cart'
import { productPrice, productAvailability } from '../../../lib/helpers/product'
import { slugGenerator, currencyFormatUS } from '../../../lib/helpers/string-helper'
import { getRegionZone } from '../../../lib/helpers/geo-location'
import { fetchPromotions } from '../../../lib/services/checkout'
import { productFinancing } from '../../../lib/helpers/finance'
import ProductFinancing from './product-financing'
import { productUrl } from '../../../lib/helpers/route'

class ProductPromotion extends React.Component {
  state = {
    promotion: null,
    finance: null,
  }

  componentDidMount() {
    this.setupPromo()
  }

  setupPromo = () => {
    const { product, promo, qualifierQuantity, targetQuantity } = this.props

    if (promo && targetQuantity && qualifierQuantity) {
      let requestItems = [
        {
          sku: product.sku,
          quantity: parseInt(qualifierQuantity),
        },
        {
          sku: promo.sku,
          quantity: parseInt(targetQuantity),
        },
      ]

      fetchPromotions({
        requestItems: requestItems,
        region: getRegionZone().region,
        zone: getRegionZone().zone,
      }).then(data => {
        this.setState({
          promotion: data,
          finance: productFinancing(data.cartTotal),
        })
      })
    }
  }

  render() {
    const { product, promo, promoDescription, qualifierQuantity, targetQuantity } = this.props
    const { promotion, finance } = this.state
    return (
      <>
        { promotion && promotion.totalSavings > 0 && (
          <div className="promotion-entry grid-x card">
            <div className="cell small-12 medium-7 large-9 grid-x">
              <div className="cell card promotion-product small-12 medium-12 large-5 grid-x">
                { qualifierQuantity > 1 && <div className="promo-count">qty: { qualifierQuantity }</div> }
                <div className="cell promotion-image-container small-3">
                  <img
                    src={ `${ product.grid_image ? product.grid_image : product.primary_image }&h=150` }
                    alt={ product.title ? product.title : product.sku }
                  />
                </div>
                <div className="cell promotion-title-container small-9  large-9 grid-x">
                  <div className="cell small-12">
                    <span className="promo-title">{ product.title }</span>
                  </div>
                  <div className="cell small-12">
                    <p className="product-price">
                      <span>{ currencyFormatUS(productPrice(product)) }</span>
                    </p>
                  </div>
                </div>
              </div>
              <span className="cell plus small-12 medium-2">+</span>
              <RTGLink
                data={ {
                  url: productUrl(promo.title, promo.sku),
                  altDesc: promo.title ? promo.title : '',
                } }
                className="card pop-out promotion-product small-12 medium-12 large-5 grid-x"
              >
                { targetQuantity > 1 && <div className="promo-count">qty: { targetQuantity }</div> }
                <div className="promotion-image-container small-3">
                  <img src={ `${ promo.image }&h=150` } alt={ promo.title ? promo.title : promo.sku } />
                </div>
                <div className="cell promotion-title-container small-9 grid-x">
                  <div className="cell small-12">
                    <span className="promo-title">{ promo.title }</span>
                  </div>
                  { promotion.lineItems && promotion.bonusBuyTotal >= 0 && (
                    <div className="cell small-12">
                      <p className="product-price">
                        <span className="strikethrough">
                          { currencyFormatUS(
                            promotion.lineItems.length > 2
                              ? promotion.lineItems[1].unitPrice
                              : promotion.lineItems[0].unitPrice
                          ) }
                        </span>
                        <span className="strikethrough-sale">{ currencyFormatUS(promotion.bonusBuyTotal) }</span>
                      </p>
                    </div>
                  ) }
                </div>
              </RTGLink>
            </div>
            <div className="cell small-12 medium-5 large-3 grid-x center promo-savings-container">
              <div className="cell small-12">
                <p className="promo-total-savings">{ `SAVE ${ currencyFormatUS(promotion.totalSavings) }` }</p>
                <p className="product-price">
                  <span className="strikethrough-sale">{ currencyFormatUS(promotion.cartTotal) }</span>
                </p>
                { finance && finance.financeAmount > 0 && <ProductFinancing financeAmount={ finance.financeAmount } /> }
              </div>
              <div className="cell small-12">
                <AddToCart
                  availability={ productAvailability(product) }
                  product={ product }
                  price={ productPrice(product) }
                  hideShipping={ true }
                  promoDescription={ promoDescription }
                  promoItems={ [promo] }
                  promoQualifierQuantity={ qualifierQuantity }
                  promoTargetQuantity={ targetQuantity }
                  promoTargetPrice={ promotion.bonusBuyTotal }
                  promoStrikethroughPrice={ promotion.lineItems && promotion.lineItems.length > 2
                      ? promotion.lineItems[1].unitPrice
                      : promotion.lineItems[0].unitPrice }
                  buttonText="add offer to cart"
                />
              </div>
            </div>
          </div>
        ) }
      </>
    )
  }
}
export default ProductPromotion
