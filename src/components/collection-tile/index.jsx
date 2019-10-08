import React from 'react'
import { connect } from 'react-redux'
import { graphql } from 'gatsby'
import CollectionTile from './collection-tile'

class CollectionTileWrapper extends React.PureComponent {
  render() {
    const { data, isMobile } = this.props
    return <CollectionTile collection={ data } isMobile={ isMobile } />
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}

export default connect(mapStateToProps)(CollectionTileWrapper)

export const CollectionTileFragment = graphql`
  fragment CollectionTile on ContentfulCollectionTile {
    name
    heading
    description
    image {
      ...Image
    }
    imageAltText
    mobileImage {
      ...Image
    }
    link {
      ...Link
    }
    contentful_id
    __typename
  }
`
