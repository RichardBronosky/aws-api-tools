import React from 'react'
import { graphql } from 'gatsby'
import '../../assets/css/components/shared/markdown.sass'

export default ({ data }) => (
  <div className="contentful-markdown">
    { data.markdown.childMarkdownRemark && (
      <div
        dangerouslySetInnerHTML={ {
          __html: data.markdown.childMarkdownRemark.html,
        } }
      />
    ) }
  </div>
)

export const markdownFragment = graphql`
  fragment Markdown on ContentfulMarkdown {
    markdown {
      childMarkdownRemark {
        html
      }
    }
    contentful_id
    __typename
  }
`
