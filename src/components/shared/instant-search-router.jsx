import React, { Component } from 'react'
import { InstantSearch, Configure } from 'react-instantsearch-dom'
import { getRegionZone } from '../../lib/helpers/geo-location'
import { searchStateToUrl, urlToSearchState } from '../../lib/helpers/search'
import { navigate } from 'gatsby'
let displayFilters = [
  'age',
  'brand',
  'color_family',
  'comfort',
  'decor',
  'feature',
  'gender',
  'height',
  'material_family',
  'piece count',
  'size',
  'size_family',
  'style',
  'technology',
]

export default class InstantSearchRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchState: {},
      previousSearchState: null,
    }
    if (this.props.searchResponse) {
      ;(this.state.searchState = this.props.searchResponse.state), (this.state.searchState.page += 1)
    }
    if (this.props.pageResources) {
      let searchStateFromURL = urlToSearchState(
        this.props.pageResources.page.path,
        this.props.location.pathname,
        displayFilters
      )
      this.state.searchState = Object.assign(this.state.searchState, searchStateFromURL)
    }
  }

  onSearchStateChange(nextState) {
    if (nextState.configure) {
      let searchURL = searchStateToUrl('/search', nextState)
      if (searchURL !== window.location.pathname) {
        window.scrollTo(0, 0)
      }
      if (this.state.searchState.refinementList !== nextState.refinementList && nextState.refinementList) {
        navigate(searchURL)
      }
      if (this.props.location) {
        if (this.state.previousSearchState && this.state.searchState.query !== this.state.previousSearchState.query) {
          window.history.pushState(nextState, document.title, searchURL)
        }
      } else {
        window.history.pushState(nextState, document.title, searchURL)
      }
      this.setState({
        previousSearchState: this.state.searchState,
        searchState: nextState,
      })
    }
  }

  render() {
    return (
      <InstantSearch
        appId={ process.env.GATSBY_ALGOLIA_APP_ID }
        apiKey={ process.env.GATSBY_ALGOLIA_API_KEY }
        indexName={ `${ getRegionZone().region }-${ process.env.GATSBY_ENV_SHORT }` }
        searchState={ this.state.searchState }
        resultsState={ this.props.searchResponse }
        onSearchStateChange={ this.onSearchStateChange.bind(this) }
      >
        { this.state.searchState && (
          <Configure
            filters={ this.state.searchState.filters }
            enableRules={ !Object.keys(this.state.searchState.refinementList || {}).length }
            query={ this.state.searchState.query }
          />
        ) }
        { this.props.children }
      </InstantSearch>
    )
  }
}
