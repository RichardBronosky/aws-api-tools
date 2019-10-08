import React from 'react'
import classNames from 'classnames'
import '../../../assets/css/components/product/product-parts/pricing.sass'
import { currencyFormatUS } from '../../../lib/helpers/string-helper'

export default ({ price, sale, strikethroughPrice, strikethrough }) => (
  <>
    { strikethrough && (
      <>
        <span className={ classNames('price-tag', { sale: sale, strikethrough: strikethrough }) }>
          { `${ currencyFormatUS(strikethroughPrice) }` }
        </span>
        <span className={ classNames('price-tag', { sale: sale, 'strikethrough-sale': strikethrough }) }>
          { `${ currencyFormatUS(price) }` }
        </span>
      </>
    ) }
    { !strikethrough && <div className={ classNames('price-tag', { sale: sale }) }>{ `${ currencyFormatUS(price) }` }</div> }
  </>
)
