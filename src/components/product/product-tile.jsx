import React from 'react'
import { graphql } from 'gatsby'
import { fetchProductBySku } from '../../lib/services/product'
import ProductInfo from './product-info'
import '../../assets/css/components/product/product-tile.sass'
import '../../assets/css/components/product/views/product-info-grid.sass'
import '../../assets/css/components/product/views/product-info-list.sass'

export default class ProductTile extends React.Component {
  state = {
    product: null,
  }

  componentDidMount() {
    let sku
    if (!this.props.data || this.props.sku) {
      sku = this.props.sku
    } else if (this.props.data.sku) {
      sku = this.props.data.sku
    }
    if ((!this.props.data && sku) || this.props.data.contentful_id) {
      fetchProductBySku(sku).then(
        result => this.setState({ isLoaded: true, product: result }),
        error => this.setState({ isLoaded: true, error })
      )
    }
  }

  swapProductInTile = product => {
    this.setState({ product })
  }

  render() {
    const { fullWidth, gridWidth, viewType, source, index, displayQuantity, data, last } = this.props
    /* Pass product variations from props to maintain variation order */
    const orderedProductVariations = data && data.variations ? data.variations : null
    return (
      <>
        { (this.state.product || (data && data.sku)) && (
          <ProductInfo
            data={ this.state.product || data }
            orderedProductVariations={ orderedProductVariations }
            fullWidth={ fullWidth }
            viewType={ viewType ? viewType : 'grid' }
            index={ index }
            source={ source }
            gridWidth={ gridWidth }
            displayQuantity={ displayQuantity }
            setProduct={ this.swapProductInTile }
            last={ last }
          />
        ) }
      </>
    )
  }
}

export const ProductTileFragment = graphql`
  fragment ProductTile on ContentfulProductTile {
    sku
    contentful_id
    __typename
  }
`
