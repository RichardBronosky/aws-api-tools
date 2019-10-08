import '../../assets/css/components/search/search-query.sass'

import React, { Component } from 'react'
import SearchResults from './search-results'
import { Configure } from 'react-instantsearch-dom'
import Helmet from 'react-helmet'
import { createInstantSearch } from 'react-instantsearch-dom/server'
import { graphql } from 'gatsby'
import { navigate } from '../../lib/helpers/link'
import {
  searchStateToUrl,
  urlToSearchState,
  searchHasRefinements,
  getRefinementListFromFilters,
} from '../../lib/helpers/search'
import { refinementsToTitle, seoPageHeadingFromContentfulSeo } from '../../lib/helpers/seo'
import { getRegionZone } from '../../lib/helpers/geo-location'
import { removeFirstAndLastSlash } from '../../lib/helpers/string-helper'
import QueryRuleCustomData from '../shared/query-rule-custom-data'

const { InstantSearch } = createInstantSearch()
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

export default class SearchQuery extends Component {
  constructor(props, context) {
    super(props, context)

    this.query = this.props.data
    this.searchResponse = this.query.fields ? JSON.parse(this.query.fields.response) : null
    this.state = {
      searchState: this.searchResponse ? this.searchResponse.state : { state: null, filters: '' },
      refinementTitle: null,
      searchHasRefinements: false,
      hasMatchPath: this.hasMatchPath(),
      seoPageHeading: seoPageHeadingFromContentfulSeo(this.props.page),
      pageCanonical: this.props.page.location.pathname,
    }
    displayFilters = this.query.resultList.displayFilters ? this.query.resultList.displayFilters : displayFilters
    if (this.props.page.pageResources) {
      let searchStateFromURL = urlToSearchState(
        this.props.page.pageResources.page.path,
        this.props.page.location.pathname,
        displayFilters
      )
      this.state.searchHasRefinements = searchHasRefinements(searchStateFromURL)
      if (!searchStateFromURL.query) {
        searchStateFromURL['query'] = this.query.resultList ? this.query.resultList.keywords : this.query.keywords
      }
      if (this.query && this.query.resultList && this.query.resultList.filters) {
        let filterWithValues = getRefinementListFromFilters(this.query.resultList.filters)
        searchStateFromURL['refinementList'] = searchStateFromURL.refinementList
          ? Object.assign(filterWithValues, searchStateFromURL.refinementList)
          : filterWithValues
      }
      if (this.state.searchHasRefinements) {
        this.state.refinementTitle = refinementsToTitle(searchStateFromURL, this.state.seoPageHeading)
      }
      this.state.searchState = Object.assign(this.state.searchState, searchStateFromURL)
    }
  }

  hasMatchPath() {
    return this.props.data && this.props.data.contentfulPage
      ? removeFirstAndLastSlash(this.props.location.pathname) !==
          removeFirstAndLastSlash(this.props.data.contentfulPage.route)
      : false
  }

  onSearchStateChange(nextState) {
    let searchURL = searchStateToUrl(this.props.page.pageResources.page.path, nextState)
    if (searchURL != this.props.page.location.pathname) {
      //eventually need to optimize to only navigate on sub-facet overrides.
      window.history.pushState({}, window.title, searchURL)
      this.setState({
        searchState: nextState,
        pageCanonical: searchURL,
        refinementTitle: refinementsToTitle(nextState, this.state.seoPageHeading),
      })
    } else {
      this.setState({
        searchState: nextState,
        pageCanonical: searchURL,
        hasMatchPath: this.hasMatchPath(),
      })
    }
  }

  render() {
    return (
      <div className="search-query">
        { this.searchResponse && (
          <InstantSearch
            appId={ process.env.GATSBY_ALGOLIA_APP_ID }
            apiKey={ process.env.GATSBY_ALGOLIA_API_KEY }
            indexName={ `${ getRegionZone().region }-${ process.env.GATSBY_ENV_SHORT }` }
            searchState={ this.state.searchState }
            resultsState={ this.searchResponse }
            onSearchStateChange={ this.onSearchStateChange.bind(this) }
          >
            { this.state.pageCanonical && !this.state.searchHasRefinements && (
              <Helmet
                link={ [
                  {
                    rel: 'canonical',
                    href: `https://www.roomstogo.com${ this.state.pageCanonical }`,
                  },
                ] }
              />
            ) }
            { this.state.searchHasRefinements && (
              <Helmet
                meta={ [
                  {
                    name: 'robots',
                    content: 'noindex, follow',
                  },
                ] }
              />
            ) }
            { this.state.refinementTitle && (
              <Helmet
                title={ `${ this.state.refinementTitle } - Rooms To Go Furniture` }
                meta={ [
                  {
                    name: 'description',
                    content: `${ this.state.refinementTitle } from Rooms To Go. Choose from a variety of colors, styles, sizes, decor, and material etc. Find affordable furniture that will look great in your home. Shop online today.`,
                  },
                ] }
              />
            ) }
            { this.state.refinementTitle && this.state.searchHasRefinements && !this.hasMatchPath() && (
              <section className="seo-page-heading full-width">
                <div className="grid-container">
                  <h1>{ this.state.refinementTitle }</h1>
                </div>
              </section>
            ) }
            <Configure
              query={ this.state.searchState.query }
              filters={ this.state.searchState.filters }
              ruleContexts={ this.query.resultList.ruleContexts }
              enableRules={ !this.state.searchHasRefinements }
            />
            <SearchResults
              displayFilters={ displayFilters }
              matchPath={ this.props.page.pageContext && this.props.page.pageContext.matchPath
                  ? this.props.page.pageContext.matchPath.replace('*', '')
                  : '' }
              gridWidth={ this.query.resultList.gridWidth }
              productType={ this.query.productType }
              source={ 'plp' }
              queryData={ this.query }
            />
          </InstantSearch>
        ) }
      </div>
    )
  }
}
export const SearchQueryFragment = graphql`
  fragment SearchQuery on ContentfulSearchQuery {
    name
    contentful_id
    productType
    resultList {
      region
      keywords
      brand
      size
      decor
      gender
      material_family
      age
      category
      collection
      size
      size_family
      color_family
      sub_category
      style
      comfort
      feature
      technology
      hitsPerPage
      gridWidth
      filters
      displayFilters
      ruleContexts
    }
    fields {
      response
    }
    __typename
  }
`
