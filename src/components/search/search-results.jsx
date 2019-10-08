import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import SearchFilters from './search-filters'
import SearchSorting from './search-sorting'
import SearchViewSwitcher from './search-view-switcher'
import ConnectedHits from './connectors/ConnectedHits'
import ConnectedCurrentRefinements from './connectors/ConnectedCurrentRefinements'
import ConnectedStats from './connectors/ConnectedStats'
import { addToDataLayer } from '../../lib/helpers/google-tag-manager'
import * as Sentry from '@sentry/browser'
import { Pagination } from 'react-instantsearch-dom'
import ConnectedInfiniteHits from './connectors/ConnectedInfiniteHits'
import ConnectedPagination from './connectors/ConnectedPagination'
import { setPlpGridWidth } from '../../redux/modules/global'

class SearchResults extends React.Component {
  componentDidMount() {
    const { gridWidth } = this.props
    if (gridWidth && !this.props.plpGridWidth) {
      this.props.setPlpGridWidth(gridWidth)
    }
  }

  captureSentryError = (type, message) => {
    const { source, queryData } = this.props
    const setMessage = `Search: (${ source ? source.toUpperCase() : 'unknown' }) ${ message }`
    Sentry.configureScope(scope => {
      scope.setExtra('page', source)
      scope.setExtra('query', queryData)
      scope.setExtra('props', this.props)
    })
    if (type === 'error') {
      Sentry.captureException(setMessage)
    } else {
      Sentry.captureMessage(setMessage)
    }
  }

  setGridWidth = width => {
    addToDataLayer('click', 'plp', 'grid toggle', width)
    this.props.setPlpGridWidth(width)
  }

  render() {
    const { displayFilters, matchPath, productType, source } = this.props
    return (
      <div className="search-results">
        { this.props.matchPath.includes('/search') && (
          <>
            <Helmet title="Search Results - Rooms To Go" />
            <h1 className="home-heading">Search Results</h1>
          </>
        ) }
        <div className={ 'grid-x' }>
          <div className={ 'mobile-filter-head cell small-12' }>
            <div className={ 'filters-dropdown grid-x' }>
              <div className={ 'cell small-4 medium-11 large-12' }>
                <SearchFilters attributes={ displayFilters } matchPath={ matchPath } />
              </div>
            </div>
            <div className={ 'grid-x refinement-pills' }>
              <div className={ 'cell small-4 medium-11 large-12' }>
                <ConnectedCurrentRefinements />
              </div>
            </div>

            <div className={ 'view-results grid-x  ' }>
              <div className={ 'cell  small-12 ' }>
                <ConnectedStats />
                <SearchViewSwitcher
                  gridWidth={ this.props.plpGridWidth }
                  setGridWidth={ this.setGridWidth }
                  productType={ productType }
                />
                <SearchSorting />
              </div>
            </div>
          </div>
          <ConnectedHits
            gridWidth={ this.props.plpGridWidth }
            source={ source }
            captureSentryError={ this.captureSentryError }
          />
          <div className="pagination">
            <ConnectedPagination padding={ 2 } />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { plpGridWidth: state.global.plpGridWidth }
}

const mapDispatchToProps = dispatch => {
  return {
    setPlpGridWidth: plpGridWidth => dispatch(setPlpGridWidth(plpGridWidth)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults)
