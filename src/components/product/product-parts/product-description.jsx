import React from 'react'
import classNames from 'classnames'
import '../../../assets/css/components/product/product-parts/product-description.sass'

class ProductDescription extends React.Component {
  state = {
    expanded: false,
    readMore: false,
  }

  render() {
    const { product, items_in_room, focused } = this.props

    return (
      <>
        { product && (
          <div
            className={ classNames(' grid-x grid-x small-12 cell', {
              'medium-7': product.dimension_image,
            }) }
          >
            { product.description && (
              <div
                className={ classNames(' cell product-description card grid-x small-12', {
                  'read-more-expander': this.state.readMore,
                }) }
              >
                <div className={ classNames(' small-12', { 'medium-7': product.dimension_image }) }>
                  <h2>product description</h2>
                  <div>
                    <p
                      dangerouslySetInnerHTML={ {
                        __html: product.description,
                      } }
                    />
                  </div>
                  <div className="cell small-12 product-dimensions">
                    { product.dimensions && <div>{ `Dimensions: ${ product.dimensions }` }</div> }
                    { items_in_room &&
                      items_in_room.map(item => (
                        <div key={ `items_in_room_${ item.generic_name }` }>
                          { item.dimensions && item.generic_name && (
                            <div className="capitalize">{ `${ item.generic_name } dimensions: ${ item.dimensions }` }</div>
                          ) }
                        </div>
                      )) }
                  </div>
                  <div className="cell small-12">
                    <div className="product-sku">SKU: { product.sku && product.sku.toUpperCase() }</div>
                  </div>
                  { product.swatch && (
                    <div className="fabric-swatches">
                      <button>Request free fabric swatches ></button>
                    </div>
                  ) }
                </div>
                { product.dimension_image && (
                  <div className="description-image small-12 medium-5 grid-y grid-margin-y">
                    <div className=" small-10">
                      <img src={ product.dimension_image } alt="Dimensions" />
                    </div>
                  </div>
                ) }
                <div className="background-white-cover">
                  <button
                    className={ classNames('blue-action-btn-circle', {
                      focused: focused,
                    }) }
                    aria-label="read-more"
                    value="Read More"
                    gtm-category="pdp"
                    gtm-action="expand description"
                    gtm-label={ product.sku }
                    onClick={ e => this.setState({ readMore: !this.state.readMore }) }
                  >
                    { this.state.readMore ? 'read less' : 'read more' }
                  </button>
                </div>
              </div>
            ) }
          </div>
        ) }
      </>
    )
  }
}

export default ProductDescription
