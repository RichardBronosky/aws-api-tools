import React from 'react'
import { graphql } from 'gatsby'
import SimpleSlider from '../shared/slider'
import ProductTile from '../product/product-tile'
import { getFromBrowserStorage, saveLocalStorage } from '../../lib/helpers/storage'

export default class RecentlyViewed extends React.Component {
  state = {
    recentlyViewed: null,
  }

  componentDidMount() {
    this.addToRecentlyViewed(this.props.sku)
  }

  addToRecentlyViewed = sku => {
    let recentlyViewed = []
    if (typeof window !== 'undefined') {
      recentlyViewed = getFromBrowserStorage('local', 'recentlyViewed')
      if (recentlyViewed || typeof recentlyViewed !== 'undefined') {
        if (!recentlyViewed.includes(sku)) {
          recentlyViewed.unshift(sku)
        }
        if (recentlyViewed.length > 9) {
          recentlyViewed.pop()
        }
        if (sku) {
          saveLocalStorage('recentlyViewed', recentlyViewed)
        }
      } else if (sku) {
        saveLocalStorage('recentlyViewed', [sku])
      }
    }

    this.setState({
      recentlyViewed: recentlyViewed ? recentlyViewed.filter(product => product !== sku) : null,
    })
  }

  render() {
    const { recentlyViewed } = this.state
    return (
      <>
        { recentlyViewed && recentlyViewed.length > 0 && (
          <div className="grid-container">
            <div className="product-collection-slider grid-x grid-margin-x grid-margin-y grid-padding-y">
              <div className="cell small-12">
                <SimpleSlider
                  data={ {
                    heading: 'Your Recently Viewed',
                  } }
                >
                  { recentlyViewed.map((sku, index) => (
                    <ProductTile sku={ sku } key={ sku } viewType="grid" index={ index } />
                  )) }
                </SimpleSlider>
              </div>
            </div>
          </div>
        ) }
      </>
    )
  }
}

export const recentlyViewedFragment = graphql`
  fragment RecentlyViewed on ContentfulRecentlyViewed {
    startDate
    endDate
    contentful_id
  }
`
