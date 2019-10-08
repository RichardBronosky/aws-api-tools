import React from 'react'
import { graphql } from 'gatsby'

export default ({ src }) => (
  <img alt="" width="400px" height="300px" src={ src && src.file && src.file.url ? src.file.url : '' } />
)

export const contentfulImage = graphql`
  fragment Image on ContentfulAsset {
    id
    sizes {
      srcSet
      src
      sizes
    }
    file {
      url
      fileName
      contentType
    }
    resolutions {
      width
      height
    }
  }
`
