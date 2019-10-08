import React from 'react'
import ProductJsonLd from '../product-json-ld'
import { productPrice } from '../../../lib/helpers/product'
import { weekdays, getStandardTime, slugify } from '../../../lib/helpers/string-helper'
import { expandState } from '../../../lib/helpers/geo-location'
import { getStoreName } from '../../../lib/helpers/store-locator'
import RTGLink from '../../shared/link'
import SeeInStores from '../product-parts/product-see-in-stores'
import ProductLIAMap from './product-lia-map'
import '../../../assets/css/components/product/product-lia/product-lia.sass'

export default class ProductLIA extends React.Component {
  getOpen = (store, tomorrow = false) => {
    const today = new Date().getDay()
    const currentDay = tomorrow && today + 1 === 7 ? weekdays[0] : weekdays[today + (tomorrow ? 1 : 0)]
    if (currentDay) {
      const storeOpen = store.storeHours[`${ currentDay.toLowerCase() }Open`]
      const storeClose = store.storeHours[`${ currentDay.toLowerCase() }Closed`]
      if (storeOpen && storeClose) {
        return `${ storeOpen ? `Open from ${ getStandardTime(storeOpen) } to ${ getStandardTime(storeClose) }` : 'Closed' }`
      }
    }
  }

  getHours = (store, day) => {
    const storeOpen = store.storeHours[`${ day.toLowerCase() }Open`]
    const storeClose = store.storeHours[`${ day.toLowerCase() }Closed`]
    if (storeOpen && storeClose) {
      return `${ getStandardTime(storeOpen) } - ${ getStandardTime(storeClose) }`
    }
  }

  render() {
    const { product, store, region, zone, available } = this.props
    let storeName
    if (store) {
      storeName = getStoreName(store)
    }
    if (store) {
      return (
        <>
          <div className="product-lia grid-x">
            <div className="product-img small-12 large-6">
              { product && (
                <span className="product-image">
                  { (product.primary_image || product.grid_image) && (
                    <img
                      src={ `${ product.primary_image || product.grid_image }&h=385` }
                      className="small-image"
                      alt={ product.title }
                    />
                  ) }
                </span>
              ) }
            </div>
            { product.description && (
              <div className="product-desc small-12 large-6">
                <h1 className="product-title" dangerouslySetInnerHTML={ { __html: product.title } } />
                <span className="price">${ productPrice(product, null, region, zone) }</span>
                <RTGLink
                  data={ {
                    url: `${ window && window.location.pathname }`,
                    category: 'product-lia',
                    action: 'click',
                    label: 'buy now',
                  } }
                  className="blue-action-btn"
                >
                  Buy Now
                </RTGLink>
                <h2>product description</h2>
                <div>
                  <p
                    dangerouslySetInnerHTML={ {
                      __html: product.description,
                    } }
                  />
                </div>
                <div className="small-12">
                  { product.dimensions && <div className=" product-dim-sku">{ `Dimensions: ${ product.dimensions }` }</div> }
                </div>
                <div className="small-12 product-dim-sku">SKU: { product.sku && product.sku.toUpperCase() }</div>
              </div>
            ) }
            { available && (
              <div className="map">
                <ProductLIAMap store={ store } />
              </div>
            ) }
            <div className="store-info-lia">
              { available ? (
                <>
                  <span className="on-display">On display to order at:</span>
                  <RTGLink
                    data={ {
                      url: `/stores/${ slugify(expandState(store.state)).toLowerCase() }/${ slugify(
                        store.city.toLowerCase()
                      ) }${ store.storeName ? `-${ slugify(store.storeName.toLowerCase()) }` : '' }-${ slugify(
                        store.storeType.toLowerCase()
                      ) }-${ store.storeNumber }`,
                      text: `${ store.city } -${ store.storeName ? ` ${ store.storeName }` : '' } ${ store.storeType }`,
                      category: 'store',
                      action: 'click',
                      label: `${ store.city } -${ store.storeName ? ` ${ store.storeName }` : '' } ${ store.storeType }`,
                    } }
                    className="store-link"
                  />
                  <span className="info-field">{ store.address1 }</span>
                  { store.address2 && <span className="info-field">{ store.address2 }</span> }
                  <span className="info-field">
                    { store.city }, { store.state }, { store.zip }
                  </span>
                  <RTGLink
                    data={ {
                      url: `tel:${ store.phoneNumber.replace('/', '-') }`,
                      title: `Call ${ storeName } Store`,
                      category: 'store-locator',
                      action: 'call store click',
                      label: storeName,
                    } }
                    className="store-link"
                  >
                    { store.phoneNumber.replace('/', '-') }
                  </RTGLink>
                  <span className="today">
                    <span className="bold">Today: </span>
                    { this.getOpen(store) }
                  </span>
                  <span className="tomorrow">
                    <span className="bold">Tomorrow: </span>
                    { this.getOpen(store, true) }
                  </span>
                </>
              ) : (
                <>
                  <span className="info-field">Not available for display or order at:</span>
                  <RTGLink
                    data={ {
                      url: `/stores/${ slugify(expandState(store.state)).toLowerCase() }/${ slugify(
                        store.city.toLowerCase()
                      ) }${ store.storeName ? `-${ slugify(store.storeName.toLowerCase()) }` : '' }-${ slugify(
                        store.storeType.toLowerCase()
                      ) }-${ store.storeNumber }`,
                      text: `${ store.city } -${ store.storeName ? ` ${ store.storeName }` : '' } ${ store.storeType }`,
                      category: 'store',
                      action: 'click',
                      label: `${ store.city } -${ store.storeName ? ` ${ store.storeName }` : '' } ${ store.storeType }`,
                    } }
                    className="store-link"
                  />
                </>
              ) }
              <SeeInStores product={ product } zip={ store.zip } customButtonText="Change Location >" lia />
            </div>
          </div>
          <ProductJsonLd product={ product } />
        </>
      )
    } else {
      return null
    }
  }
}
