import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Footer from './footer'

export default class FooterWrapper extends React.Component {
  state = {
    email: '',
    zip: '',
    error: null,
    success: null,
    submitted: false,
    loading: false,
    fields: [false, false],
  }

  setFooterState = state => this.setState({ ...this.state, ...state })

  render() {
    return (
      <StaticQuery
        query={ graphql`
          query Footer {
            allContentfulFooter {
              edges {
                node {
                  id
                  copyright
                  contact {
                    childMarkdownRemark {
                      html
                    }
                  }
                  sitemap {
                    ...Link
                  }
                  privacyPolicy {
                    ...Link
                  }
                  termsOfUse {
                    ...Link
                  }
                  linkLists {
                    id
                    links {
                      ...Link
                    }
                    headingLink {
                      ...Link
                    }
                  }
                }
              }
            }
          }
        ` }
        render={ data =>
          data.allContentfulFooter.edges.map(({ node }) => (
            <Footer key={ node.id } { ...this.state } node={ node } setState={ this.setFooterState } />
          )) }
      />
    )
  }
}
