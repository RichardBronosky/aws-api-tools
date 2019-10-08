import React, { useState } from 'react'
import { productPrice, getRequiredAddon } from '@helpers/product'
import { currencyFormatUS } from '@helpers/string-helper'
import { analyticsProduct } from '@helpers/google-tag-manager'
import { productUrl } from '@helpers/route'
import InfoModal from '@shared/info-modal'
import { graphql, StaticQuery } from 'gatsby'
import ContentfulHtml from '@shared/contentful-html'
import RTGLink from '@shared/link'
import '@comp-sass/product/product-parts/product-add-ons.sass'

const ProductAddOns = props => {
  const {
    addons,
    activeAddons,
    heading,
    hasInfoModal,
    requiredHeading,
    addonRemoveProduct,
    addonAddProduct,
    requiredSelected,
    onChangeRequiredAddons,
  } = props
  const addonSkus = activeAddons ? activeAddons.map(addon => (addon ? addon.sku : null)) : []
  const nonRequiredAddons = addons.filter(addon => !addon.addon_required)
  const requiredAddons = addons.filter(addon => addon.addon_required)
  const requiredAddon = getRequiredAddon(requiredAddons)
  const [shouldShowModal, setShouldShowModal] = useState(false)

  let radioName
  if (requiredAddon && requiredAddon.title) {
    radioName = requiredAddon.title.replace(/ /g, '')
  }

  return (
    <div className="grid-container">
      <div className="product-addons grid-x">
        { requiredAddon && requiredAddon.title && (
          <div className="required-addons small-12 medium-6 large-5">
            <div className="addon-heading small-12">
              <p>{ requiredHeading }</p>
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
            <div className="addons small-12">
              <div className="grid-x">
                <div className="required-addon">
                  <fieldset>
                    <legend className="hide508">Please accept or decline "{ requiredAddon.title }"</legend>
                    <div className="radio-option accept">
                      <input
                        required="required"
                        type="radio"
                        name={ `required addon ${ requiredAddon.title }` }
                        id={ radioName }
                        name={ radioName }
                        checked={ requiredSelected }
                        onChange={ e => onChangeRequiredAddons(e.target.checked, requiredAddon) }
                      />
                      <label htmlFor={ radioName } className="radio-label">
                        <span className="grid-y">
                          <span className="small-12" dangerouslySetInnerHTML={ { __html: requiredAddon.title } } />
                          <span className="small-12 price">{ currencyFormatUS(requiredAddon.price) }</span>
                        </span>
                      </label>
                    </div>
                    <div className="radio-option">
                      <input
                        required="required"
                        type="radio"
                        id={ `Decline${ radioName }` }
                        name={ radioName }
                        checked={ requiredSelected === false }
                        onChange={ e => onChangeRequiredAddons(!e.target.checked, requiredAddon) }
                      />
                      <label htmlFor={ `Decline${ radioName }` } className="radio-label">
                        No, I decline { requiredAddon.decline }
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        ) }
        { nonRequiredAddons && nonRequiredAddons.length > 0 && (
          <>
            <div className="non-required-addon small-12 medium-6 large-4">
              <div className="addon-heading cell small-12">{ heading }</div>
              <div className="addons cell small-12 grid-x grid-margin-x">
                <fieldset className="product-addon-block grid-x grid-margin-x cell small-12">
                  <legend className="hide508">Additional Addons</legend>
                  { nonRequiredAddons.map((addon, index) => (
                    <div key={ `addon_${ heading }_${ addon.sku }` }>
                      <div className="checkbox grid-x">
                        <div className="cell small-1">
                          <input
                            id={ `addon_${ addon.sku }` }
                            type="checkbox"
                            checked={ addonSkus.includes(addon.sku) ? true : false }
                            onChange={ () =>
                              addonSkus.includes(addon.sku) ? addonRemoveProduct(addon) : addonAddProduct(addon) }
                            value={ addon.sku }
                          />
                        </div>
                        <div className="cell small-10 grid-x grid-margin-x product-addons-label-price">
                          <div className="cell small-12">
                            <label htmlFor={ `addon_${ addon.sku }` }>
                              { addon.sell_individually && (
                                <RTGLink
                                  data={ {
                                    url: productUrl(addon.title, addon.sku),
                                  } }
                                  trackingData={ {
                                    event: 'ee_click',
                                    ecommerce: {
                                      click: {
                                        list: `addon_${
                                          heading
                                            ? heading
                                                .toLowerCase()
                                                .split(' ')
                                                .join('_')
                                            : ''
                                        }`,
                                        position: index + 1,
                                        products: [analyticsProduct(addon, 1, index + 1)],
                                      },
                                    },
                                  } }
                                >
                                  <span className="hide508">View product page for:</span>
                                  <span dangerouslySetInnerHTML={ { __html: addon.title } } />
                                  { `${ addon.quantity > 1 ? ` (${ addon.quantity })` : '' }` }
                                </RTGLink>
                              ) }
                              { !addon.sell_individually && (
                                <span>
                                  <span className="hide508">View product page for:</span>
                                  <span dangerouslySetInnerHTML={ { __html: addon.title } } />
                                  { `${ addon.quantity > 1 ? ` (${ addon.quantity })` : '' }` }
                                </span>
                              ) }
                            </label>
                          </div>
                          <div className="cell small-12 product-addons-price">
                            { currencyFormatUS(productPrice(addon) * addon.quantity) }
                          </div>
                        </div>
                      </div>
                    </div>
                  )) }
                </fieldset>
              </div>
            </div>
          </>
        ) }
      </div>
      { shouldShowModal &&
        <InfoModal
          label={ 'What is a Bunkie Board?' }
          mdlClass={ 'rtg-bunkie-board-modal' }
          shouldShowModal={shouldShowModal}
          closeModal={ () => setShouldShowModal(false) }
        >
          <StaticQuery
            query={ graphql`
              query BunkieBoardModalInfo {
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

export default ProductAddOns
