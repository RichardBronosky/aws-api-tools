import React from 'react'
import RTGLink from '../../shared/link'
import { analyticsProduct } from '../../../lib/helpers/google-tag-manager'
import '../../../assets/css/components/product/product-parts/product-variations.sass'
import classnames from 'classnames'
import { productUrl } from '../../../lib/helpers/route'

const renderVariationBody = ({ image, title, sku, variation_value }, noImage) => (
  <>
    { !noImage && (
      <>
        <img src={ `${ image }&h=36` } alt="" aria-hidden="true" role="presentation" />
        <span>{ variation_value }</span>
      </>
    ) }
    { noImage && <span className="text-only">{ variation_value }</span> }
  </>
)

export default ({ variation, index, heading, productSku, handleClick = null, noImage }) => {
  const variationBody = renderVariationBody(variation, noImage)
  if (handleClick) {
    return (
      <button
        aria-current={ productSku === variation.sku ? true : null }
        aria-describedby={ `cell${ productSku }` }
        className={ classnames('product-variation-image', { active: productSku === variation.sku }) }
        onClick={ () => handleClick(variation) }
        key={ `${ variation.title }_${ variation.sku }` }
      >
        { variationBody }
      </button>
    )
  } else {
    return (
      <RTGLink
        noTabIndex={ true }
        className={ classnames('product-variation-image', { active: productSku === variation.sku }) }
        aria-selected={ productSku === variation.sku ? true : null }
        key={ `${ variation.title }_${ variation.sku }` }
        data={ {
          url: productUrl(variation.title ? variation.title : 'product', variation.sku),
        } }
        trackingData={ {
          event: 'ee_click',
          ecommerce: {
            click: {
              list: `variation_${
                heading
                  ? heading
                      .toLowerCase()
                      .split(' ')
                      .join('_')
                  : ''
              }`,
              position: index + 1,
              products: [analyticsProduct(variation, 1, index + 1)],
            },
          },
        } }
      >
        { variationBody }
      </RTGLink>
    )
  }
}
