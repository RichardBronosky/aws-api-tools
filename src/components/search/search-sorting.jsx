import React, { Component } from 'react'
import ConnectedSortBy from '../search/connectors/ConnectedSortBy'
import '../../assets/css/components/search/search-sorting.sass'
import classNames from 'classnames'
import { getRegionZone } from '../../lib/helpers/geo-location'

export default class SearchSorting extends Component {
  state = {
    searchIndex: null,
    searchZone: null,
  }

  componentDidMount() {
    this.setState({ searchIndex: this.searchIndex(), searchZone: this.searchZone() })
  }

  searchIndex() {
    return `${ getRegionZone().region }-${ process.env.GATSBY_ENV_SHORT }`
  }

  searchZone() {
    const zone = getRegionZone().zone
    return zone === 0 ? '' : `-zone${ zone }`
  }

  render() {
    const { searchIndex, searchZone } = this.state
    return (
      <div className={ classNames('search-sorting') }>
        { searchIndex && (
          <label>
            Sort By:
            <ConnectedSortBy
              defaultRefinement={ searchIndex }
              items={ [
                {
                  value: searchIndex,
                  label: 'Most Relevant',
                },
                {
                  value: `${ searchIndex }${ searchZone }-price-asc`,
                  label: 'Lowest Price',
                },
                {
                  value: `${ searchIndex }${ searchZone }-price-desc`,
                  label: 'Highest Price',
                },
              ] }
            />
          </label>
        ) }
      </div>
    )
  }
}
