import React from 'react'
import RTGLink from '../shared/link'
import { InView } from 'react-intersection-observer'
import { trackImpression } from '../../lib/helpers/google-tag-manager'
import { decodeHtml } from '../../lib/helpers/string-helper'
import { getRegionSkuList, productAvailability } from '../../lib/helpers/product'
import Banner from '../shared/banner'
import Breadcrumb from '../shared/breadcrumbs'
import SimpleSlider from '../shared/slider'
import ProductInfo from './product-info'
import ProductTile from './product-tile'
import ProductJsonLd from './product-json-ld'
import classNames from 'classnames'
import { getRegionZone } from '../../lib/helpers/geo-location'
import shopIcon from '../../assets/images/shopIcon.png'
import ProductTitlePricing from './product-parts/product-title-pricing'
import ProductPromotions from './product-parts/product-promotions'
import RecentlyViewed from '../shared/recently-viewed'
import { connect } from 'react-redux'
import SaleFlag from '../shared/sale-flag'
import ProductIncludesSlider from './product-parts/product-includes-slider'
import ProductDescription from './product-parts/product-description'
import { isMobile } from 'react-device-detect'

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  createCrumb = (crumb, slugPath) => {
    return {
      altDesc: `View All ${ crumb } Products`,
      id: slugPath,
      slug: slugPath,
      text: crumb,
    }
  }

  generatePDPCrumbs = product => {
    let crumbs = []
    if (product.breadcrumb && product.breadcrumb.breadcrumb_label && product.breadcrumb.breadcrumb_url) {
      crumbs.push(this.createCrumb(product.breadcrumb.breadcrumb_label, product.breadcrumb.breadcrumb_url))
    }
    if (product.title) {
      crumbs.push(this.createCrumb(decodeHtml(product.title), window.location.pathname))
    }
    return {
      crumbs: crumbs,
    }
  }

  scrollToBonusBuys = () => window.scrollTo(0, this.myRef.current.offsetTop - 180)

  render() {
    const { isMobile, product, room, see_in_room, banners } = this.props
    if (product && typeof product !== typeof undefined) {
      const description = product.description
        ? product.description.replace(
            'Assembly required.',
            `<p class="uppercase"><strong>Customer assembly required.</strong></p>`
          )
        : ''
      const region = getRegionZone().region
      const zone = getRegionZone().zone
      let items_in_room = getRegionSkuList(product.items_in_room, region)
      const also_in_collection = getRegionSkuList(product.also_in_collection, region)
      const available_complete_your_room_items = product.complete_your_room_items
        ? product.complete_your_room_items.filter(p => productAvailability(p))
        : null
      const available_you_may_also_like_items = product.you_may_also_like_items
        ? product.you_may_also_like_items.filter(p => productAvailability(p))
        : null
      let promotions
      if (product && product.promotions) {
        promotions = product.promotions[`${ region }_${ zone }`] || product.promotions[`${ region }_0`]
      }
      return (
        <>
          <div
            className={ classNames('product-details', {
              room: room,
            }) }
          >
            <div className="grid-x grid-margin-x ">
              <div className="cell small-12 medium-6">
                <Breadcrumb data={ this.generatePDPCrumbs(product) } includeHeading={ true } />
              </div>

              <div className="cell small-12 medium-6">
                { see_in_room && !product.single_item_room && (
                  <RTGLink
                    className="product-shop-link large-right"
                    data={ {
                      slug: see_in_room.link,
                      title: 'Shop the Room and Save',
                      category: 'pdp',
                      action: 'shop the room and save click',
                      label: 'shop-and-save',
                    } }
                    key={ see_in_room.sku }
                  >
                    <img className="shopIcon" src={ shopIcon } alt="shop-icon" />
                    shop the room &#38; save >
                  </RTGLink>
                ) }
              </div>
            </div>
            <div className="product-details-card grid-margin-y">
              { promotions && (
                <SaleFlag className="promo-flag" onClick={ this.scrollToBonusBuys }>
                  <span role="button" className="ribbon">
                    CLICK FOR BONUS OFFER!
                  </span>
                </SaleFlag>
              ) }
              <div className="cell">
                { product && <ProductInfo data={ product } viewType="list" fullWidth promotions={ promotions } /> }
              </div>
            </div>
            { items_in_room && items_in_room.length > 0 && !product.single_item_room && (
              <div className="grid-container">
                <ProductIncludesSlider items_in_room={ items_in_room } heading="Items in this room" />
              </div>
            ) }

            <ProductDescription product={ product } items_in_room={ items_in_room } />

            { promotions && (
              <div ref={ this.myRef } className="grid-x grid-margin-y grid-margin-x">
                <ProductPromotions
                  product={ product }
                  promotions={ promotions }
                  scrollToBonusBuys={ this.scrollToBonusBuys }
                  promoType={ promotions.offer_template }
                />
              </div>
            ) }
            { also_in_collection && also_in_collection.length > 0 && (
              <div className="grid-container">
                <div className="product-collection-slider grid-x grid-y grid-margin-x grid-margin-y grid-padding-y">
                  <div className="cell small-12">
                    <SimpleSlider
                      data={ {
                        heading: 'ALSO IN THIS COLLECTION',
                      } }
                    >
                      { also_in_collection.map((item, index) => (
                        <ProductTile
                          sku={ item.sku }
                          key={ `collection_items_${ item.sku }` }
                          viewType="grid"
                          index={ index }
                        />
                      )) }
                    </SimpleSlider>
                  </div>
                </div>
              </div>
            ) }
            { available_complete_your_room_items && available_complete_your_room_items.length > 0 && (
              <div className="grid-container">
                <div className="product-collection-slider grid-x grid-y grid-margin-x grid-margin-y grid-padding-y">
                  <div className="cell small-12">
                    <SimpleSlider
                      data={ {
                        heading: 'Complete Your Room',
                      } }
                    >
                      { available_complete_your_room_items.map((item, index) => (
                        <ProductTile
                          sku={ item.sku }
                          key={ `available_complete_your_room_items_${ item.sku }` }
                          viewType="grid"
                          index={ index }
                        />
                      )) }
                    </SimpleSlider>
                  </div>
                </div>
              </div>
            ) }
            { see_in_room && !product.single_item_room && product.see_in_room && (
              <div className="product-in-room cell small-12 grid-x grid-margin-y grid-padding-y">
                <div className="cell small-12">
                  <div className="cell small-12 header">
                    <h2>SEE THE ROOM</h2>
                  </div>
                  <div className="cell small-12 view-all-link">
                    <RTGLink
                      className=" "
                      data={ {
                        heading: 'SEE IN A ROOM',
                        slug: see_in_room.link,
                        text: 'BUY THE ROOM & SAVE >',
                      } }
                    />
                  </div>
                  <RTGLink
                    data={ {
                      slug: see_in_room.link,
                      title: 'See in Room',
                      category: 'pdp',
                      action: 'see in room click',
                      label: 'see-in-room',
                    } }
                  >
                    <img className="see-in-room-slider-img" src={ see_in_room.image } alt={ see_in_room.product.title } />
                  </RTGLink>
                  <ProductTitlePricing product={ see_in_room.product } moreInfo />
                </div>
              </div>
            ) }
            { available_you_may_also_like_items && available_you_may_also_like_items.length > 0 && (
              <div className="product-collection-slider grid-x grid-y grid-margin-x grid-margin-y grid-padding-y">
                <div className="cell small-12 grid-x grid-margin-x">
                  <SimpleSlider
                    data={ {
                      heading: 'You May Also Like',
                    } }
                  >
                    { available_you_may_also_like_items.map((item, index) => (
                      <ProductTile
                        sku={ item.sku }
                        key={ `available_you_may_also_like_items_${ item.sku }` }
                        viewType="grid"
                        index={ index }
                      />
                    )) }
                  </SimpleSlider>
                </div>
              </div>
            ) }
            { banners && banners.bannerPlacementMiddle && (
              <InView
                as="div"
                onChange={ inView => trackImpression(inView, 1, banners.bannerPlacementMiddle) }
                className="product-middle-banner"
                triggerOnce={ true }
              >
                <Banner data={ banners.bannerPlacementMiddle } />
              </InView>
            ) }
            <InView
              onChange={ inView => trackImpression(inView, 2, { title: 'product recently viewed' }) }
              triggerOnce={ true }
            >
              <RecentlyViewed sku={ product.sku } />
            </InView>
          </div>
          { banners && banners.bannerFinancingOptions && (
            <InView
              as="div"
              onChange={ inView => trackImpression(inView, 3, banners.bannerPlacementMiddle) }
              className="product-finance-banner"
              triggerOnce={ true }
            >
              <Banner data={ banners.bannerFinancingOptions } />
            </InView>
          ) }
          <ProductJsonLd product={ product } />
        </>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => {
  return { isMobile: state.global.isMobile }
}

export default connect(mapStateToProps)(ProductDetail)
