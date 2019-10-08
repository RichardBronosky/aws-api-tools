import React from 'react'
import { graphql } from 'gatsby'

export default ({ data }) => <span>{ data.text }</span>

export const textFragment = graphql`
  fragment ContentfulText on ContentfulText {
    text
    contentful_id
    __typename
  }
`
