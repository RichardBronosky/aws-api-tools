import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InfoModal from '@shared/info-modal'
import { graphql, StaticQuery } from 'gatsby'
import ContentfulHtml from '@shared/contentful-html'
import RTGLink from '@shared/link'
import { currencyFormatUS, slugGenerator } from '@helpers/string-helper'
import { fetchAndAddActiveAddon, removeActiveAddon } from '@helpers/cart'
import { productPrice, isActiveAddon } from '@helpers/product'
import { analyticsProduct } from '@helpers/google-tag-manager'
import '../../../assets/css/components/cart/cart-parts/cart-product-addon.sass'

export default ({ product, activeAddons, cartIndex, productQuantity }) => {
  const [shouldShowModal, setShouldShowModal] = useState(false)

  return (
    <div className="grid-x cart-addons small-12 medium-6 large-8 large-offset-4">
      { product.addon_items
        .filter(addon => addon.addon_required)
        .map(requiredAddon =>
          !isActiveAddon(activeAddons, requiredAddon.sku) ? (
            <div className="addon-required">
              <p key={ `${ requiredAddon.sku }-required-addon` }>
                { requiredAddon.title } ({ requiredAddon.quantity }) <span className="addon-declined">Declined</span>
              </p>
              { requiredAddon.title.indexOf('Bunkie') > -1 && (
                <button
                  gtm-category={ 'bunkie-board-modal' }
                  gtm-action={ 'click' }
                  gtm-label={ 'cart' }
                  className={ 'bunkie-board addon-learn-more' }
                  onClick={ () => setShouldShowModal(true) }
                >
                  What is a bunkie board? &#9432;
              </button>
              ) }
            </div>
          ) : null
        ) }
      <div className="addon-header add small-12 ">Add:</div>
      <ul className="addon-group grid-x">
        { product.addon_items.map(addon => (
          <div key={ `${ addon.sku }-addon` } className="small-12 addon-row">
            { addon.sell_individually && (
              <>
                <RTGLink
                  aria-labelledby={ `labelledby_${ addon.sku }` }
                  data={ {
                    slug: `/furniture/product/${ slugGenerator(addon.title, addon.sku) }`,
                  } }
                  trackingData={ {
                    event: 'ee_click',
                    ecommerce: {
                      click: {
                        list: 'addon_in_cart',
                        position: cartIndex + 1,
                        products: [analyticsProduct(addon, 1, cartIndex + 1)],
                      },
                    },
                  } }
                >
                  { addon.title } ({ addon.quantity }){ ' ' }
                  { currencyFormatUS(productPrice(addon) * addon.quantity * productQuantity) }
                </RTGLink>
              </>
            ) }
            { !addon.sell_individually && (
              <span>
                { addon.title } ({ addon.quantity }){ ' ' }
                { currencyFormatUS(productPrice(addon) * addon.quantity * productQuantity) }
              </span>
            ) }
            <input
              type="checkbox"
              name={ addon.title }
              checked={ isActiveAddon(activeAddons, addon.sku) }
              onChange={ () => {
                isActiveAddon(activeAddons, addon.sku)
                  ? removeActiveAddon(product.sku, addon.sku, cartIndex)
                  : fetchAndAddActiveAddon(product, cartIndex, addon)
              } }
            />
          </div>
        )) }
      </ul>
      { shouldShowModal &&
        <InfoModal
          label={ 'What is a Bunkie Board?' }
          mdlClass={ 'rtg-bunkie-board-modal' }
          shouldShowModal={shouldShowModal}
          closeModal={ () => setShouldShowModal(false) }
        >
          <StaticQuery
            query={ graphql`
              query ModalInfoQuery1 {
                contentfulHtml(contentful_id: { eq: "3j3tLJvWUBQ3Tyx0AMEp0h" }) {
                  ...ContentfulHtml
                }
              }
            ` }
            render={ data => <ContentfulHtml data={ data.contentfulHtml } /> }
          />
        </InfoModal>
      }
    </div>
  )
}
