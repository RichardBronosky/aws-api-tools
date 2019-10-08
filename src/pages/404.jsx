import React from 'react'
import Layout from '../components/layout'
import { setupAnalytics } from '../lib/helpers/google-tag-manager'
import { StaticQuery, graphql } from 'gatsby'
import { CreateContent } from '../lib/helpers/contentful-mapping'

export default class FourOhFour extends React.Component {
  componentDidMount() {
    setupAnalytics({ pageData: { type: 'other', title: 'Page not found', path: '/404' } })
  }

  render() {
    return (
      <Layout>
        <StaticQuery
          query={ graphql`
            query contentfulPageFourOhFour {
              contentfulPage(contentful_id: { eq: "6dwk2BZFzcaAFl3OeUrjzN" }) {
                ...ContentfulPage
              }
            }
          ` }
          render={ data => (
            <div className="generated-page">
              { data && data.contentfulPage && CreateContent(data.contentfulPage.contentDefault, null, true) }
            </div>
          ) }
        />
      </Layout>
    )
  }
}
