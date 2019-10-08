import React from 'react'
import classNames from 'classnames'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import ProductTile from '../../product/product-tile'
import '../../../assets/css/components/search/connectors/infinite-hits.sass'

export class ConnectedInfiniteHits extends React.Component {
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

  paginationId(index, tab) {
    return index == 0 || index % 20 == 0 ? (tab ? -1 : `pagination_${ index }`) : null
  }

  handleClickKey(e, hits) {
    if (e.event == 'click' || e.key == 'Enter') {
      e.preventDefault()
      const loadedIndex = hits == 20 ? 0 : hits - 20
      const ele = document.getElementById('pagination_' + loadedIndex)
      if (ele) {
        ele.focus()
      }
    }
  }

  render() {
    const { hits, hasMore, refine, gridWidth } = this.props
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
                  id={ this.paginationId(index) }
                  tabIndex={ this.paginationId(index, true) }
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
        { hasMore && (
          <div className="load-button active">
            <button
              onClick={ e => {
                refine()
                this.trackProductImpressions()
                this.handleClickKey(e, hits.length)
              } }
              onKeyDownCapture={ e => this.handleClickKey(e, hits.length) }
              gtm-category="plp"
              gtm-action="load more"
              gtm-label={ hits.length }
            >
              BROWSE MORE
            </button>
          </div>
        ) }
      </div>
    )
  }
}

export default connectInfiniteHits(ConnectedInfiniteHits)
