import React from 'react'
import { graphql } from 'gatsby'
import { CreateContent } from '../../lib/helpers/contentful-mapping'

export default ({ data }) => <>{ data.groupContent && CreateContent(data.groupContent, null, true) }</>

export const contentGroupFragment = graphql`
  fragment ContentGroup on ContentfulContentGroup {
    name
    groupContent: content {
      ...Banner
      ...Slider
      ...Grid
    }
    contentful_id
    __typename
  }
`
