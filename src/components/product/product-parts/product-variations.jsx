import React from 'react'
import ProductVariation from './product-variation'
import SimpleSlider from '../../shared/slider'
import '../../../assets/css/components/product/product-parts/product-variations.sass'
import { productAvailability } from '../../../lib/helpers/product'

export default class ProductVariations extends React.Component {
  render() {
    const { variations, heading, type, isMobile, handleVariationClick, productSku, noImage } = this.props
    const availableVariations = variations
      ? variations.filter(v => productAvailability(v) || !v.catalog_availability)
      : []

    let maxSlides = 3
    let minSlides = 2
    if (type === 'team') {
      maxSlides = isMobile ? 3 : 10
    }
    return (
      (availableVariations && availableVariations.length > 1 && (
        <div className={ `product-variation-list cell small-12 large-6 ` }>
          { heading && <div className="variation-heading cell small-1">{ heading }</div> }
          <div className="variation-slider cell small-12">
            <SimpleSlider
              data={ {
                heading: '',
                describedby: `cell${ productSku }`,
              } }
              maxSlides={ maxSlides }
              minSlidesMobile={ minSlides }
              infinite={ true }
            >
              { availableVariations.map((variation, index) => {
                return (
                  <ProductVariation
                    key={ index }
                    index={ index }
                    productSku={ productSku }
                    variation={ variation }
                    handleClick={ handleVariationClick }
                    noImage={ noImage }
                  />
                )
              }) }
            </SimpleSlider>
          </div>
        </div>
      )) ||
      null
    )
  }
}
