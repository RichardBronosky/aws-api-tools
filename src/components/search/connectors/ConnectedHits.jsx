import React from 'react'
import classNames from 'classnames'
import { connectHits } from 'react-instantsearch-dom'
import ProductTile from '../../product/product-tile'
import '../../../assets/css/components/search/connectors/infinite-hits.sass'

export class ConnectedHits extends React.Component {
  componentDidMount() {
    this.trackProductImpressions()
  }

  trackProductImpressions() {
    if (window) {
      const productSkus = this.props.hits.map(hit => {
        return hit.sku
      })
      window.dataLayer.push({ event: 'ee_impression', ecommerce: { impressions: productSkus } })
    }
  }

  render() {
    const { hits, gridWidth } = this.props
    return (
      <div
        id="productResultsWrapper"
        role="region"
        aria-label="Product Results"
        tabIndex="-1"
        className="search-wrapper"
      >
        <div className="ais-InfiniteHits">
          <div className="ais-InfiniteHits-list grid-x grid-margin-x grid-margin-y">
            { hits.map((hit, index) => {
              return (
                <div
                  key={ hit.sku }
                  className={ classNames('ais-InfiniteHits-item cell small-12 medium-6', {
                    'large-3 view-4-col': gridWidth > 2,
                  }) }
                >
                  <ProductTile
                    data={ hit }
                    index={ index }
                    gridWidth={ gridWidth }
                    viewType="grid"
                    source="search"
                    last={ index === hits.length - 1 }
                  />
                </div>
              )
            }) }
          </div>
        </div>
      </div>
    )
  }
}

export default connectHits(ConnectedHits)
