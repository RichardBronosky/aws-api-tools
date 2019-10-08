import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import SearchResults from '../components/search/search-results'
import '../assets/css/pages/search.sass'
import { setupAnalytics } from '../lib/helpers/google-tag-manager'
import QueryRuleCustomData from '../components/shared/query-rule-custom-data'

const displayFacets = ['brand', 'color_family', 'material_family', 'style']

export default class SearchPage extends React.Component {
  componentDidMount() {
    const pagePath = this.props.pageContext ? this.props.pageContext.matchPath.replace('*', '') : '/search'
    setupAnalytics({ pageData: { type: 'search', title: 'Search', path: pagePath } })
  }

  componentDidUpdate(prevProps) {
    if (prevProps['*'] !== this.props['*']) {
      window.location.reload()
    }
  }

  render() {
    return (
      <Layout { ...this.props }>
        <Helmet meta={ [{ name: 'robots', content: 'noindex, nofollow' }] } />
        <QueryRuleCustomData />
        <SearchResults
          displayFilters={ displayFacets }
          matchPath={ this.props.pageContext ? this.props.pageContext.matchPath.replace('*', '') : '/search' }
          source={ 'search' }
        />
      </Layout>
    )
  }
}
